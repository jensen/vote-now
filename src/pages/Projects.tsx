import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useProjects } from "hooks/projects";
import { fetchProject } from "services/projects";
import { Tag, VStack } from "components/common";

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

  console.log(props.locked_at);

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
          <dd className="mt-2 text-sm text-gray-500">12</dd>
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
          <dd className="mt-2 text-sm text-gray-500">Finished</dd>
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
