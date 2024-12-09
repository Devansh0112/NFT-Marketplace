//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/CreateNFT.sol";
import "./DeployHelpers.s.sol";

contract DeployCreateNFTContract is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    CreateNFT createNFT = new CreateNFT(deployer);
    console.logString(
      string.concat(
        "CreateNFTContract deployed at: ", vm.toString(address(createNFT))
      )
    );
  }
}
