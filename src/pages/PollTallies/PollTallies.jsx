import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { APP_CONTRACT_ADDRESS } from '../../constants';
import AppContract from '../../artifacts/contracts/App.sol/App.json';
import './PollTallies.css';

function PollTallies() {
  const [state, setState] = useState({
    allPolls: [],
    retrievingPolls: false,
    closingPoll: false,
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

    setState({
      ...state,
      retrievingPolls: true
    });

    const userAddr = await requestAccount();
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, provider);
    
    try {
      const polls = await contract.getRunningPolls();

      console.log('all polls ==>', polls);
      
      setState({
        ...state,
        allPolls: polls,
        retrievingPolls: false,
        userAddr: userAddr
      });
      
    } catch (err) {
      console.log('Error getting polls ==>', err);
    }
  }

  const handleCloseClick = async (poll, pollIdx) => {
    console.log('close button clicked');

    setState({
      ...state,
      closingPoll: true
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, signer);

    try {
      const transaction = await contract.closePoll(poll.pollAddr, state.userAddr, pollIdx);
      await transaction.wait();

      console.log('after close transaction');

      // - clones poll
      // - updates isRunning
      // - clones allPolls
      // - updates poll in allPollsClone
      const pollClone = { ...state.allPolls[pollIdx] };
      pollClone.isRunning = false;
      const allPollsClone = [ ...state.allPolls ];
      allPollsClone[pollIdx] = pollClone;

      setState({
        ...state,
        allPolls: allPollsClone,
        closingPoll: false
      });

    } catch (err) {
      console.log(err);
    }
  }


  function renderCloseButton(poll, pollIdx) {
    if (!poll.isRunning) {
      return (
        <button className="boxLight notification">Poll Closed</button>
      );
    }

    if (state.userAddr.toLowerCase() === poll.creator.toLowerCase()) {
      return (
        <button 
          className="form-button"
          onClick={() => handleCloseClick(poll, pollIdx)}
        >
          Close Poll
        </button>
      );
    }

    return '';
  }


  function renderTallies(options, voteCounts) {
    return options.map((opt, idx) => {
      return (
        <p className="shortText" key={idx}>
          <span className="boxLight">
            {voteCounts[idx].toNumber()}
          </span>
          <span>{opt}</span>
        </p>
      )
    });
  }

  function renderPolls() {
    console.log('allPolls ==>', state.allPolls);

    return state.allPolls.map((poll, idx) => {
      return (
        <div className="section" key={idx}>
          <h2 className="subHeader">{poll.title}</h2>
          { poll.description && <p className="description">{poll.description}</p> }
          { renderTallies(poll.options, poll.voteCounts) }
          { renderCloseButton(poll, idx) }
        </div>
      )
    });
  }

  if (state.retrievingPolls) return <main className="main">Retrieving all Polls...</main>;

  if (state.closingPoll) return <main className="main">Closing poll in progress...</main>

  return (
    <main className="main">
      <h2 className="pageHeader">Current Tallies</h2>

      {renderPolls()}
    </main>
  )
}

export default PollTallies;