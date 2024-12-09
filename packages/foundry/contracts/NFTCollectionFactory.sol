// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTCollection.sol"; // Import your NFTCollection contract

contract NFTCollectionFactory {
    // Struct to store collection details
    address public immutable owner;
    struct Collection {
        address owner;
        address collectionAddress;
        string name;
        string symbol;
    }

    // Array to store all collections
    Collection[] public collections;

    // Event emitted when a new collection is created
    event CollectionCreated(address indexed owner, address indexed collectionAddress, string name, string symbol);

      constructor(address _owner) {
        owner = _owner;
    }

    /**
     * @dev Deploy a new NFTCollection contract.
     * @param name The name of the NFT collection.
     * @param symbol The symbol of the NFT collection.
     */
    function createCollection(string memory name, string memory symbol) public {
        // Deploy a new instance of NFTCollection
        NFTCollection newCollection = new NFTCollection(name, symbol, msg.sender);
        
        // Transfer ownership of the new collection to the caller
        newCollection.transferOwnership(msg.sender);

        // Store the collection details
        collections.push(Collection({
            owner: msg.sender,
            collectionAddress: address(newCollection),
            name: name,
            symbol: symbol
        }));

        // Emit an event
        emit CollectionCreated(msg.sender, address(newCollection), name, symbol);
    }

    /**
     * @dev Get all deployed collections.
     * @return An array of all collections.
     */
    function getCollections() public view returns (Collection[] memory) {
        return collections;
    }
}