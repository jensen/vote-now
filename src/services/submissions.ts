import supabase from "services";

export const fetchSubmissions = (projectId: string) => () => {
  if (projectId) {
    return supabase
      .from<ISubmissionResource>("public_submissions")
      .select()
      .match({ project_id: projectId })
      .then((response) => response.data);
  }

  return supabase
    .from<ISubmissionResource>("submissions")
    .select()
    .then((response) => response.data);
};

export const createSubmission =
  (projectId: string) => (submission: ICreateSubmissionResource) =>
    supabase
      .from("submissions")
      .insert({ ...submission, project_id: projectId });
