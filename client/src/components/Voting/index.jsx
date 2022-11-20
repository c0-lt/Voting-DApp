import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import AdminPanel from "./AdminPanel";
import VotersPanel from "./VotersPanel";
import CurrentUser from "./CurrentUser";

function Voting() {
  const [workflowStatus, setWorkflowStatus] = useState(0);
  const [voter, setVoter] = useState(null);
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
      }
      //Check if current user is a registered voter. If so, voter will be defined
      try {
        setVoter(
          await contract.methods
            .getVoter(accounts[0])
            .call({ from: accounts[0] })
        );
      } catch (error) {
        if (error.message && error.message.includes("You're not a voter")) {
          console.info("Current user is not a voter");
        }
      }
    })();
  }, [contract, workflowStatus, accounts]);

  const voting = (
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
      <VotersPanel workflowStatus={workflowStatus} voter={voter} />
    </>
  );

  return (
    <div className="demo">
      {!artifact ? (
        <NoticeNoArtifact />
      ) : !contract ? (
        <NoticeWrongNetwork />
      ) : (
        voting
      )}
    </div>
  );
}

export default Voting;
