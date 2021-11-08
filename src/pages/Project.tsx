import { useParams } from "react-router-dom";
import { VStack, Button, InputGroup, Input, Label } from "components/common";
import { withPreventDefault } from "utils/events";
import { useProject } from "hooks/projects";
import { useCreateSubmission } from "hooks/submissions";
import { useControlledInput } from "hooks/input";

interface ISubmissionForm {
  projectId: string;
}

const SubmissionForm = (props: ISubmissionForm) => {
  const repository = useControlledInput("");
  const deployment = useControlledInput("");

  const submit = useCreateSubmission(props.projectId);

  return (
    <form
      onSubmit={withPreventDefault<React.FormEvent<HTMLFormElement>>(() =>
        submit({
          repository: repository.value,
          deployment: deployment.value,
        })
      )}
    >
      <VStack>
        <InputGroup id="repository">
          <Label>Repository</Label>
          <Input {...repository} />
        </InputGroup>
        <InputGroup id="deployment">
          <Label>Deployment</Label>
          <Input {...deployment} />
        </InputGroup>
        <Button type="submit">Submit</Button>
      </VStack>
    </form>
  );
};

interface IProject {}

const Project = (props: IProject) => {
  const { id } = useParams();
  const project = useProject(id);

  if (!id || !project) throw new Error("No project found");

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        {project.title}
      </h2>
      <p className="mt-4 text-gray-500">{project.summary}</p>

      <SubmissionForm projectId={id} />
    </div>
  );
};

export default Project;
