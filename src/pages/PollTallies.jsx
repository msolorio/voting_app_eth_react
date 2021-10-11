import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { APP_CONTRACT_ADDRESS } from '../constants';
import AppContract from '../artifacts/contracts/App.sol/App.json';

function PollRunning() {
  const [state, setState] = useState({
    allPolls: []
  });

  useEffect(() => {
    getRunningPolls();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /////////////////////////////////////////////////////////////////////////////////
  async function getRunningPolls() {
    if (!window.ethereum) return;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, provider);
    
    try {
      const polls = await contract.getRunningPolls();
      
      setState({
        ...state,
        allPolls: polls
      });
      
    } catch (err) {
      console.log('Error getting polls ==>', err);
    }
  }

  function renderTallies(options, voteCounts) {
    return options.map((opt, idx) => {
      return (
        <p key={idx}>
          {opt}: {voteCounts[idx].toNumber()}
        </p>
      )
    });
  }

  function renderPolls() {
    return state.allPolls.map((poll, idx) => {
      return (
        <div key={idx}>
          <h2>{poll.title}</h2>
          { poll.description && <p>{poll.description}</p> }
          { renderTallies(poll.options, poll.voteCounts) }
        </div>
      )
    });
  }

  return (
    <main>
      <h1>Current Tallies</h1>

      {renderPolls()}
    </main>
  )
}

export default PollRunning;