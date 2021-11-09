import supabase from "services";

export const fetchVotes = (submissionId: string) => () =>
  supabase
    .from("votes")
    .select()
    .match({ submission_id: submissionId })
    .then((response) => response.data);

export const createVote = (vote: ICreateVoteResource) =>
  supabase.from("votes").insert({ ...vote });

export const deleteVote = (id: string | undefined) => () =>
  supabase.from("votes").delete().match({ id });
