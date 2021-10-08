//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Poll {
  string title;
  string description;
  string[] options;

  constructor(
    string memory _title, 
    string memory _description,
    string[] memory _options
  ) {
    title = _title;
    description = _description;
    options = _options;
  }
}
