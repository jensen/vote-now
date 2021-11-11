## Purpose

This project was completed as part of a group learning exercise. It focused on implementing an RLS based approach to auth provided through [supabase](https://supabase.io/).

Inspired by the [https://devjam.vercel.app/](https://devjam.vercel.app/) site an attempt was made to add the ability to vote on projects.

## Demo

[https://modest-newton-235fe0.netlify.app/](https://modest-newton-235fe0.netlify.app/)

<img src="https://user-images.githubusercontent.com/14803/141271963-c6a96e99-e745-44fa-b37c-591756c8ac8a.png" width="768" alt="Projects List" />

## Project Features

Directly from the project description:

> Allow users to vote give multiple choices

This project allows a group of people to decide on coding projects to build as a group. A deadline is set for each project. At the end of a submission phase, users can vote for different awards based on the submitted projects.

After the voting phase ends, the awards are allocated to the users with the most votes.

### User Stories

1. User must enter their name to take part in a poll

In this project we do not require an account to view the projects but a discord login is required to submit or vote.

2. User is shown multiple polls that they can choose from

Each project is a poll, the submitted projects can be voted on.

3. After clicking on a poll, user is shown a voting screen where they can vote on that poll

When a user chooses a project that is in the voting phase, they can choose from a list of awards. Users can't vote for themselves and they cannot vote the same award for two submissions.

4. Store items and votes in a database

It's all in Postgres hosted by [supabase](https://supabase.io).

<img width="236" alt="Screen Shot 2021-11-11 at 12 22 45 AM" src="https://user-images.githubusercontent.com/14803/141271766-e7fffddf-25d5-47d0-ad62-03941d4e7e83.png">

5. After voting, the user should see the results from everyone

When the voting phase is complete the the results are publicly visible for each project.

6. User can only vote once per poll

Well, they can vote multiple times but only once per award per poll.

### Bonus features

1. Only allow authenticated users to vote
2. User can create their own polls

Only admins can create polls in the current implementation. Authenticated users can submit projects and vote. Anonymous users can only view project and submissions.

## Technical Specifications

Decided to use `react-query` for cache this time which is not normalized. We are storing the users, projects, awards, submissions and votes in a PostgreSQL relational database. The API uses [PostgREST](https://postgrest.org/) via [supabase](supabase.io).

> [src/services/projects.ts](src/services/projects.ts):

```ts
export const fetchProjects = () =>
  supabase.from<IProjectResource>("projects").select();
```

Which is a query built to retrieve the list of `projects` on the server. Where an `IProjectResource` has the following interface:

```ts
interface IProjectResource {
  id: string;
  created_at: string;
  updated_at: string;
  started_at: string;
  ended_at: string;
  completed_at: string;
  archived_at: string;
  title: string;
  summary: string;
  complexity: string;
  description: string;
}
```

We can call `fetchProjects` within a custom hook. This makes it easier to manage the cache. All projects retrieved with this hook can share the cache key of `projects`.

> [src/services/projects.ts](src/services/projects.ts):

```ts
export const useProjects = () => {
  const query = useQuery<IProjectResource[], Error>(
    "projects",
    fetchProjects as any
  );

  return query.data || [];
};
```

With this data the layout can be provided for the user to choose a project. When a project is selected, similar code is used to fetch the submissions and awards.

The important timestamps are related to the scheduling of the various phases of the project.

- `started_at`: Start allowing submissions on this date.
- `ended_at`: Stop allowing submissions, and start allowing votes on this date.
- `completed_at`: Stop allowing votes on this date.

The actions that are allowed to be taken by the users for each project is determined by the current date in relation to these values. This is implemented using RLS.

The `submissions` table is RLS enabled. Users can not update or delete submissions. Their ability to `select` submissions is determined by the current date. We can only `insert` submissions in between the `started_at` and `ended_at` dates.

[src/services/schema/tables.sql](src/services/schema/tables.sql):

```sql
create policy "Submissions inserted: project is active, authenticated user"
  on submissions for insert with check (
    auth.role() = 'authenticated'
    and
    get_is_submission_accepted(submissions.project_id)
    and
    get_is_submission_first(submissions.project_id, submissions.user_id)
  );
```

This RLS policy only allows `inserts` when all of the following conditions are met:

1. The user making the request is `authenticated`, this ensures they are logged in using discord and the submission will be tied to a username.
2. The current date is in between the `started_at` and `ended_at` dates of the project.
3. The submission is the first from this user.

The utility function for second constraint is also defined.

[src/services/schema/tables.sql](src/services/schema/tables.sql):

```sql
create or replace function get_is_submission_accepted(_project_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select exists(
      select id
      from projects
      where id = _project_id
      and timezone('utc'::text, now())
      between projects.started_at and projects.ended_at
    );
$$;
```

Since these operations are limited by RLS we can hide any UI that allows the user to add submissions. This techique is used througout the React pages.

### Dependencies

- react@next
- react-router-dom@6
- supabase/js
- react-query
- tailwindcss
- postgres

Great to have the release for [React Router 6](https://reactrouter.com/) for this. I feel like the API has improved, makes it easier to compose routes.

Creating more composable styles from tailwind hasn't been a focus, too much duplicate JSX in the components currently.

The security policies should be tested using something more like [https://github.com/steve-chavez/socnet/tree/master/tests](https://github.com/steve-chavez/socnet/tree/master/tests).

### Auth

An auth API is provided by supabase. The support for providers is growing consistently. We see that [TikTok](https://twitter.com/TheHarryET/status/1458548683428057096) is added around the time of this README commit.

The only provider enabled for this project is [discord](https://discord.com). The API to sign in can be found in [src/context/auth.tsx](src/context/auth.tsx).

```js
supabase.auth.signIn({ provider: "discord" });
```

This is not called directly. It is wrapped in a `login` function. sUsers can login by clicking on the [src/components/LoginButton.tsx](src/components/LoginButton.tsx). When they complete the OAuth redirect the session will be available using the `AuthContext`.

```tsx
<AuthContext.Provider
  value={{
    user: session?.user ?? null,
    login,
    logout,
  }}
>
  {props.children}
</AuthContext.Provider>
```

We can verify that a user is authenticated before allowing them to view pages by combinding the `AuthContext` with React Router.

```tsx
export const VerifyAuthenticated = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};
```

### Responsive

<img src="https://user-images.githubusercontent.com/14803/141272154-4060d71a-9ff9-41e5-8f53-66cd6818037d.png" width="360" alt="Mobile" />

### Incomplete

- Not all the RLS is complete, there also needs to be tests the security configuration
- Styling and tailwind stuff is messy
- Need to write some tests and refactor the component tree
