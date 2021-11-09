-- Users

drop table if exists public.profiles;
create table public.profiles (
  id uuid references auth.users primary key,
  email text,
  name text,
  avatar text,
  admin boolean default false not null
);

create view public.public_profiles as
  select
    id,
    name,
    avatar
  from public.profiles;

alter view public.public_profiles owner to authenticated;

alter table public.profiles
  enable row level security;

create policy "Profiles are only visible by the user who owns it"
  on public.profiles for select using (
    auth.uid() = id
  );
  
drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user();
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id, email, name, avatar)
  values (new.id, new.email, new.raw_user_meta_data::json->>'full_name', new.raw_user_meta_data::json->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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

alter table submissions
  enable row level security;

create policy "Submissions can be selected by anyone"
  on submissions for select using (
    true
  );

create policy "Submissions inserted: project is active by an authenticated user"
  on submissions for insert with check (
    auth.role() = 'authenticated'
    and
    get_is_submission_accepted(project_id)
  );

create or replace function get_is_submission_accepted(project_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select (case when count(id) = 1 then true else false end)
    from projects
    where id = project_id and timezone('utc'::text, now()) between projects.started_at and projects.ended_at;
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
  id uuid default extensions.uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  user_id uuid default auth.uid() not null,
  constraint user_id foreign key(user_id) references users(id) on delete cascade,

  submission_id uuid not null,
  constraint submission_id foreign key(submission_id) references submissions(id) on delete cascade,
  
  award_id uuid not null,
  constraint award_id foreign key(award_id) references awards(id) on delete cascade
);

alter table votes
  enable row level security;

create policy "Votes selected: anon"
  on votes for select using (
    true
  );

create policy "Votes inserted: project voting, authenticated user"
  on votes for insert with check (
    auth.role() = 'authenticated'
    and
    get_is_vote_accepted(submission_id)
    and
    get_is_vote_uncast(submission_id, award_id)
  );

create or replace function get_is_vote_accepted(submission_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select (case when count(projects.id) = 0 then true else false end)
    from submissions
    join projects on projects.id = submissions.project_id
    where submissions.id = submission_id and timezone('utc'::text, now()) between projects.ended_at and projects.completed_at;
$$;

create or replace function get_is_vote_uncast(submission_id uuid, award_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select (case when count(votes.id) = 0 then true else false end)
    from votes
    where votes.submission_id = submission_id and votes.award_id = award_id and votes.user_id = auth.uid();
$$;