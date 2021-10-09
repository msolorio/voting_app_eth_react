//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Poll {
  string title;
  string description;
  string[] options;
  uint256[] voteCounts;
  address[] voters;

  constructor(
    string memory _title, 
    string memory _description,
    string[] memory _options
  ) {
    title = _title;
    description = _description;
    options = _options;
    voteCounts = new uint[](_options.length);
    voters = new address[](0);
  }

  function handleVote(address userAddr, uint optIdx) public {
    console.log('calling handleVote');
    console.log('poll address ==>', address(this));
    console.log('user address ==>', userAddr);
    console.log('opt idx ==>', optIdx);

    voteCounts[optIdx] += 1;
    voters.push(userAddr);

    console.log(options[optIdx]);
    console.log(voteCounts[optIdx]);
  }
}
