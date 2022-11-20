import { useState, useEffect } from "react";
import { WorkflowStatus } from "../../../contexts/EthContext/state";
import useEth from "../../../contexts/EthContext/useEth";

function ListProposals({ workflowStatus, voter }) {
  const [proposalsID, setProposalsID] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const {
    state: { contract, accounts },
  } = useEth();

  const vote = async (e) => {
    console.log("Vote for : ", e.target.name);
    await contract.methods.setVote(e.target.name).send({ from: accounts[0] });
    setHasVoted(true);
  };

  useEffect(() => {
    (async function () {
      let oldEvents = await contract.getPastEvents("ProposalRegistered", {
        fromBlock: 0,
        toBlock: "latest",
      });

      let oldies = [];
      oldEvents.forEach((event) => {
        oldies.push(event.returnValues.proposalId);
      });
      console.log("old proposals : ", oldies);

      setProposalsID(oldies);

      await contract.events
        .ProposalRegistered({ fromBlock: "earliest" })
        .on("data", (event) => {
          console.log("New event", event);
          let newEvent = event.returnValues.proposalId;

          setProposalsID((oldies) => [...oldies, newEvent]);
        })
        .on("changed", (changed) => console.log(changed))
        .on("error", (err) => console.error(err))
        .on("connected", (str) =>
          console.log("Connected subscription ID : ", str)
        );
    })();
  }, [contract, accounts]);

  useEffect(() => {
    (async function () {
      console.log("proposals : ", proposalsID);
      let props = [];
      let retrievedProp;

      for (var i = 0; i < proposalsID.length; i++) {
        try {
          retrievedProp = await contract.methods
            .getOneProposal(proposalsID[i])
            .call({ from: accounts[0] });
        } catch (error) {
          if (error.message && error.message.includes("You're not a voter")) {
            console.info("Current user is not a voter");
          }
        }

        let copiedProp = Object.assign({}, retrievedProp);
        // We add the proposalId to the prop
        copiedProp["proposalId"] = proposalsID[i];
        props.push(copiedProp);
      }
      console.log("Props : ", props);

      const propList = props.map((data) => {
        return (
          <li key={data.proposalId}>
            {data.description} - Vote(s) : {data.voteCount}{" "}
            {workflowStatus === WorkflowStatus.VotingSessionStarted &&
              voter.isRegistered &&
              !voter.hasVoted && (
                <button onClick={vote} name={data.proposalId}>
                  Vote for this proposal
                </button>
              )}
          </li>
        );
      });
      setProposals(propList);
    })();
  }, [accounts, contract, proposalsID]);

  return (
    <>
      <h3>Proposals list</h3>
      <div>
        {voter.isRegistered ? (
          proposals.length > 0 ? (
            <ul>{proposals}</ul>
          ) : (
            "No proposals yet"
          )
        ) : (
          "Only voters can access proposals"
        )}
      </div>
    </>
  );
}

export default ListProposals;
