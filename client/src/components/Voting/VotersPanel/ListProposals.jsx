import { useState, useEffect } from "react";
import { WorkflowStatus } from "../../../contexts/EthContext/state";
import useEth from "../../../contexts/EthContext/useEth";

function ListProposals({ workflowStatus, voter, setVoter }) {
  const [proposalsID, setProposalsID] = useState([]);
  const [proposals, setProposals] = useState([]);
  const {
    state: { contract, accounts },
  } = useEth();

  const vote = async (e) => {
    console.log("Vote for : ", e.target.name);
    await contract.methods.setVote(e.target.name).send({ from: accounts[0] });

    let copiedVoter = Object.assign({}, voter);
    // We update the voter
    copiedVoter["hasVoted"] = true;
    setVoter(copiedVoter);
  };

  // Listen for ProposalRegistered event
  useEffect(() => {
    (async function () {
      if (contract) {
        let oldEvents = await contract.getPastEvents("ProposalRegistered", {
          fromBlock: 0,
          toBlock: "latest",
        });

        let oldProps = [];
        oldEvents.forEach((event) => {
          let prop = event.returnValues.proposalId;
          if (!oldProps.includes(prop)) {
            oldProps.push(prop);
          }
        });
        console.log("Old events ProposalRegistered: ", oldProps);
        setProposalsID(oldProps);

        await contract.events
          .ProposalRegistered({ fromBlock: "earliest" })
          .on("data", (event) => {
            console.log("New event prop registered", event);
            let newProp = event.returnValues.proposalId;
            if (!proposalsID.includes(newProp)) {
              setProposalsID((proposalsID) => [...proposalsID, newProp]);
            }
          })
          .on("changed", (changed) => console.log(changed))
          .on("error", (err) => console.error(err))
          .on("connected", (str) =>
            console.log("Connected subscription ID : ", str)
          );
      }
    })();
  }, []);

  // Retrieve proposals descriptions
  useEffect(() => {
    (async function () {
      if (contract && voter && voter.isRegistered) {
        let props = [];
        let retrievedProp;

        // Rtrieve each description for proposal ID
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
          // We add the proposalId to the prop for HTML logic
          copiedProp["proposalId"] = proposalsID[i];
          props.push(copiedProp);
        }

        const propList = props.map((data) => {
          return (
            <li key={data.proposalId} className="design-padd">
              {data.description} - Vote(s) : {data.voteCount}
              {workflowStatus === WorkflowStatus.VotingSessionStarted &&
                voter.isRegistered &&
                !voter.hasVoted && (
                  <>
                    {" - "}
                    <button onClick={vote} name={data.proposalId}>
                      Vote 🗳
                    </button>
                  </>
                )}
            </li>
          );
        });
        setProposals(propList);
      }
    })();
  }, [proposalsID, accounts, voter]);

  return (
    <>
      <div>
        {voter && voter.isRegistered ? (
          proposals.length > 0 ? (
            <ol>{proposals}</ol>
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
