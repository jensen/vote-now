import { useParams } from "react-router-dom";
import { useProject, useEditProject } from "hooks/projects";
import ProjectForm from "pages/admin/ProjectForm";

const EditProject = () => {
  const { id } = useParams();
  const project = useProject(id);

  const edit = useEditProject(id);

  return <ProjectForm project={project} onSubmit={edit} />;
};

export default EditProject;
