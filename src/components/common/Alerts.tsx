interface IAlert {
  title: string;
  description: string;
}

interface IWarningAlert extends IAlert {}

export const WarningAlert = (props: IWarningAlert) => {
  return (
    <div
      className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
      role="alert"
    >
      <p className="font-bold">{props.title}</p>
      <p>{props.description}</p>
    </div>
  );
};
