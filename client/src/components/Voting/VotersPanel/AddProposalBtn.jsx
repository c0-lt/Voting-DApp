import { useState } from "react";
import { WorkflowStatus } from "../../../contexts/EthContext/state";
import useEth from "../../../contexts/EthContext/useEth";

function AddProposalBtn({ workflowStatus, voter }) {
  const {
    state: { contract, accounts },
  } = useEth();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const write = async (e) => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Proposal can't be empty.");
      return;
    }

    try {
      await contract.methods
        .addProposal(inputValue)
        .send({ from: accounts[0] });
      setInputValue("");
    } catch (error) {
      var msg = error.reason ? error.reason : error.stack;
      console.log(msg);
      alert(msg);
    }
  };

  return (
    <div className="btns">
      {voter &&
        voter.isRegistered &&
        workflowStatus === WorkflowStatus.ProposalsRegistrationStarted && (
          <>
            <button onClick={write} className="input-btn">
              Add a proposal
            </button>
            &nbsp;
            <input
              type="text"
              size="40"
              className="input-field"
              placeholder="Gencives de porc"
              value={inputValue}
              onChange={handleInputChange}
            />
          </>
        )}
    </div>
  );
}

export default AddProposalBtn;
