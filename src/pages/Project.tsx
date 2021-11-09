import { useParams } from "react-router-dom";
import { VStack, Button, InputGroup, Input, Label } from "components/common";
import { useProject } from "hooks/projects";
import { useSubmissions, useCreateSubmission } from "hooks/submissions";
import { useControlledInput } from "hooks/input";
import { withPreventDefault } from "utils/events";
import { isAcceptingSubmissions, isAcceptingVotes } from "utils/status";

interface ISubmissionList {
  projectId: string;
}

const SubmissionList = (props: ISubmissionList) => {
  const submissions = useSubmissions(props.projectId);

  return (
    <VStack>
      {submissions.map((submission) => (
        <div className="border p-2 rounded">
          {submission.user.name}, {submission.repository},{" "}
          {submission.deployment}
        </div>
      ))}
    </VStack>
  );
};

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

      {isAcceptingSubmissions(project) && <SubmissionForm projectId={id} />}
      <h3 className="text-xl font-bold tracking-tight text-gray-700  border-b mb-2 sm:text-2xl">
        Submissions
      </h3>
      <SubmissionList projectId={id} />
    </div>
  );
};

export default Project;
