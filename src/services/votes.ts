import supabase from "services";

export const fetchVotes = (projectId: string) => () =>
  supabase
    .from("awarded_submissions")
    .select("id, submission_id, award_id")
    .match({ project_id: projectId })
    .then((response) => response.data);

export const fetchVoteResults = (projectId: string) => () =>
  supabase
    .from("results")
    .select()
    .match({ project_id: projectId })
    .then((response) => response.data);

export const createVote = (vote: ICreateVoteResource) =>
  supabase.from("votes").insert({ ...vote });

export const deleteVote = (id: string | undefined) => () =>
  supabase.from("votes").delete().match({ id });
