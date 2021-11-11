import classnames from "classnames";
import { useAwards } from "hooks/awards";
import { useVotes, useCreateVote, useDeleteVote } from "hooks/votes";
import { Spinner } from "components/common";

interface IAward extends IAwardResource {
  submissionId: string;
  voteId?: string;
  disabled: boolean;
}

const Award = (props: IAward) => {
  const vote = useCreateVote(props.submissionId, props.id);
  const unvote = useDeleteVote(props.voteId);

  const voting = vote.status || unvote.status;

  const toggleVote = () => {
    if (voting || props.disabled) return;

    if (props.voteId === undefined) {
      vote.action({
        submission_id: props.submissionId,
        award_id: props.id,
      });
    } else {
      unvote.action();
    }
  };

  return (
    <div
      className={classnames(
        "flex flex-col items-center justify-center border rounded px-4 py-2 relative",
        "select-none cursor-pointer",
        {
          "border-indigo-700": props.voteId !== undefined,
          "opacity-20": props.disabled,
          "transition bg-indigo-700": voting,
        }
      )}
      onClick={toggleVote}
    >
      {voting && <Spinner />}
      <h2
        className={classnames("text-sm font-bold leading-tight", {
          "opacity-0": voting,
        })}
      >
        {props.name}
      </h2>
      <h3
        className={classnames("text-xs leading-tight", {
          "opacity-0": voting,
        })}
      >
        {props.description}
      </h3>
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
    <div className="flex flex-col space-y-2 mt-4 sm:flex-row sm:space-x-2 sm:space-y-0">
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
