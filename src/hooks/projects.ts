import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  fetchProjects,
  fetchProject,
  createProject,
  updateProject,
  deleteProject,
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

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IProjectResource, Error, ICreateProjectResource>(
    createProject as any,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("projects");
      },
    }
  );

  return (project: ICreateProjectResource) => mutation.mutate(project);
};

export const useEditProject = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IProjectResource, Error, ICreateProjectResource>(
    updateProject(id) as any,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("projects");
        queryClient.invalidateQueries(["project", id]);
      },
    }
  );

  return (project: ICreateProjectResource) => mutation.mutate(project);
};

export const useDeleteProject = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IProjectResource, Error>(
    deleteProject(id) as any,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("projects");
        queryClient.invalidateQueries(["project", id]);
      },
    }
  );

  return () => mutation.mutate();
};
