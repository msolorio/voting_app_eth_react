//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './Poll.sol';
import "hardhat/console.sol";

contract App {

  struct PollStruct {
    string title;
    string description;
    string[] options;
    address pollAddr;
    Poll pollContract;
    bool isRunning;
    address[] voters;
    uint[] voteCounts;
    address creator;
  }

  Poll[] private pollsList;

  PollStruct[] private runningPollsData;

  mapping(address => PollStruct) addrToPoll;


  //////////////////////////////////////////////////////////////////////
  function createPoll(
    string memory _title, 
    string memory _description, 
    string[] memory _options
  ) public {
    
    Poll newPoll = new Poll();
    pollsList.push(newPoll);

    uint256[] memory voteCounts = new uint256[](_options.length);

    for (uint i = 0; i < _options.length; i++) {
      voteCounts[i] = 0;
    }

    PollStruct memory newPollStruct = PollStruct({
      title: _title,
      description: _description,
      options: _options,
      pollAddr: address(newPoll),
      pollContract: newPoll,
      isRunning: true,
      voters: new address[](0),
      voteCounts: voteCounts,
      creator: msg.sender
    });

    addrToPoll[address(newPoll)] = newPollStruct;

    runningPollsData.push(newPollStruct);
  }

  function resetPolls() public {
    delete runningPollsData;

    string[] memory t1 = new string[](2);
    t1[0] = 'Cats';
    t1[1] = 'Dogs';

    createPoll('Cats or Dogs?', '', t1);

    string[] memory t2 = new string[](2);
    t2[0] = 'Mountains';
    t2[1] = 'Beaches';

    createPoll('Mountains or Beaches?', '', t2);
  }


  //////////////////////////////////////////////////////////////////////
  function getRunningPolls() public view returns (PollStruct[] memory) {
    console.log('Retrieving all polls');

    return runningPollsData;
  }

  // TODO:
  // - get poll by address
  // - verifies if userAddr is poll creator
  // - switch isRunning to false
  function closePoll(address pollAddr, address userAddr, uint pollIdx) public {
    console.log('called closePoll');

    PollStruct memory pollToClose = addrToPoll[pollAddr];

    if (userAddr != pollToClose.creator) {
      console.log('user attempted to close poll they do not own.');
      console.log('user ==>', userAddr);
      return;
    }

    pollToClose.isRunning = false;

    runningPollsData[pollIdx] = pollToClose;
  }


  //////////////////////////////////////////////////////////////////////
  function handleVote(address pollAddr, address userAddr, uint pollIdx, uint optIdx) public {
    
    console.log('called handleVote');


    PollStruct storage pollStruct = addrToPoll[pollAddr];

    // TODO: check if user address already exists in voters array
    // If so - short circuit / don't allow vote


    // TODO: check if poll is closed
    // if so - short circuit / don't allow vote

    // if (!pollStruct.isRunning) {
    //   return;
    // }

    console.log('after the if check');

    pollStruct.voteCounts[optIdx] += 1;

    pollStruct.voters.push(userAddr);

    runningPollsData[pollIdx] = pollStruct;
  }
}

// contract Greeter {
//     string private greeting;

//     constructor(string memory _greeting) {
//         console.log("Deploying a Greeter with greeting:", _greeting);
//         greeting = _greeting;
//     }

//     function greet() public view returns (string memory) {
//         return greeting;
//     }

//     function setGreeting(string memory _greeting) public {
//         console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
//         greeting = _greeting;
//     }
// }
