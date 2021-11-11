import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  fetchVotes,
  fetchVoteResults,
  createVote,
  deleteVote,
} from "services/votes";

export const useVotes = (projectId: string) => {
  const query = useQuery<IVoteResource[], Error>(
    ["votes", projectId],
    fetchVotes(projectId) as any
  );

  return query.data || [];
};

export const useVoteResults = (projectId: string) => {
  const query = useQuery<IResultResource[], Error>(
    ["results", projectId],
    fetchVoteResults(projectId) as any
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

  return {
    status: mutation.isLoading,
    action: (vote: ICreateVoteResource) => mutation.mutate(vote),
  };
};

export const useDeleteVote = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IVoteResource, Error>(deleteVote(id) as any, {
    onSuccess: () => {
      queryClient.invalidateQueries("votes");
    },
  });

  return {
    status: mutation.isLoading,
    action: () => mutation.mutate(),
  };
};
