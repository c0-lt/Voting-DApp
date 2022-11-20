import { useState, useEffect } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import {
  WorkflowStatus,
  WorkflowStatusNames,
} from "../../../contexts/EthContext/state";

function SwitchStateBtn({ workflowStatus, setWorkflowStatus }) {
  const {
    state: { contract, accounts },
  } = useEth();

  useEffect(() => {
    (async () => {
      await contract.events
        .WorkflowStatusChange({ fromBlock: "earliest" })
        .on("data", (event) => {
          let newWorkflowStatus = parseInt(event.returnValues.newStatus);
          setWorkflowStatus(newWorkflowStatus);
          console.log(newWorkflowStatus);
        })
        .on("changed", (changed) => console.log(changed))
        .on("error", (error) => console.error(error))
        .on("connected", (str) => console.log(str));
    })();
  }, [contract, accounts, setWorkflowStatus]);

  const switchStatus = async () => {
    const nextStatus = workflowStatus + 1;

    let changeWorkflowStatusCall;
    switch (nextStatus) {
      case WorkflowStatus.ProposalsRegistrationStarted:
        changeWorkflowStatusCall = await contract.methods
          .startProposalsRegistering()
          .send({ from: accounts[0] });
        break;
      case WorkflowStatus.ProposalsRegistrationEnded:
        changeWorkflowStatusCall = await contract.methods
          .endProposalsRegistering()
          .send({ from: accounts[0] });
        break;
      case WorkflowStatus.VotingSessionStarted:
        changeWorkflowStatusCall = await contract.methods
          .startVotingSession()
          .send({ from: accounts[0] });
        break;
      case WorkflowStatus.VotingSessionEnded:
        changeWorkflowStatusCall = await contract.methods
          .endVotingSession()
          .send({ from: accounts[0] });
        break;
      case WorkflowStatus.VotesTallied:
        changeWorkflowStatusCall = await contract.methods
          .tallyVotes()
          .send({ from: accounts[0] });
        break;
      default:
        console.error("Unexpected workflow status specified");
        break;
    }

    if (changeWorkflowStatusCall) {
      setWorkflowStatus(
        changeWorkflowStatusCall.events.WorkflowStatusChange.returnValues
          .nextStatus
      );
    }
  };
  return (
    <div className="btns">
      <button onClick={switchStatus}>
        Switch to next status : {WorkflowStatusNames[workflowStatus + 1]}
      </button>
    </div>
  );
}

export default SwitchStateBtn;
