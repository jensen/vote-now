import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useProjects } from "hooks/projects";
import { fetchProject } from "services/projects";

interface IProjectPreview extends IProjectResource {}

const ProjectPreview = (props: IProjectPreview) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const goto = () => {
    queryClient.prefetchQuery(
      ["project", props.id],
      fetchProject(props.id) as any
    );
    navigate(props.id);
  };

  return <li onClick={goto}>{props.title}</li>;
};

const Projects = () => {
  const projects = useProjects();

  return (
    <ul>
      {projects.map((project) => (
        <ProjectPreview {...project} />
      ))}
    </ul>
  );
};

export default Projects;
