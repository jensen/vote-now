import { useProjects } from "hooks/projects";
import { useNavigate } from "react-router-dom";

import Button from "components/common/Button";

interface IProjectSettings extends IProjectResource {}

const ProjectSettings = (props: IProjectSettings) => {
  const navigate = useNavigate();
  return (
    <li onClick={() => navigate(`projects/${props.id}`)}>{props.title}</li>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const projects = useProjects();

  return (
    <>
      <ul>
        {projects.map((project) => (
          <ProjectSettings {...project} />
        ))}
      </ul>
      <Button onClick={() => navigate("projects/new")}>New</Button>
    </>
  );
};

export default Admin;
