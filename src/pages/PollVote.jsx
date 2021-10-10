import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AppContract from '../artifacts/contracts/App.sol/App.json';
import cloneDeep from 'clone-deep';

import { APP_CONTRACT_ADDRESS } from '../constants';

function PollVote() {
  const [state, setState] = useState({
    allPolls: [],
    userAddr: ''
  });

  useEffect(() => {
    getRunningPolls();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function requestAccount() {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    return account;
  }


  /////////////////////////////////////////////////////////////////////////////////
  async function getRunningPolls() {
    if (!window.ethereum) return;
    
    const userAddr = await requestAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, provider);
    
    try {
      const polls = await contract.getRunningPolls();
      console.log('All Polls ==>', polls);

      const pollsWSel = polls.map((poll) => {

        // Adds prop to keep track of option selection
        const pollClone = {...poll};
        pollClone.selection = null;

        // Adds prop specifying if user is eligible to vote on poll
        const enabled = !poll.voters.find((voter) => {
          return voter.toLowerCase() === userAddr.toLowerCase();
        });

        pollClone.enabled = enabled;

        return pollClone;
      });
      
      setState({
        ...state,
        allPolls: pollsWSel,
        userAddr: userAddr
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
  function renderOptions(options, pollIdx, enabled) {
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
            disabled={!enabled}
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

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, signer);
    const optIdx = state.allPolls[pollIdx].selection;

    console.log(pollAddr, state.userAddr, optIdx);

    try {
      await contract.handleVote(pollAddr, state.userAddr, pollIdx, optIdx);

      const allPollsClone = cloneDeep(state.allPolls);
      allPollsClone[pollIdx].enabled = false;

      setState({
        ...state,
        allPolls: allPollsClone
      });

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
            {renderOptions(poll.options, idx, poll.enabled)}
          </ul>
          { poll.enabled && <input type="submit" value="Vote" /> }
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

export default PollVote;