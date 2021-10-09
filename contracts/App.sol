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
    bool running;
    address[] voters;
    uint[] voteCounts;
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
      running: true,
      voters: new address[](0),
      voteCounts: voteCounts
    });

    addrToPoll[address(newPoll)] = newPollStruct;

    runningPollsData.push(newPollStruct);
  }


  //////////////////////////////////////////////////////////////////////
  function getRunningPolls() public view returns (PollStruct[] memory) {
    console.log('Retrieving all polls');

    return runningPollsData;
  }


  //////////////////////////////////////////////////////////////////////
  function handleVote(address pollAddr, address userAddr, uint pollIdx, uint optIdx) public {
    
    console.log('called handleVote');

    PollStruct storage pollStruct = addrToPoll[pollAddr];

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
