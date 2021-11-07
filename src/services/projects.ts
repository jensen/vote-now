import supabase from "services";

export const fetchProjects = () =>
  supabase
    .from<IProjectResource>("projects")
    .select()
    .then((response) => response.data);

export const fetchProject = (id: string) => () =>
  supabase
    .from<IProjectResource>("projects")
    .select()
    .match({ id })
    .then((response) => (response.data?.length ? response.data[0] : null));

export const createProject = (project: ICreateProjectResource) =>
  supabase.from("projects").insert(project);

export const updateProject = (id: string, project: ICreateProjectResource) =>
  supabase.from("projects").update(project).match({ id });
