interface ITag {
  label: string;
}

export const Tag = (props: ITag) => {
  return (
    <span className="px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
      {props.label}
    </span>
  );
};
