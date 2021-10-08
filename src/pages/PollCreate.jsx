import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { ethers } from 'ethers';
import AppContract from '../artifacts/contracts/App.sol/App.json';

import { APP_CONTRACT_ADDRESS } from '../constants';

function PollCreate() {
  const [state, setState] = useState({
    title: '',
    description: '',
    options: [],
    optionInput: '',
    redirect: false
  });
  
  
  ////////////////////////////////////////////////////////////////////////////
  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  const handleOptionAdd = (event) => {
    const updatedOptions = [...state.options, state.optionInput];

    setState({
      ...state,
      optionInput: '',
      options: updatedOptions
    });
  }
  
  
  ////////////////////////////////////////////////////////////////////////////
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  ////////////////////////////////////////////////////////////////////////////
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    console.log('submit form');
    
    if (!state.title || !state.description) return;
    if (!window.ethereum) return;
    
    try {
      await requestAccount();
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(APP_CONTRACT_ADDRESS, AppContract.abi, signer);

      const transaction = await contract.createPoll(state.title, state.description, state.options);
      await transaction.wait();
      
      console.log('created poll');
      
      setState({
        title: '',
        description: '',
        redirect: true
      });
      
    } catch(err) {
      console.log('Error creating poll ==>', err);
    }
  }
  
  function renderOptions() {
    return state.options.map((opt, idx) => {
      return <li key={idx}>{opt}</li>
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////
  if (state.redirect) return <Redirect to="/polls" />;
  
  return (
    <main>
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

        <ul>{renderOptions()}</ul>

        <div>
          <label htmlFor="optionInput">Option: </label>
          <input
            type="text" 
            name="optionInput" 
            value={state.optionInput}
            onChange={handleInputChange}
          />
          <input
            type="button"
            value="Add Option"
            onClick={handleOptionAdd}
          />
        </div>

        <br />
        <br />

        <input type="submit" value="Create" />
      </form>
    </main>
  )
}

export default PollCreate;
