interface IProfileResource {
  name: string;
}

interface IProjectResource {
  id: string;
  created_at: string;
  updated_at: string;
  started_at: string;
  ended_at: string;
  completed_at: string;
  archived_at: string;
  title: string;
  summary: string;
  complexity: string;
  description: string;
  submissions: string[];
}

interface ICreateProjectResource
  extends Omit<IProjectResource, "id" | "created_at" | "updated_at"> {}

interface ISubmissionResource {
  id: string;
  created_at: string;
  updated_at: string;
  repository: string;
  deployment: string;
  user: IProfileResource;
}

interface ICreateSubmissionResource
  extends Omit<
    ISubmissionResource,
    "id" | "created_at" | "updated_at" | "user"
  > {}

interface IAwardResource {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  image?: string;
}

interface IVoteResource {
  id: string;
  created_at: string;
  updated_at: string;
  submission_id: string;
  award_id: string;
}

interface ICreateVoteResource
  extends Omit<IVoteResource, "id" | "created_at" | "updated_at"> {}

interface IResultResource {
  vote_count: {
    [key: string]: string;
  };
  name: string;
  project_id: string;
}
