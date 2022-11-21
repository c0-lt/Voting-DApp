import AddProposalBtn from "./AddProposalBtn";
//import useEth from "../../../contexts/EthContext/useEth";
import Voters from "./Voters";
import ListProposals from "./ListProposals";

function VotersPanel({ workflowStatus, voter, setVoter }) {
  /*const {
    state: { isAdmin },
  } = useEth();*/

  return (
    <div className="votersPanel">
      <h2>Voters panel</h2>
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
