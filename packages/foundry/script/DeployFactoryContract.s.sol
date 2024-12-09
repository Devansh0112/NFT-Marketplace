//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/NFTCollectionFactory.sol";
import "./DeployHelpers.s.sol";

contract DeployFactoryContract is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    NFTCollectionFactory nftCollectionFactory = new NFTCollectionFactory(deployer);
    console.logString(
      string.concat(
        "FactoryContract deployed at: ", vm.toString(address(nftCollectionFactory))
      )
    );
  }
}
