// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title The Voting Smart Contract
/// @author Cycy la famille
/// @notice Smart Contract pour soumettre des propositions et voter pour celle que l'on préfère
/// @dev Stay away from this or you're facing sleep deprivation
contract Voting is Ownable {
    /// @notice index de la proposition gagnante
    uint256 public winningProposalID;

    struct Voter {
        /// @notice booleen permettant de savoir si le voter est inscrit
        bool isRegistered;
        /// @notice booleen permettant de savoir si le voter a voté
        bool hasVoted;
        /// @notice id de la proposition pour laquelle le voter a voté
        uint256 votedProposalId;
    }

    struct Proposal {
        /// @notice description de la proposition
        string description;
        /// @notice nombre de votes de la proposition
        uint256 voteCount;
    }

    /// @notice : enum permettant de définir l'ensemble des status possibles de la session de vote
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    /// @notice contient l'ensemble des propositions
    Proposal[] proposalsArray;
    /// @notice whitelist des voters
    mapping(address => Voter) voters;

    /// @notice notifie lorsqu'un voter est ajouté
    /// @dev emit de l'event VoterRegistered
    /// @param voterAddress adresse du votant ajoutée
    event VoterRegistered(address voterAddress);

    /// @notice notifie lorsque le statut est changé
    /// @dev emit de l'event WorkflowStatusChange avec le statut avant et apres le changement
    /// @param previousStatus WorkflowStatus précédent le changement
    /// @param newStatus WorkflowStatus après le changement
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    /// @notice notifie lorsqu'une proposition est ajoutée
    /// @dev emit de l'event ProposalRegistered
    /// @param proposalId index de la proposition ajoutée
    event ProposalRegistered(uint256 proposalId);

    /// @notice notifie lorsqu'un voter a voté
    /// @dev emit de l'event Voted avec l'adresse du votant et l'index de la proposition
    /// @param voter adresse du votant ajouté
    /// @param proposalId index de la proposition votée
    event Voted(address voter, uint256 proposalId);

    /// @dev revert si la fonction n'est pas appelée par un voter
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Retourne un voter à partir de son adresse
    /// @dev Retourne Voter
    /// @param _addr adresse d'un voter
    /// @return Voter Retourne un objet Voter représentant le votant
    function getVoter(address _addr)
        external
        view
        onlyVoters
        returns (Voter memory)
    {
        return voters[_addr];
    }

    /// @notice Retourne la proposition à partir de son index dans le tableau des propositions
    /// @dev retourne une Proposal
    /// @param _id index de la proposition dans proposalsArray
    /// @return Proposal Retourne un objet Proposal
    function getOneProposal(uint256 _id)
        external
        view
        onlyVoters
        returns (Proposal memory)
    {
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //

    /// @notice Ajoute un voter dans le tableau de voters
    /// @dev revert si pas appelée par owner
    /// @param _addr adresse du voter
    function addVoter(address _addr) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Voters registration is not open yet"
        );
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //

    /// @notice Ajoute une proposition dans proposalsArray
    /// @dev Revert si appelé par non votant. Revert si proposition vite. Revert si appelé dans un mauvais workflowStatus
    /// @param _desc description de la proposition
    function addProposal(string calldata _desc) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        );
        // Avoid Dos Gas Limit
        require(
            proposalsArray.length < 100,
            "The max number of proposals has been reached"
        );

        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /// @notice Permet à un voter de voter
    /// @param _id index de la proposition dans proposalsArray
    function setVote(uint256 _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /// @notice Autorise la soumission des propositions
    /// @dev Revert si appelée par une personne non propritaire. Revert si appelé dans un mauvais workflowStatus.
    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registering proposals cant be started now"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);

        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    /// @notice Ferme la session d'ajout de propositions
    /// @dev Revert si appelée par une personne non propritaire. Revert si appelé dans un mauvais workflowStatus.
    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Registering proposals havent started yet"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    /// @notice Autorise la session de vote
    /// @dev Revert si appelée par une personne non propritaire. Revert si appelée dans un mauvais workflowStatus.
    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Registering proposals phase is not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    /// @notice Termine la session de vote
    /// @dev Revert si appelée par une personne non propritaire. Revert si appelée dans un mauvais workflowStatus.
    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    /// @notice Définit la proposition gagnante du vote
    /// @dev Revert si appelée par une personne non propritaire. Revert si appelée dans un mauvais workflowStatus.
    function tallyVotes() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnded,
            "Current status is not voting session ended"
        );
        uint256 _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (
                proposalsArray[p].voteCount >
                proposalsArray[_winningProposalId].voteCount
            ) {
                _winningProposalId = p;
            }
        }
        winningProposalID = _winningProposalId;

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }
}
