import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface IButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

const Button = (props: React.PropsWithChildren<IButton>) => {
  const { className, ...customProps } = props;

  return (
    <button className="rounded" {...customProps}>
      {props.children}
    </button>
  );
};

export default Button;
