import { useProjects } from "hooks/projects";
import { useNavigate } from "react-router-dom";

import { Button, DangerButton, Modal, HStack, Tag } from "components/common";

interface IProjectSettings extends IProjectResource {}

const ProjectSettings = (props: IProjectSettings) => {
  const navigate = useNavigate();
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">{props.title}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Tag label={props.complexity} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{props.ended_at}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <HStack>
          <Button onClick={() => navigate(`projects/${props.id}`)}>Edit</Button>
          <DangerButton>Delete</DangerButton>
        </HStack>
      </td>
    </tr>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const projects = useProjects();

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complexity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Locked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <ProjectSettings key={project.id} {...project} />
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-6 py-3">
                      <Button onClick={() => navigate("projects/new")}>
                        New
                      </Button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default Admin;
