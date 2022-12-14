import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import AdminPanel from "./AdminPanel";
import VotersPanel from "./VotersPanel";
import CurrentUser from "./CurrentUser";

function Voting() {
  const defaultVoter = {
    isRegistered: false,
    hasVoted: false,
    votedProposalId: 0,
  };
  const [workflowStatus, setWorkflowStatus] = useState(0);
  const [voter, setVoter] = useState(defaultVoter);
  const [admPanel, setAdmPanel] = useState();
  const {
    state: { artifact, accounts, contract, isAdmin },
  } = useEth();

  useEffect(() => {
    (async function () {
      if (contract) {
        //Keep the current workflow status updated
        const currentStatus = await contract.methods
          .workflowStatus()
          .call({ from: accounts[0] });
        console.log("workflowStatus:", currentStatus);
        if (currentStatus) {
          setWorkflowStatus(parseInt(currentStatus));
        }

        //Check if current user is a registered voter. If so, voter will be defined
        try {
          let currentVoter = await contract.methods
            .getVoter(accounts[0])
            .call({ from: accounts[0] });
          setVoter(currentVoter);
        } catch (error) {
          if (error.message && error.message.includes("You're not a voter")) {
            console.info("Current user is not a voter");
            setVoter(defaultVoter);
          }
        }
      }
    })();
  }, [contract, workflowStatus, accounts]);

  useEffect(() => {
    (async function () {
      setAdmPanel(
        <>
          <CurrentUser workflowStatus={workflowStatus} voter={voter} />
          <hr />
          {isAdmin && (
            <>
              <div>
                <AdminPanel
                  workflowStatus={workflowStatus}
                  setWorkflowStatus={setWorkflowStatus}
                />
              </div>
              <hr />
            </>
          )}
          <VotersPanel
            workflowStatus={workflowStatus}
            voter={voter}
            setVoter={setVoter}
          />
        </>
      );
    })();
  }, [workflowStatus, voter, isAdmin]);

  return (
    <div className="demo">
      {!artifact ? (
        <NoticeNoArtifact />
      ) : !contract ? (
        <NoticeWrongNetwork />
      ) : (
        admPanel
      )}
    </div>
  );
}

export default Voting;
