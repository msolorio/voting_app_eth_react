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
  }

  Poll[] private pollsList;

  PollStruct[] private pollsData;

  mapping(address => PollStruct) addrToPoll;

  function createPoll(
    string memory _title, 
    string memory _description, 
    string[] memory _options
  ) public {
    
    Poll newPollAddr = new Poll(_title, _description, _options);
    pollsList.push(newPollAddr);

    PollStruct memory newPollStruct = PollStruct({
      title: _title,
      description: _description,
      options: _options,
      pollAddr: address(newPollAddr)
    });

    addrToPoll[address(newPollAddr)] = newPollStruct;

    pollsData.push(newPollStruct);
  }

  function getPolls() public view returns (PollStruct[] memory) {
    console.log('Retrieving all polls');

    return pollsData;
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
