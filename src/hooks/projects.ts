import { useQuery, useMutation } from "react-query";
import {
  fetchProjects,
  fetchProject,
  createProject,
  updateProject,
} from "services/projects";

export const useProjects = () => {
  const query = useQuery<IProjectResource[], Error>(
    "projects",
    fetchProjects as any
  );

  return query.data || [];
};

export const useProject = (id: string | undefined) => {
  if (!id) throw new Error("Must include project id");

  const query = useQuery<IProjectResource | null, Error>(
    ["project", id],
    fetchProject(id) as any
  );

  return query.data;
};

export const useCreateProject = (project: ICreateProjectResource) => {
  const mutation = useMutation<IProjectResource, Error, ICreateProjectResource>(
    createProject as any
  );

  return () => mutation.mutate(project);
};

export const useEditProject = (project: ICreateProjectResource) => {
  const mutation = useMutation<IProjectResource, Error, ICreateProjectResource>(
    updateProject as any
  );

  return () => mutation.mutate(project);
};
