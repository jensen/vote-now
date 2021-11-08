import { useState } from "react";

export const useControlledInput = (initial: string) => {
  const [value, setValue] = useState(initial);

  return {
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setValue(event.target.value),
    value,
  };
};
