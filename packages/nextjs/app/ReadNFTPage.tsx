import React, { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

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

  const { data: allNfts } = useScaffoldReadContract({
    contractName: "CreateNFT",
    functionName: "getAllNfts",
  });

  useEffect(() => {
    if (allNfts) {
      setNfts(allNfts.slice());
    }
  }, [allNfts]);

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
                          <p>URL to the image</p>
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadNFTPage;
