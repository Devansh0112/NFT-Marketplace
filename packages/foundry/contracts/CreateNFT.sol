// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CreateNFT is ERC721URIStorage {
    uint256 private tokenCounter;
    address public immutable owner;

    struct NFT {
        address owner;
        string collectionName;
        uint256 tokenId;
        string name;
        string description;
        string ipfsUri;
        uint256 price;
    }

    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 startingPrice;
        uint256 currentBid;
        address currentBidder;
        uint256 auctionEndTime;
        bool isActive;
    }

    NFT[] public nfts;
    mapping(uint256 => Auction) public auctions;

    event NFTMinted(
        address indexed owner,
        uint256 tokenId,
        string collectionName,
        string name,
        string description,
        string ipfsUri
    );

    event AuctionCreated(uint256 indexed tokenId, uint256 startingPrice, uint256 auctionEndTime);
    event NewBidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 bidAmount);
    event AuctionEnded(uint256 indexed tokenId, address indexed winner, uint256 winningBid);

    constructor(address _owner) ERC721("NFTMarketplace", "NFTM") {
        tokenCounter = 0;
        owner = _owner;
    }

    function mintNFT(
        address recipient,
        string memory _collectionName,
        string memory _name,
        string memory _description,
        string memory metadataURI
    ) public returns (uint256) {
        uint256 newTokenId = tokenCounter;

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        NFT memory newNFT = NFT({
            owner: recipient,
            collectionName: _collectionName,
            tokenId: newTokenId,
            name: _name,
            description: _description,
            ipfsUri: metadataURI,
            price: 1
        });

        nfts.push(newNFT);
        emit NFTMinted(recipient, newTokenId, _collectionName, _name, _description, metadataURI);

        tokenCounter++;
        return newTokenId;
    }

    function getAllNfts() public view returns (NFT[] memory) {
        return nfts;
    }

    function transferNFT(address to, uint256 tokenId) public {
        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i].tokenId == tokenId) {
                nfts[i].owner = to;
                break;
            }
        }

        _transfer(msg.sender, to, tokenId);
    }

    function getNFTsByOwner(address _owner) public view returns (NFT[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i].owner == _owner) {
                count++;
            }
        }

        NFT[] memory ownedNFTs = new NFT[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i].owner == _owner) {
                ownedNFTs[index] = nfts[i];
                index++;
            }
        }

        return ownedNFTs;
    }

    function getNFTByTokenId(uint256 tokenId) public view returns (NFT memory) {
        for (uint256 i = 0; i < nfts.length; i++) {
            if (nfts[i].tokenId == tokenId) {
                return nfts[i];
            }
        }
        revert("NFT not found");
    }

    // Auction functionality

    function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) public {
        require(ownerOf(tokenId) == msg.sender, "You must be the owner of the NFT");
        require(auctions[tokenId].isActive == false, "Auction already active for this NFT");

        auctions[tokenId] = Auction({
            tokenId: tokenId,
            seller: msg.sender,
            startingPrice: startingPrice,
            currentBid: startingPrice,
            currentBidder: address(0),
            auctionEndTime: block.timestamp + duration,
            isActive: true
        });

        emit AuctionCreated(tokenId, startingPrice, auctions[tokenId].auctionEndTime);
    }

    function placeBid(uint256 tokenId) public payable {
        Auction storage auction = auctions[tokenId];

        require(auction.isActive, "Auction is not active");
        require(block.timestamp < auction.auctionEndTime, "Auction has ended");
        require(msg.value > auction.currentBid, "Bid must be higher than current bid");

        // Refund previous bidder
        if (auction.currentBidder != address(0)) {
            payable(auction.currentBidder).transfer(auction.currentBid);
        }

        auction.currentBidder = msg.sender;
        auction.currentBid = msg.value;

        emit NewBidPlaced(tokenId, msg.sender, msg.value);
    }

    function endAuction(uint256 tokenId) public {
        Auction storage auction = auctions[tokenId];

        require(auction.isActive, "Auction is not active");
        require(block.timestamp >= auction.auctionEndTime, "Auction has not ended yet");
        require(msg.sender == auction.seller || msg.sender == ownerOf(tokenId), "Only seller or contract owner can end the auction");

        auction.isActive = false;

        if (auction.currentBidder != address(0)) {
            // Transfer NFT to highest bidder
            _transfer(auction.seller, auction.currentBidder, tokenId);
            // Transfer the winning bid to the seller
            payable(auction.seller).transfer(auction.currentBid);
            emit AuctionEnded(tokenId, auction.currentBidder, auction.currentBid);
        }
    }
}
