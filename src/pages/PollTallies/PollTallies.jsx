import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { APP_CONTRACT_ADDRESS } from '../../constants';
import AppContract from '../../artifacts/contracts/App.sol/App.json';
import './PollTallies.css';

function PollRunning() {
  const [state, setState] = useState({
    allPolls: [],
    processing: false
  });

  useEffect(() => {
    getRunningPolls();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /////////////////////////////////////////////////////////////////////////////////
  async function getRunningPolls() {
    if (!window.ethereum) return;

    setState({
      ...state,
      processing: true
    });
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, provider);
    
    try {
      const polls = await contract.getRunningPolls();
      
      setState({
        ...state,
        allPolls: polls,
        processing: false
      });
      
    } catch (err) {
      console.log('Error getting polls ==>', err);
    }
  }

  function renderTallies(options, voteCounts) {
    return options.map((opt, idx) => {
      return (
        <p className="shortText" key={idx}>
          <span className="tallies-count">
            {voteCounts[idx].toNumber()}
          </span>
          <span>{opt}</span>
        </p>
      )
    });
  }

  function renderPolls() {
    return state.allPolls.map((poll, idx) => {
      return (
        <div className="section" key={idx}>
          <h2 className="subHeader">{poll.title}</h2>
          { poll.description && <p className="description">{poll.description}</p> }
          { renderTallies(poll.options, poll.voteCounts) }
        </div>
      )
    });
  }

  if (state.processing) return <main className="main">Retrieving all Polls...</main>;

  return (
    <main className="main">
      <h2 className="pageHeader">Current Tallies</h2>

      {renderPolls()}
    </main>
  )
}

export default PollRunning;