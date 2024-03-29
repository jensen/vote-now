import React from "react";

import {
  VStack,
  Button,
  Input,
  InputGroup,
  TextArea,
  Label,
} from "components/common";
import { useControlledInput } from "hooks/input";
import { withPreventDefault } from "utils/events";

interface IProjectForm {
  project?: IProjectResource | null;
  onSubmit: any;
}

const ProjectForm = ({ project, onSubmit }: IProjectForm) => {
  const title = useControlledInput(project?.title ?? "");
  const summary = useControlledInput(project?.summary ?? "");
  const description = useControlledInput(project?.description ?? "");

  return (
    <form
      onSubmit={withPreventDefault<React.FormEvent<HTMLFormElement>>(() =>
        onSubmit({
          title: title.value,
          summary: summary.value,
          description: description.value,
          complexity: "Intermediate",
          locked_at: new Date().toISOString(),
        })
      )}
    >
      <VStack>
        <InputGroup id="title">
          <Label>Title</Label>
          <Input {...title} />
        </InputGroup>
        <InputGroup id="summary">
          <Label>Summary</Label>
          <TextArea {...summary} />
        </InputGroup>
        <InputGroup id="description">
          <Label>Description</Label>
          <Input {...description} />
        </InputGroup>
        <Button type="submit">{project ? "Save" : "Create"}</Button>
      </VStack>
    </form>
  );
};

export default ProjectForm;
