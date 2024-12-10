import React, { useState, useEffect } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";

interface Auction {
  tokenId: bigint;
  seller: string;
  startingPrice: bigint;
  currentBid: bigint;
  currentBidder: string;
  auctionEndTime: bigint;
  isActive: boolean;
  imageUri: string;
}

const AuctionPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bidAmount, setBidAmount] = useState<string>("");

  const { address } = useAccount();

  const { data: allAuctions, isLoading, error } = useScaffoldReadContract({
    contractName: "CreateNFT",
    functionName: "getAllAuctions",
  });

  const { writeContractAsync: placeBid } = useScaffoldWriteContract({
    contractName: "CreateNFT",
    functionName: "placeBid",
  });

  useEffect(() => {
    if (allAuctions) {
      const activeAuctions = allAuctions.filter((auction: Auction) => auction.isActive);
      setAuctions(activeAuctions);
    }
  }, [allAuctions]);

  const formatPrice = (priceInWei: bigint) => {
    return `${priceInWei} Wei`;
  };

  const handleBidSubmit = async (tokenId: bigint) => {
    if (!bidAmount || Number(bidAmount) <= 0) return;

    try {
      await placeBid({
        args: [BigInt(tokenId)],
        value: BigInt(bidAmount),
      });
      setBidAmount("");
    } catch (err) {
      console.error("Error placing bid:", err);
    }
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Active Auctions</h1>

      {/* Loading and error states */}
      {isLoading && <p className="text-center text-gray-500">Loading auctions...</p>}
      {error && <p className="text-center text-red-500">Error fetching auctions. Please try again later.</p>}

      {!isLoading && !error && (
        <>
          {auctions.length === 0 ? (
            <p className="text-center text-gray-500">No active auctions currently.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <div
                  key={auction.tokenId.toString()}
                  className="card card-bordered shadow-lg bg-base-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <figure>
                    <img
                      src={auction.imageUri}
                      alt={`NFT ${auction.tokenId}`}
                      className="w-full h-64 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-primary">
                      Token ID: {auction.tokenId.toString()}
                    </h2>
                    <p className="text-sm text-gray-600">Seller: {auction.seller}</p>
                    <p>Starting Price: <span className="font-semibold">{formatPrice(auction.startingPrice)}</span></p>
                    <p>Current Bid: <span className="font-semibold">{formatPrice(auction.currentBid)}</span></p>
                    <p>
                      Ends In:{" "}
                      <span className="font-semibold">
                        {new Date(Number(auction.auctionEndTime) * 1000).toLocaleString()}
                      </span>
                    </p>
                    <a
                      href={auction.imageUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm"
                    >
                      View Image
                    </a>
                    <p>
                      Current Bidder:{" "}
                      <span className="font-semibold">
                        {auction.currentBidder === "0x0000000000000000000000000000000000000000"
                          ? "No bids yet"
                          : auction.currentBidder}
                      </span>
                    </p>

                    {/* Bid Input Section */}
                    {auction.isActive &&
                      address &&
                      auction.seller !== address &&
                      auction.currentBidder !== address && (
                        <div className="mt-4">
                          <input
                            type="number"
                            className="input input-bordered w-full mb-2"
                            placeholder="Enter bid amount"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                          />
                          <button
                            className="btn btn-primary w-full"
                            onClick={() => handleBidSubmit(auction.tokenId)}
                          >
                            Place Bid
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuctionPage;