import React, { useState, useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  //const [workflowStatus, setWorkflowStatus] = useState(0);

  const init = useCallback(async (artifact) => {
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const { abi } = artifact;
      let address, contract, isAdmin; //, voter; //, workflowStatus;

      try {
        address = artifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
      } catch (err) {
        console.error(err);
      }

      // Get the contract owner
      let owner = await contract.methods.owner().call({ from: accounts[0] });
      isAdmin = owner === accounts[0] ? true : false;
      //Check if current user is a registered voter. If so, voter will be defined
      /*try {
        voter = await contract.methods
          .getVoter(accounts[0])
          .call({ from: accounts[0] });
      } catch (error) {
        if (
          error &&
          error.message &&
          error.message.includes("You're not a voter")
        ) {
          console.info("Current user is not a voter");
        }
      }*/

      //console.log("voter:", voter);
      console.log("isAdmin: ", isAdmin);

      dispatch({
        type: actions.init,
        data: {
          artifact,
          web3,
          accounts,
          networkID,
          contract,
          isAdmin,
        },
      });
    }
  }, []);

  /*useEffect(() => {
    (async function () {
      //Keep the current workflow status updated
      const currentStatus = await contract.methods
        .workflowStatus()
        .call({ from: accounts[0] });
      console.log("workflowStatus:", currentStatus);
      if (currentStatus) {
        setWorkflowStatus(parseInt(currentStatus));
        //workflowStatus = parseInt(currentStatus);
      }
    })();
  }, [workflowStatus]);*/

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/Voting.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
