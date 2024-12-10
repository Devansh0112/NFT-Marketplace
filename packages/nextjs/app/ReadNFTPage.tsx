import React, { useEffect, useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface NFT {
  owner: string;
  collectionName: string;
  tokenId: bigint;
  name: string;
  description: string;
  ipfsUri: string;
  price: bigint;
}

const ReadNFTPage: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [showAuctionForm, setShowAuctionForm] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<bigint | null>(null);
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("");

  // Read NFTs
  const { data: allNfts } = useScaffoldReadContract({
    contractName: "CreateNFT",
    functionName: "getAllNfts",
  });

  // Write Contract Hook
  const { writeContractAsync: createAuction } = useScaffoldWriteContract("CreateNFT");

  useEffect(() => {
    if (allNfts) {
      setNfts(allNfts.slice());
    }
  }, [allNfts]);

  const handleAuctionSubmit = async () => {
    console.log(`${selectedTokenId} and ${startingPrice} and ${duration}`)
    if (selectedTokenId !== null && startingPrice && duration) {
      try {

        console.log(`${selectedTokenId} and ${startingPrice} and ${duration}`)
        await createAuction({
          functionName: "createAuction",
          args: [selectedTokenId, BigInt(startingPrice), BigInt(duration)],
        });
        alert("Auction created successfully!");
        setShowAuctionForm(false);
        setStartingPrice("");
        setDuration("");
      } catch (error) {
        console.error("Error creating auction:", error);
        alert("Failed to create auction");
      }
    }
  };

  // Group NFTs by collection name
  const groupedNfts = nfts.reduce((acc: any, nft) => {
    if (!acc[nft.collectionName]) {
      acc[nft.collectionName] = [];
    }
    acc[nft.collectionName].push(nft);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">All NFTs</h1>
      <div className="space-y-8">
        {Object.keys(groupedNfts).map(collectionName => (
          <div key={collectionName}>
            <h2 className="text-2xl font-semibold mb-4">{collectionName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedNfts[collectionName].map((nft: NFT) => (
                <div key={nft.tokenId.toString()} className="card card-bordered shadow-lg bg-base-100">
                  <figure>
                    <img src={nft.ipfsUri} alt={nft.name} className="w-full h-48 object-cover" />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">{nft.name}</h3>
                    <p className="text-gray-600">{nft.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="badge badge-primary badge-lg">Price: {nft.price} ETH</span>
                      <span>
                        <a href={nft.ipfsUri} target="_blank" rel="noreferrer" className="link link-primary">
                          URL to the image
                        </a>
                      </span>
                    </div>
                    {/* Auction Button */}
                    <button
                      className="btn btn-secondary mt-4"
                      onClick={() => {
                        setSelectedTokenId(nft.tokenId);
                        setShowAuctionForm(true);
                      }}
                    >
                      Auction NFT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Auction Form Modal */}
      {showAuctionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create Auction</h2>
            <label className="block mb-2">Starting Price (in Wei):</label>
            <input
              type="number"
              className="input input-bordered w-full mb-4"
              value={startingPrice}
              onChange={e => setStartingPrice(e.target.value)}
            />
            <label className="block mb-2">Duration (in seconds):</label>
            <input
              type="number"
              className="input input-bordered w-full mb-4"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="btn btn-primary"
                onClick={handleAuctionSubmit}
              >
                Start Auction
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowAuctionForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadNFTPage;
