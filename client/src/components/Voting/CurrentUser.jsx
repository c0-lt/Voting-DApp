import { useState, useEffect } from "react";
import {
  WorkflowStatusNames,
  WorkflowStatus,
} from "../../contexts/EthContext/state";
import useEth from "../../contexts/EthContext/useEth";

function CurrentUser({ workflowStatus, voter }) {
  const [winningProp, setWinningProp] = useState(0);
  const [isRegistered, setIsRegistered] = useState("❌");
  const [hasVoted, setHasVoted] = useState("⏳");
  const {
    state: { accounts, isAdmin, contract },
  } = useEth();

  useEffect(() => {
    setHasVoted(voter.hasVoted ? "✅" : "⏳");
    setIsRegistered(voter.isRegistered ? "✅" : "❌");
  }, [voter]);

  useEffect(() => {
    (async function () {
      if (workflowStatus === WorkflowStatus.VotesTallied) {
        setWinningProp(
          await contract.methods.winningProposalID().call({ from: accounts[0] })
        );
      }
    })();
  }, [workflowStatus]);

  return (
    <>
      <br />
      <div className="votingStatus">
        <b>
          <i>Voting status : </i>
        </b>
        <i>{WorkflowStatusNames[workflowStatus]}</i>
      </div>
      <br />
      <b>Connected user {isAdmin && "👑"}: </b> {accounts[0]}
      {voter && (
        <>
          <div>
            <b>Registered voter :</b> {isRegistered}
          </div>
        </>
      )}
      {voter && voter.isRegistered && (
        <div>
          <b>Has voted :</b> {hasVoted}
        </div>
      )}
      <br />
      <div className="winningProp">
        {winningProp > 0 && (
          <b>🏆 Winning proposal is number {winningProp} ! 🏆</b>
        )}
      </div>
    </>
  );
}

export default CurrentUser;
