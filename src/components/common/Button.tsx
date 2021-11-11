import classnames from "classnames";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface IButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

export const Button = (props: React.PropsWithChildren<IButton>) => {
  const { className, ...customProps } = props;

  return (
    <button
      className={classnames("w-full px-4 py-2 rounded", className)}
      {...customProps}
    >
      {props.children}
    </button>
  );
};

/* inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 */
export const PrimaryButton = (props: React.PropsWithChildren<IButton>) => (
  <Button
    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    {...props}
  >
    {props.children}
  </Button>
);

/* w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm */

export const DangerButton = (props: React.PropsWithChildren<IButton>) => (
  <Button
    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm "
    {...props}
  >
    {props.children}
  </Button>
);

export const SuccessButton = (props: React.PropsWithChildren<IButton>) => (
  <Button className="text-white bg-green-400" {...props}>
    {props.children}
  </Button>
);
