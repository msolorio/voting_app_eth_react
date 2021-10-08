import { useState } from 'react';
import { ethers } from 'ethers';
import AppContract from './artifacts/contracts/App.sol/App.json';
import './App.css';

const appContractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [state, setState] = useState({
    title: '',
    description: ''
  });

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }
  

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  const handleFormSubmit = async (event) => {
    event.preventDefault();

    console.log('submit form');

    if (!state.title || !state.description) return;
    if (!window.ethereum) return;
    
    try {
      await requestAccount();
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(appContractAddr, AppContract.abi, signer);
      
      const transaction = await contract.createPoll(state.title, state.description);
      await transaction.wait();

      console.log('created poll');
    } catch(err) {
      console.log('Error creating poll ==>', err);
    }
  }
  
  const getPolls = async () => {
    if (!window.ethereum) return;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(appContractAddr, AppContract.abi, provider);

    try {
      const polls = await contract.getPolls();
      console.log('All Polls ==>', polls);

    } catch (err) {
      console.log('Error getting polls ==>', err);
    }
  }


  return (
    <div className="App">
      <h1>Create a Poll</h1>

    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="title">Title: </label>
        <input 
          type="text" 
          name="title" 
          value={state.title}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="description">Description: </label>
        <textarea
          type="text" 
          name="description" 
          value={state.description}
          onChange={handleInputChange}
        />
      </div>

      <input type="submit" value="Create" />
    </form>

      <input
        type="button"
        value="Get Polls" 
        onClick={getPolls}
      />
    </div>
  );
}

export default App;
