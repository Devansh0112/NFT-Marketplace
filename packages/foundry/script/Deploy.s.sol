//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeployYourContract } from "./DeployYourContract.s.sol";
import { DeployFactoryContract } from "./DeployFactoryContract.s.sol";
import { DeployCreateNFTContract } from "./DeployCreateNFT.s.sol";

contract DeployScript is ScaffoldETHDeploy {
  function run() external {
    DeployYourContract deployYourContract = new DeployYourContract();
    DeployFactoryContract deployFactoryContract = new DeployFactoryContract();
    DeployCreateNFTContract deployCreateNFTContract = new DeployCreateNFTContract();
    deployYourContract.run();
    deployFactoryContract.run();
    deployCreateNFTContract.run();

    // deploy more contracts here
    // DeployMyContract deployMyContract = new DeployMyContract();
    // deployMyContract.run();
  }
}
