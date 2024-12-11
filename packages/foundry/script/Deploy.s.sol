//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeployCreateNFTContract } from "./DeployCreateNFT.s.sol";

contract DeployScript is ScaffoldETHDeploy {
  function run() external {
    DeployCreateNFTContract deployCreateNFTContract = new DeployCreateNFTContract();
    deployCreateNFTContract.run();

    // deploy more contracts here
    // DeployMyContract deployMyContract = new DeployMyContract();
    // deployMyContract.run();
  }
}
