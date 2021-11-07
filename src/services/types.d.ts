interface IProjectResource {
  id: string;
  created_at: string;
  updated_at: string;
  locked_at: string;
  title: string;
  summary: string;
  complexity: string;
  description: string;
}

interface ICreateProjectResource
  extends Omit<IProjectResource, "id" | "created_at" | "updated_at"> {}
