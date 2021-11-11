import classnames from "classnames";
import { useAwards } from "hooks/awards";
import { useVotes, useCreateVote, useDeleteVote } from "hooks/votes";

interface IAward extends IAwardResource {
  submissionId: string;
  voteId?: string;
  disabled: boolean;
}

const Award = (props: IAward) => {
  const vote = useCreateVote(props.submissionId, props.id);
  const unvote = useDeleteVote(props.voteId);

  return (
    <div
      className={classnames(
        "flex flex-col items-center justify-center border rounded p-2",
        "select-none cursor-pointer",
        {
          "border-indigo-700": props.voteId !== undefined,
          "opacity-20": props.disabled,
        }
      )}
      onClick={() =>
        props.voteId === undefined
          ? vote({
              submission_id: props.submissionId,
              award_id: props.id,
            })
          : unvote()
      }
    >
      <h2 className="text-sm font-bold leading-tight">{props.name}</h2>
      <h3 className="text-xs leading-tight">{props.description}</h3>
    </div>
  );
};

interface IAwardsList {
  projectId: string;
  submissionId: string;
}

const AwardsList = (props: IAwardsList) => {
  const votes = useVotes(props.projectId);
  const awards = useAwards();

  return (
    <div className="flex space-x-2">
      {awards.map((award) => (
        <Award
          key={award.id}
          submissionId={props.submissionId}
          disabled={
            votes.find(
              (vote) =>
                award.id === vote.award_id &&
                props.submissionId !== vote.submission_id
            ) !== undefined
          }
          voteId={
            votes.find(
              (vote) =>
                award.id === vote.award_id &&
                props.submissionId === vote.submission_id
            )?.id
          }
          {...award}
        />
      ))}
    </div>
  );
};

export default AwardsList;
