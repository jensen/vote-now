import { useQuery, useQueryClient, useMutation } from "react-query";
import { fetchSubmissions, createSubmission } from "services/submissions";

export const useSubmissions = (projectId: string) => {
  const query = useQuery<ISubmissionResource[], Error>(
    "submissions",
    fetchSubmissions(projectId) as any
  );

  return query.data || [];
};

export const useCreateSubmission = (projectId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ISubmissionResource,
    Error,
    ICreateSubmissionResource
  >(createSubmission(projectId) as any, {
    onSuccess: () => {
      queryClient.invalidateQueries("submissions");
    },
  });

  return (submission: ICreateSubmissionResource) => mutation.mutate(submission);
};
