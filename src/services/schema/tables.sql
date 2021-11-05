CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

CREATE TABLE profiles (
  id uuid references auth.users PRIMARY KEY,
  name text,
  username text unique
);

CREATE TABLE projects (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  locked_at timestamp with time zone NOT NULL,
  
  title text,
  summary text,
  complexity text,
  description text
);

CREATE TABLE submissions (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  repository text,
  deployment text,

  user_id uuid NOT NULL,
  constraint user_id foreign key(user_id) references users(id),

  project_id uuid,
  constraint project_id foreign key(project_id) references projects(id)
);

alter table submissions
  enable row level security;

create policy "Submissions are not visible by anyone"
  on submissions for select using (
    false
  );

CREATE TABLE awards (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

  name text,

  project_id uuid,
  constraint project_id foreign key(project_id) references projects(id)
);

CREATE TABLE votes (
  id uuid DEFAULT extensions.uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

  user_id uuid NOT NULL,
  constraint user_id foreign key(user_id) references users(id),

  submission_id uuid NOT NULL,
  constraint submission_id foreign key(submission_id) references submissions(id),
  
  award_id uuid NOT NULL,
  constraint award_id foreign key(award_id) references awards(id)
);