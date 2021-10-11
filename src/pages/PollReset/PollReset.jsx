import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { ethers } from 'ethers';
import AppContract from '../../artifacts/contracts/App.sol/App.json';

import { APP_CONTRACT_ADDRESS } from '../../constants';

function Reset() {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    (async () => {
      console.log('called handleReset');
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, signer);
  
      const transaction = await contract.resetPolls();
      await transaction.wait();
  
      console.log('polls reset');

      setRedirect(true);
    })();
  }, []);

  if (redirect) return <Redirect to="/polls/vote" />

  return <main className="main">Loading...</main>
}

export default Reset;