import { useState } from "react";
import AddProposalBtn from "./AddProposalBtn";
import useEth from "../../../contexts/EthContext/useEth";
import Voters from "./Voters";
import ListProposals from "./ListProposals";

function VotersPanel({ workflowStatus, voter }) {
  const {
    state: { isAdmin },
  } = useEth();
  const [value, setValue] = useState("?");

  return (
    <div className="votersPanel">
      <h2>Voters panel</h2>
      <AddProposalBtn workflowStatus={workflowStatus} />
      <Voters />
      <ListProposals workflowStatus={workflowStatus} voter={voter} />
    </div>
  );
}

export default VotersPanel;
