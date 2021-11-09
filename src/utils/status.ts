import { isAfter, isBefore } from "date-fns";

export const isAcceptingSubmissions = (project: IProjectResource) => {
  const now = new Date();

  return (
    isAfter(now, new Date(project.started_at)) &&
    isBefore(now, new Date(project.ended_at))
  );
};

export const isAcceptingVotes = (project: IProjectResource) => {
  const now = new Date();

  return (
    isAfter(now, new Date(project.ended_at)) &&
    isBefore(now, new Date(project.completed_at))
  );
};

export const getProjectStatus = (project: IProjectResource) => {
  if (isAcceptingSubmissions(project)) return "Accepting Submissions";
  if (isAcceptingVotes(project)) return "Voting";

  return "Finished";
};
