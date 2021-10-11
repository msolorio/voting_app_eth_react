import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { ethers } from 'ethers';
import AppContract from '../../artifacts/contracts/App.sol/App.json';
import { APP_CONTRACT_ADDRESS } from '../../constants';
import './PollCreate.css';
import '../../form.css';

function PollCreate() {
  const [state, setState] = useState({
    title: '',
    description: '',
    options: [],
    optionInput: '',
    redirect: false,
    processing: false
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
    
    if (!state.title || !state.options.length) return;
    if (!window.ethereum) return;

    setState({
      ...state,
      processing: true
    });

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
      return (
        <li className="form-option" key={idx}>
          {opt}
        </li>
      );
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////
  if (state.processing) return <main className="main">Creating a Poll...</main>;

  if (state.redirect) return <Redirect to="/polls/vote" />;
  
  return (
    <main className="main createPage">
      <h2 className="pageHeader">Create a Poll</h2>

      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title: </label>
          <input
            className="form-input"
            type="text" 
            name="title" 
            value={state.title}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description (optional): </label>
          <textarea
            className="form-input"
            type="text" 
            name="description" 
            value={state.description}
            onChange={handleInputChange}
          />
        </div>


        <div className="form-group">
          <label className="form-label" htmlFor="options">Options:</label>
          <ul id="options" className="form-optionGroup">{renderOptions()}</ul>

          <label className="form-label" htmlFor="optionInput" hidden>Add: </label>
          <input
            className="form-input"
            type="text" 
            name="optionInput" 
            value={state.optionInput}
            onChange={handleInputChange}
          />
          <input
            className="form-button form-buttonOption"
            type="button"
            value="Add Option"
            onClick={handleOptionAdd}
          />
        </div>

        <input 
          className="form-button form-buttonSubmit"
          type="submit" 
          value="Create" 
        />
      </form>
    </main>
  )
}

export default PollCreate;
