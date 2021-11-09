import { useQuery, useQueryClient, useMutation } from "react-query";
import { fetchVotes, createVote, deleteVote } from "services/votes";

export const useVotes = (submissionId: string) => {
  const query = useQuery<IVoteResource[], Error>(
    ["votes", submissionId],
    fetchVotes(submissionId) as any
  );

  return query.data || [];
};

export const useCreateVote = (submissionId: string, awardId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IVoteResource, Error, ICreateVoteResource>(
    createVote as any,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("votes");
      },
    }
  );

  return (vote: ICreateVoteResource) => mutation.mutate(vote);
};

export const useDeleteVote = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IVoteResource, Error>(deleteVote(id) as any, {
    onSuccess: () => {
      queryClient.invalidateQueries("votes");
    },
  });

  return () => mutation.mutate();
};
