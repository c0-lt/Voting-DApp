import { useState, useEffect } from "react";
import { WorkflowStatus } from "../../../contexts/EthContext/state";
import useEth from "../../../contexts/EthContext/useEth";

function AddProposalBtn({ workflowStatus }) {
  const {
    state: { contract, accounts },
  } = useEth();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    //if (/^.+$|^$/.test(e.target.value)) {
    setInputValue(e.target.value);
    //}
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
      {workflowStatus === WorkflowStatus.ProposalsRegistrationStarted && (
        <button onClick={write} className="input-btn">
          Add a proposal(
          <input
            type="text"
            placeholder="Chicken wings"
            value={inputValue}
            onChange={handleInputChange}
          />
          )
        </button>
      )}
    </div>
  );
}

export default AddProposalBtn;
