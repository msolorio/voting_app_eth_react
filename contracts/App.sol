//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract App {

  struct Poll {
    string title;
    string description;
    string[] options;
  }

  Poll[] private pollsList;

  mapping(address => Poll) addrToPoll;

  function createPoll(
    string memory _title, 
    string memory _description, 
    string[] memory _options
  ) public {
    
    Poll memory newPoll = Poll({
      title: _title,
      description: _description,
      options: _options
    });

    pollsList.push(newPoll);
  }

  function getPolls() public view returns (Poll[] memory) {
    console.log('Retrieving all polls');

    return pollsList;
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
