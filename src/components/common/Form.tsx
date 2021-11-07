import React from "react";
import classnames from "classnames";

const classes = {
  input: classnames(
    "block",
    "w-full p-2",
    "focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
  ),
};

interface IPropsInput
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const Input = (props: IPropsInput) => {
  return <input {...props} className={classnames(classes.input)} />;
};

interface IPropsTextArea
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}

export const TextArea = (props: IPropsTextArea) => {
  return (
    <textarea
      {...props}
      rows={3}
      className={classnames(classes.input)}
    ></textarea>
  );
};

interface IPropsLabel
  extends React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {}

export const Label = (props: React.PropsWithChildren<IPropsLabel>) => {
  return <label {...props}>{props.children}</label>;
};

interface IPropsInputGroup {
  id: string;
}

export const InputGroup = (
  props: React.PropsWithChildren<IPropsInputGroup>
) => {
  return (
    <>
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          const label = { for: props.id };
          const input = { id: props.id };

          return React.cloneElement(
            child,
            Object.assign(
              {},
              child.props,
              child.props.value !== undefined ? input : label
            )
          );
        }
      })}
    </>
  );
};
