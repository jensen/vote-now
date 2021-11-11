import classnames from "classnames";

interface ITag {
  className?: string;
  label: string;
}

export const Tag = (props: ITag) => {
  return (
    <span
      className={classnames(
        "px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
        props.className || ""
      )}
    >
      {props.label}
    </span>
  );
};

interface IEasyTag extends ITag {}

export const EasyTag = (props: IEasyTag) => {
  return (
    <Tag
      {...props}
      className={classnames(
        "bg-green-100 text-green-800",
        props.className || ""
      )}
    />
  );
};

interface IMediumTag extends ITag {}

export const MediumTag = (props: IMediumTag) => {
  return (
    <Tag
      {...props}
      className={classnames(
        "bg-yellow-100 text-yellow-800",
        props.className || ""
      )}
    />
  );
};

interface IHardTag extends ITag {}

export const HardTag = (props: IHardTag) => {
  return (
    <Tag
      {...props}
      className={classnames("bg-red-100 text-red-800", props.className || "")}
    />
  );
};
