// SPDX-license-Identifier: MIT
pragma solidity ^0.8.27;

contract Voting {
    string[] public candidates;
    mapping(address => bool) public hasVoted;
    mapping(uint256 => uint256) public votes;

    constructor() {
        // Initialize some candidates
        candidates.push("Candidate 1");
        candidates.push("Candidate 2");
        candidates.push("Candidate 3");
    }

    function vote(uint256 candidateIndex) public {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(candidateIndex < candidates.length, "Invalid candidate.");

        hasVoted[msg.sender] = true;
        votes[candidateIndex] += 1;
    }

    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }

    function getVotes(uint256 candidateIndex) public view returns (uint256) {
        require(candidateIndex < candidates.length, "Invalid candidate index.");
        return votes[candidateIndex];
    }
}
