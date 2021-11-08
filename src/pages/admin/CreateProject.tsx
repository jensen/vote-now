import ProjectForm from "pages/admin/ProjectForm";
import { useCreateProject } from "hooks/projects";

const CreateProject = () => {
  const save = useCreateProject();

  return <ProjectForm onSubmit={save} />;
};

export default CreateProject;
