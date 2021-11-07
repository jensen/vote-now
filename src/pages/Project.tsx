import { useParams } from "react-router-dom";

import { useProject } from "hooks/projects";

interface IProject {}

const Project = (props: IProject) => {
  const { id } = useParams();
  const project = useProject(id);

  if (!project) throw new Error("No project found");

  return <div>{project.title}</div>;
};

export default Project;
