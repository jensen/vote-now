import React from "react";

interface IVStack {}

export const VStack = (props: React.PropsWithChildren<IVStack>) => {
  return <div className="flex flex-col space-y-2">{props.children}</div>;
};

interface IHStack {}

export const HStack = (props: React.PropsWithChildren<IHStack>) => {
  return <div className="flex space-x-2">{props.children}</div>;
};
