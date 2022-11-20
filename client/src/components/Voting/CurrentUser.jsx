import { useState, useEffect } from "react";
import { WorkflowStatusNames } from "../../contexts/EthContext/state";
import useEth from "../../contexts/EthContext/useEth";

function CurrentUser({ workflowStatus, voter }) {
  const {
    state: { accounts, isAdmin },
  } = useEth();

  let registered = "❌";
  let hasVoted = "";

  console.log("voter in currentUser : ", voter);

  if (voter && voter.isRegistered) {
    registered = "✅";
    hasVoted = voter.hasVoted ? "✅" : "⏳";
  }

  return (
    <>
      <br />
      <b>
        <i>Voting status : </i>
      </b>
      <i>{WorkflowStatusNames[workflowStatus]}</i>
      <br />
      <b>Connected user {isAdmin && "👑"}: </b> {accounts[0]}
      {voter && voter.isRegistered && (
        <>
          <div>
            <b>Registered voter :</b> {registered}
          </div>
          <div>
            <b>Has voted :</b> {hasVoted}
          </div>
        </>
      )}
    </>
  );
}

export default CurrentUser;
