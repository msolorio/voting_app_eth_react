import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AppContract from '../artifacts/contracts/App.sol/App.json';
import cloneDeep from 'clone-deep';

import { APP_CONTRACT_ADDRESS } from '../constants';

function PollIndex() {
  // const [allPolls, setAllPolls] = useState([]);
  const [state, setState] = useState({
    allPolls: [],
    userAddr: '',
  });

  useEffect(() => {
    getPolls();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function requestAccount() {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    return account;
  }


  /////////////////////////////////////////////////////////////////////////////////
  async function getPolls() {
    if (!window.ethereum) return;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, provider);
    
    try {
      const polls = await contract.getPolls();
      console.log('All Polls ==>', polls);

      const pollsWSel = polls.map((poll) => {
        const pollClone = {...poll};
        pollClone.selection = null;
        return pollClone;
      });
      
      setState({
        ...state,
        allPolls: pollsWSel
      });
      
    } catch (err) {
      console.log('Error getting polls ==>', err);
    }
  }


  /////////////////////////////////////////////////////////////////////////////////
  const handleOptSelect = (event, pollIdx, optIdx) => {
    const pollsClone = cloneDeep(state.allPolls);
    pollsClone[pollIdx].selection = optIdx;

    setState({
      ...state,
      allPolls: pollsClone
    });
  }


  /////////////////////////////////////////////////////////////////////////////////
  function renderOptions(options, pollIdx) {
    const selectedIdx = state.allPolls[pollIdx].selection;

    console.log('selectedIdx ==>', selectedIdx);
    
    return options.map((opt, optIdx) => {
      const checked = (
        selectedIdx !== null
        && Number(selectedIdx) === optIdx
      );

      return (
        <li 
          key={`${pollIdx}-${optIdx}`} 
          >
          <input 
            type="radio" 
            name="choice" 
            id={`${pollIdx}-${optIdx}`} 
            value={optIdx} 
            checked={checked}
            onChange={(e) => handleOptSelect(e, pollIdx, optIdx)}
          />
          <label htmlFor={`${pollIdx}-${optIdx}`}>{opt}</label>
        </li>
      );
    });
  }


  /////////////////////////////////////////////////////////////////////////////////
  const handleVote = async (event, pollIdx, pollAddr) => {
    event.preventDefault();

    if (!window.ethereum) return;
    
    const accountAddr = await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, signer);

    // TODO: PASS IN THE OPTION IDX SELECTED FOR THE POLL BEING VOTED ON
    const optIdx = state.allPolls[pollIdx].selection;

    console.log(pollAddr, accountAddr, optIdx);

    try {
      contract.handleVote(pollAddr, accountAddr, optIdx);

    } catch (err) {
      console.error('Error handling vote ==>', err);
    }
  }

  

  /////////////////////////////////////////////////////////////////////////////////
  function renderPolls() {
    return state.allPolls.map((poll, idx) => {
      return (
        <form key={idx} onSubmit={(e) => handleVote(e, idx, poll.pollAddr)}>
          <h2>{poll.title}</h2>
          <p>{poll.description}</p>
          <ul>
            {renderOptions(poll.options, idx)}
          </ul>
          <input type="submit" value="Vote" />
        </form>
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