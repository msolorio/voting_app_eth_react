import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import cloneDeep from 'clone-deep';
import AppContract from '../../artifacts/contracts/App.sol/App.json';
import '../../form.css';
import './PollVote.css';

import { APP_CONTRACT_ADDRESS } from '../../constants';

function PollVote() {
  const [state, setState] = useState({
    allPolls: [],
    userAddr: '',
    retrievingPolls: false,
    processingVote: false
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
    
    setState({
      ...state,
      retrievingPolls: true
    });

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
        userAddr: userAddr,
        retrievingPolls: false
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
          className="form-radioGroup"
          key={`${pollIdx}-${optIdx}`} 
        >
          <input 
            className="form-radio"
            type="radio" 
            name="choice" 
            id={`${pollIdx}-${optIdx}`} 
            value={optIdx} 
            checked={checked}
            disabled={!enabled}
            onChange={(e) => handleOptSelect(e, pollIdx, optIdx)}
          />
          <label 
            className="form-radioLabel"
            htmlFor={`${pollIdx}-${optIdx}`}
          >
            {opt}
          </label>
        </li>
      );
    });
  }


  /////////////////////////////////////////////////////////////////////////////////
  const handleVote = async (event, pollIdx, pollAddr) => {
    event.preventDefault();

    if (!window.ethereum) return;

    setState({
      ...state,
      processingVote: true
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, signer);
    const optIdx = state.allPolls[pollIdx].selection;

    console.log(pollAddr, state.userAddr, optIdx);

    try {
      const transaction = await contract.handleVote(pollAddr, state.userAddr, pollIdx, optIdx);
      await transaction.wait();

      const allPollsClone = cloneDeep(state.allPolls);
      allPollsClone[pollIdx].enabled = false;

      setState({
        ...state,
        allPolls: allPollsClone,
        processingVote: false
      });

    } catch (err) {
      console.error('Error handling vote ==>', err);
    }
  }

  

  /////////////////////////////////////////////////////////////////////////////////
  function renderPolls() {
    return state.allPolls.map((poll, idx) => {
      if (!poll.isRunning) return null;

      return (
        <form 
          className="form voteForm"
          key={idx} 
          onSubmit={(e) => handleVote(e, idx, poll.pollAddr)}
        >
          <h2 className="subHeader">{poll.title}</h2>
          <p className="description">{poll.description}</p>
          <ul className="form-radios">
            {renderOptions(poll.options, idx, poll.enabled)}
          </ul>
          { poll.enabled && (
            <input 
              className="form-button buttonSubmit" 
              type="submit" 
              value="Vote" 
            /> 
          )}
        </form>
      )
    });
  }

  if (state.retrievingPolls) return <main className="main">Retrieving all Polls...</main>;

  if (state.processingVote) return <main className="main">Processing your vote...</main>;

  /////////////////////////////////////////////////////////////////////////////////
  return (
    <main className="main">
      <h2 className="pageHeader">All Polls</h2>
      { renderPolls() }
    </main>
  );
}

export default PollVote;