import { SyntheticEvent } from "react";

export const withStopPropagation =
  <T extends SyntheticEvent>(fn: (event: T) => void) =>
  (event: T) => {
    event.stopPropagation();

    if (fn) {
      fn(event);
    }
  };
