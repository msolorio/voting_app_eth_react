import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AppContract from '../artifacts/contracts/App.sol/App.json';

import { APP_CONTRACT_ADDRESS } from '../constants';

function PollIndex() {
  const [allPolls, setAllPolls] = useState([]);

  useEffect(() => getPolls(), []);


  /////////////////////////////////////////////////////////////////////////////////
  async function getPolls() {
    if (!window.ethereum) return;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, provider);
    
    try {
      const polls = await contract.getPolls();
      console.log('All Polls ==>', polls);
      
      setAllPolls(polls);
      
    } catch (err) {
      console.log('Error getting polls ==>', err);
    }
  }


  function renderOptions(options, pollIdx) {
    return options.map((opt, idx) => {
      return (
        <li key={idx}>
          <input type="radio" name="choice" id={`${pollIdx}-${idx}`} value={opt} />
          <label htmlFor={`${pollIdx}-${idx}`}>{opt}</label>
        </li>
      );
    });
  }
  

  /////////////////////////////////////////////////////////////////////////////////
  function renderPolls() {
    return allPolls.map((poll, idx) => {
      return (
        <div key={idx}>
          <h2>{poll.title}</h2>
          <p>{poll.description}</p>
          <ul>
            {renderOptions(poll.options, idx)}
          </ul>
        </div>
      )
    });
  }
  

  /////////////////////////////////////////////////////////////////////////////////
  return (
    <main>
      <h1>All Polls</h1>
      { renderPolls() }
    </main>
  );
}

export default PollIndex;