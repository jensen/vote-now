import { Suspense } from "react";
import { useParams } from "react-router-dom";
import {
  WarningAlert,
  VStack,
  PrimaryButton,
  InputGroup,
  Input,
  Label,
} from "components/common";
import { useProject } from "hooks/projects";
import { useAuth } from "context/auth";
import { useSubmissions, useCreateSubmission } from "hooks/submissions";
import { useControlledInput } from "hooks/input";
import { withPreventDefault } from "utils/events";
import { isAcceptingSubmissions, isAcceptingVotes } from "utils/status";
import AwardsList from "components/AwardsList";

interface ISubmission extends ISubmissionResource {
  projectId: string;
  allowVote: boolean;
}

const Submission = (props: ISubmission) => {
  const auth = useAuth();

  return (
    <div className="border-b py-2 w-full flex justify-between flex-col sm:flex-row">
      <div>
        <h3 className="text-xs font-regular text-gray-400 leading-3">{`SUBMITTED BY${
          auth.user?.user_metadata.full_name === props.user ? " YOU" : ""
        }`}</h3>
        <h2 className="text-xl">{props.user}</h2>
        <a
          href={props.repository}
          className="text-indigo-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Repository
        </a>
        <br />
        <a
          href={props.deployment}
          className="text-indigo-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Website
        </a>
      </div>
      {props.allowVote && (
        <AwardsList projectId={props.projectId} submissionId={props.id} />
      )}
    </div>
  );
};

interface ISubmissionList {
  projectId: string;
  submissions: ISubmissionResource[];
  allowVote: boolean;
}

const SubmissionList = (props: ISubmissionList) => {
  const { submissions } = props;
  const auth = useAuth();

  if (submissions.length === 0) return null;

  return (
    <VStack>
      <h3 className="text-2xl font-bold tracking-tight text-gray-700 border-b sm:text-3xl">
        Submissions
      </h3>
      {submissions.map((submission) => (
        <Submission
          key={submission.id}
          {...submission}
          projectId={props.projectId}
          allowVote={
            props.allowVote &&
            auth.user !== null &&
            auth.user.user_metadata.full_name !== submission.user
          }
        />
      ))}
    </VStack>
  );
};

interface ISubmissionForm {
  onSubmit: (submission: ICreateSubmissionResource) => void;
}

const SubmissionForm = (props: ISubmissionForm) => {
  const repository = useControlledInput("");
  const deployment = useControlledInput("");

  return (
    <form
      onSubmit={withPreventDefault<React.FormEvent<HTMLFormElement>>(() =>
        props.onSubmit({
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
      </VStack>
      <div className="w-full mt-4">
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </div>
    </form>
  );
};

interface ISubmissions {
  project: IProjectResource;
}

const Submissions = (props: ISubmissions) => {
  const auth = useAuth();
  const submissions = useSubmissions(props.project.id);
  const submit = useCreateSubmission(props.project.id);
  const accepting = isAcceptingSubmissions(props.project);
  const voting = isAcceptingVotes(props.project);

  return (
    <>
      {accepting && auth.user === null && (
        <WarningAlert
          title="Login to Submit"
          description="Must login to submit a project."
        />
      )}
      {voting && auth.user === null && (
        <WarningAlert
          title="Login to Vote"
          description="Must login to vote on a project."
        />
      )}
      {accepting && auth.user && submissions.length === 0 && (
        <div className="mt-4">
          <SubmissionForm onSubmit={submit} />
        </div>
      )}
      <div className="mt-4">
        <SubmissionList
          projectId={props.project.id}
          submissions={submissions}
          allowVote={isAcceptingVotes(props.project)}
        />
      </div>
    </>
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

      <Suspense fallback={null}>
        <Submissions project={project} />
      </Suspense>
    </div>
  );
};

export default Project;
