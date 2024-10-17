document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("connectButton")
    .addEventListener("click", connectMetaMask);
  document.getElementById("voteButton").addEventListener("click", castVote);

  async function connectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const account = await signer.getAddress();
        console.log("Connected account:", account);

        const accountElement = document.getElementById("account");
        if (accountElement) {
          accountElement.innerText = `Connected account: ${account}`;
        }

        // Show the voting section now that the account is connected
        document.getElementById("votingSection").style.display = "block";

        // Fetch and display votes count
        await displayVotes();
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed.");
      alert(
        "MetaMask is not installed. Please install MetaMask to use this feature."
      );
    }
  }

  async function castVote() {
    const candidateSelect = document.getElementById("candidateSelect");
    const candidateIndex = candidateSelect.selectedIndex; // Get the index of the selected option
    const voteStatusElement = document.getElementById("voteStatus");

    try {
      const contractAddress = "0x777736f96B60FA22A6B7b791E5c00dc14c0ac167"; // Replace with your deployed contract address
      const abi = [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "candidates",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getCandidates",
          outputs: [
            {
              internalType: "string[]",
              name: "",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "candidateIndex",
              type: "uint256",
            },
          ],
          name: "getVotes",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "hasVoted",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "candidateIndex",
              type: "uint256",
            },
          ],
          name: "vote",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "votes",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ]; // Replace with your contract ABI

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const votingContract = new ethers.Contract(contractAddress, abi, signer);

      // Call the vote function on the contract, passing the index
      const tx = await votingContract.vote(candidateIndex);
      await tx.wait(); // Wait for the transaction to be mined

      voteStatusElement.innerText = `Successfully voted for ${candidateSelect.value}`;
      console.log(`Successfully voted for ${candidateSelect.value}`);

      // Update the votes display after voting
      await displayVotes();
    } catch (error) {
      console.error("Error casting vote:", error);
      voteStatusElement.innerText = "Error casting vote. Please try again.";
    }
  }

  async function displayVotes() {
    const contractAddress = "0x777736f96B60FA22A6B7b791E5c00dc14c0ac167"; // Replace with your deployed contract address
    const abi = [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "candidates",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getCandidates",
        outputs: [
          {
            internalType: "string[]",
            name: "",
            type: "string[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "candidateIndex",
            type: "uint256",
          },
        ],
        name: "getVotes",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "hasVoted",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "candidateIndex",
            type: "uint256",
          },
        ],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "votes",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ]; // Replace with your contract ABI

    const provider = new ethers.BrowserProvider(window.ethereum);
    const votingContract = new ethers.Contract(contractAddress, abi, provider);

    const votesList = document.getElementById("votesList");
    votesList.innerHTML = ""; // Clear the previous votes

    // Get the number of candidates from the contract
    const candidates = await votingContract.getCandidates();

    for (let i = 0; i < candidates.length; i++) {
      const votes = await votingContract.getVotes(i);
      const listItem = document.createElement("li");
      listItem.innerText = `${candidates[i]}: ${votes.toString()} votes`;
      votesList.appendChild(listItem);
    }
  }
});
