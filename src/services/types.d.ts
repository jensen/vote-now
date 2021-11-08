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
}

interface ICreateProjectResource
  extends Omit<IProjectResource, "id" | "created_at" | "updated_at"> {}
