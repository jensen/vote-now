import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { isAfter, isBefore } from "date-fns";
import { useProjects } from "hooks/projects";
import { fetchProject } from "services/projects";
import { Tag, VStack } from "components/common";

interface IProjectPreview extends IProjectResource {}

const isAcceptingSubmissions = (start: Date, end: Date) => {
  const now = new Date();
  return isAfter(now, start) && isBefore(now, end);
};

const isVoting = (end: Date, complete: Date) => {
  const now = new Date();
  return isAfter(now, end) && isBefore(now, complete);
};

const getProjectStatus = (start: Date, end: Date, complete: Date) => {
  if (isAcceptingSubmissions(start, end)) {
    return "Accepting Submissions";
  }

  if (isVoting(end, complete)) {
    return "Voting";
  }

  return "Finished";
};

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

  const status = getProjectStatus(
    new Date(props.started_at),
    new Date(props.ended_at),
    new Date(props.completed_at)
  );

  return (
    <div className="rounded-md border p-4" onClick={goto}>
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        {props.title}
      </h2>
      <p className="mt-4 text-gray-500">{props.summary}</p>
      <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
        <div className="border-t border-gray-200 pt-4">
          <dt className="font-medium text-gray-900">Complexity</dt>
          <dd className="mt-2 text-sm text-gray-500">
            <Tag label={props.complexity} />
          </dd>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <dt className="font-medium text-gray-900">Submissions</dt>
          <dd className="mt-2 text-sm text-gray-500">
            {props.submissions.length}
          </dd>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <dt className="font-medium text-gray-900">
            <a href={props.description}>Project Details</a>
          </dt>
          <dd className="mt-2 text-sm text-gray-500"></dd>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <dt className="font-medium text-gray-900">
            <a href={props.description}>Status</a>
          </dt>
          <dd className="mt-2 text-sm text-gray-500">{status}</dd>
        </div>
      </dl>
    </div>
  );
};

const Projects = () => {
  const projects = useProjects();

  return (
    <VStack>
      {projects.map((project) => (
        <ProjectPreview {...project} />
      ))}
    </VStack>
  );
};

export default Projects;
