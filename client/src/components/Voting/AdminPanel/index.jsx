import AddVoterBtn from "./AddVoterBtn";
import SwitchStateBtn from "./SwitchStateBtn";

function AdminPanel({ workflowStatus, setWorkflowStatus }) {
  return (
    <div className="adminPanel">
      <h2>👑 Administration panel 👑</h2>
      <AddVoterBtn workflowStatus={workflowStatus} />
      <SwitchStateBtn
        workflowStatus={workflowStatus}
        setWorkflowStatus={setWorkflowStatus}
      />
    </div>
  );
}

export default AdminPanel;
