-- Users

drop table if exists profiles;
create table profiles (
  id uuid references auth.users primary key,
  name text,
  avatar text
);

create table profiles_private (
  id uuid references profiles(id) primary key,
  email text,
  admin boolean default false not null
);

alter table profiles_private
  enable row level security;

create policy "Profiles are only visible by the user who owns it"
  on profiles_private for select using (
    auth.uid() = id
  );
  
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

drop function if exists handle_new_user();
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id, name, avatar)
  values (new.id, new.raw_user_meta_data::json->>'full_name', new.raw_user_meta_data::json->>'avatar_url');
  
  insert into profiles_private (id, email)
  values (new.id, new.email);

  return new;
end;
$$;

create or replace function get_is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
    select admin
    from profiles
    where id = auth.uid()
$$;

-- Projects

create table projects (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  archived_at timestamp with time zone, -- if archived

  started_at timestamp with time zone not null, -- when the project start
  ended_at timestamp with time zone not null, -- when the project ends
  
  completed_at timestamp with time zone not null, -- when voting is locked

  title text,
  summary text,
  complexity text,
  description text
);

alter table projects
  enable row level security;

create policy "Projects selected: anon"
  on projects for select using (
    true
  );

create policy "Projects inserted: admin"
  on projects for insert with check (
    auth.role() = 'authenticated'
    and
    get_is_admin()
  );

create policy "Projects updated: admin"
  on projects for update using (
    auth.role() = 'authenticated'
    and
    get_is_admin()
  );

create policy "Projects deleted: admin"
  on projects for delete using (
    auth.role() = 'authenticated'
    and
    get_is_admin()
  );

-- Submissions

create table submissions (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  repository text,
  deployment text,

  user_id uuid default auth.uid() not null,
  constraint user_id foreign key(user_id) references profiles(id) on delete cascade,

  project_id uuid,
  constraint project_id foreign key(project_id) references projects(id) on delete cascade
);

create view public_submissions as
  select
    submissions.id as id,
    submissions.repository as repository,
    submissions.deployment as deployment,
    submissions.project_id as project_id,
    profiles.name as user
  from submissions
  join profiles on profiles.id = submissions.user_id;

alter view public_submissions owner to authenticated;

alter table submissions
  enable row level security;

create policy "Submissions selected: voting is active"
  on submissions for select using (
    get_is_vote_accepted(submissions.id)
  );

create policy "Submissions inserted: project is active, authenticated user"
  on submissions for insert with check (
    auth.role() = 'authenticated'
    and
    get_is_submission_accepted(project_id)
  );

create or replace function get_is_vote_accepted(_submission_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select (case when count(projects.id) = 1 then true else false end)
    from projects
    join submissions on submissions.project_id = projects.id
    where submissions.id = _submission_id and timezone('utc'::text, now()) between projects.ended_at and projects.completed_at;
$$;

create or replace function get_is_submission_accepted(_project_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select (case when count(id) = 1 then true else false end)
    from projects
    where id = _project_id and timezone('utc'::text, now()) between projects.started_at and projects.ended_at;
$$;

-- Awards

create table awards (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  name text not null,
  description text not null,
  image text
);

-- Votes

create table votes (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  user_id uuid default auth.uid() not null,
  constraint user_id foreign key(user_id) references profiles(id) on delete cascade,

  submission_id uuid not null,
  constraint submission_id foreign key(submission_id) references submissions(id) on delete cascade,
  
  award_id uuid not null,
  constraint award_id foreign key(award_id) references awards(id) on delete cascade
);

alter table votes
  enable row level security;

create policy "Votes selected: owner"
  on votes for select using (
    auth.uid() = votes.user_id
  );

create policy "Votes inserted: voting in progress, single vote, not submitter, authenticated user"
  on votes for insert with check (
    auth.role() = 'authenticated'
    and
    get_is_vote_accepted(submission_id)
    and
    get_is_vote_for_other(submission_id)
    and
    get_is_vote_uncast(submission_id, award_id)
  );

create policy "Votes deleted: owner"
  on votes for delete using (
    auth.uid() = votes.user_id
    and
    get_is_vote_accepted(submission_id)
  );

create or replace function get_is_vote_uncast(_submission_id uuid, _award_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select (case when count(votes.id) = 0 then true else false end)
    from votes
    where votes.submission_id = _submission_id and votes.award_id = _award_id and votes.user_id = auth.uid();
$$;

create or replace function get_is_vote_for_other(_submission_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select (case when count(submissions.id) = 1 then true else false end)
    from submissions
    where submissions.id = _submission_id and submissions.user_id != auth.uid();
$$;