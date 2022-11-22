import AddProposalBtn from "./AddProposalBtn";
import Voters from "./Voters";
import ListProposals from "./ListProposals";

function VotersPanel({ workflowStatus, voter, setVoter }) {
  return (
    <div className="votersPanel">
      <h2>📨 Voting board 📨</h2>
      <AddProposalBtn workflowStatus={workflowStatus} voter={voter} />
      <table>
        <tbody>
          <tr>
            <th>Voters list</th>
            <th>Proposals list</th>
          </tr>
          <tr>
            <td>
              <Voters />
            </td>
            <td>
              <ListProposals
                workflowStatus={workflowStatus}
                voter={voter}
                setVoter={setVoter}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VotersPanel;
