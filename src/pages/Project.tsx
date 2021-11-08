import { useParams } from "react-router-dom";

import { useProject } from "hooks/projects";

interface IProject {}

const Project = (props: IProject) => {
  const { id } = useParams();
  const project = useProject(id);

  if (!project) throw new Error("No project found");

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        {project.title}
      </h2>
      <p className="mt-4 text-gray-500">{project.summary}</p>
    </div>
  );
};

export default Project;
