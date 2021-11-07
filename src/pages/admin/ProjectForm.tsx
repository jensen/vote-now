import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Button from "components/common/Button";
import { Input, InputGroup, TextArea, Label } from "components/common/Form";
import { VStack } from "components/common/Stack";
import { useCreateProject, useEditProject, useProject } from "hooks/projects";
import { withStopPropagation } from "utils/events";

const useControlledInput = (initial: string) => {
  const [value, setValue] = useState(initial);

  return {
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setValue(event.target.value),
    value,
  };
};

const CreateProject = () => {
  const { id } = useParams();

  const project = useProject(id);

  const title = useControlledInput(project?.title ?? "");
  const summary = useControlledInput(project?.summary ?? "");
  const description = useControlledInput(project?.description ?? "");

  const save = useCreateProject({
    title: title.value,
    summary: summary.value,
    complexity: "Intermediate",
    description: description.value,
    locked_at: new Date().toISOString(),
  });

  const update = useEditProject({
    title: title.value,
    summary: summary.value,
    complexity: "Intermediate",
    description: description.value,
    locked_at: new Date().toISOString(),
  });

  return (
    <form
      onSubmit={withStopPropagation<React.FormEvent<HTMLFormElement>>(
        project ? update : save
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

export default CreateProject;
