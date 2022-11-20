import { useState, useEffect } from "react";
import { WorkflowStatus } from "../../../contexts/EthContext/state";
import useEth from "../../../contexts/EthContext/useEth";

function AddVoterBtn({ workflowStatus }) {
  const {
    state: { contract, accounts },
  } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [registration, setRegistration] = useState(false);

  const handleInputChange = (e) => {
    if (/^.+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const write = async (e) => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a voter address.");
      return;
    }

    try {
      await contract.methods.addVoter(inputValue).send({ from: accounts[0] });
      setInputValue("");
    } catch (error) {
      var msg = error.reason ? error.reason : error.stack;
      console.log(msg);
      alert(msg);
    }
  };

  return (
    <div className="btns">
      {workflowStatus === WorkflowStatus.RegisteringVoters && (
        <button onClick={write} className="input-btn">
          Add a voter(
          <input
            type="text"
            placeholder="0x0abc..."
            value={inputValue}
            onChange={handleInputChange}
          />
          )
        </button>
      )}
    </div>
  );
}

export default AddVoterBtn;
