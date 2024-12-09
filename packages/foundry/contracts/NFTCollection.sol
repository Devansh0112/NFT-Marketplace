// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    constructor(string memory name, string memory symbol, address initialOwner) ERC721(name, symbol) Ownable(initialOwner) {
        tokenCounter = 0;
    }

    /**
     * @dev Mint a new NFT.
     * @param recipient The address of the recipient.
     * @param metadataURI The URI pointing to the metadata JSON on IPFS.
     */
    function mintNFT(address recipient, string memory metadataURI) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(recipient, newTokenId); // Mint the NFT
        _setTokenURI(newTokenId, metadataURI); // Set the metadata URI
        tokenCounter++;
        return newTokenId;
    }
}