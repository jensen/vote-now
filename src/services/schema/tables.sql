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
  
  locked_at timestamp with time zone not null,
  
  title text,
  summary text,
  complexity text,
  description text
);

alter table projects
  enable row level security;

create policy "Projects can be selected by anyone"
  on projects for select using (
    true
  );

create policy "Projects can only be inserted by an admin"
  on projects for insert with check (
    auth.role() = 'authenticated'
    and
    get_is_admin()
  );

create policy "Projects can only be updated by an admin"
  on projects for update using (
    auth.role() = 'authenticated'
    and
    get_is_admin()
  );

create policy "Projects can only be deleted by an admin"
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

  user_id uuid not null,
  constraint user_id foreign key(user_id) references users(id) on delete cascade,

  project_id uuid,
  constraint project_id foreign key(project_id) references projects(id) on delete cascade
);

-- Awards

create table awards (
  id uuid default extensions.uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  name text,

  project_id uuid,
  constraint project_id foreign key(project_id) references projects(id) on delete cascade
);

-- Votes

-- 
create table votes (
  id uuid default extensions.uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  user_id uuid not null,
  constraint user_id foreign key(user_id) references users(id) on delete cascade,

  submission_id uuid not null,
  constraint submission_id foreign key(submission_id) references submissions(id) on delete cascade,
  
  award_id uuid not null,
  constraint award_id foreign key(award_id) references awards(id) on delete cascade
);