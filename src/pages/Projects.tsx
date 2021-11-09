import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useProjects } from "hooks/projects";
import { fetchProject } from "services/projects";
import { Tag, VStack } from "components/common";
import { withStopPropagation } from "utils/events";
import { getProjectStatus } from "utils/status";

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

  const status = getProjectStatus(props);

  return (
    <div
      className="rounded-md border p-4 cursor-pointer hover:shadow-lg hover:border-indigo-700"
      onClick={goto}
    >
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        {props.title}
      </h2>
      <p className="mt-4 text-gray-500">{props.summary}</p>
      <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
        <a
          href={props.description}
          onClick={withStopPropagation<React.MouseEvent<HTMLAnchorElement>>()}
          className="text-indigo-700 hover:text-indigo-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project Requirements
        </a>
      </h3>
      <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3 sm:gap-y-12 lg:gap-x-8">
        <div>
          <dt className="font-medium text-gray-900">Status</dt>
          <dd className="mt-2 text-sm text-gray-500">{status}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">Complexity</dt>
          <dd className="mt-2 text-sm text-gray-500">
            <Tag label={props.complexity} />
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">Submissions</dt>
          <dd className="mt-2 text-sm text-gray-500">
            {props.submissions.length}
          </dd>
        </div>
      </dl>
    </div>
  );
};

const Projects = () => {
  const projects = useProjects();
  const sorted = [...projects].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <VStack>
      {sorted.map((project) => (
        <ProjectPreview {...project} />
      ))}
    </VStack>
  );
};

export default Projects;
