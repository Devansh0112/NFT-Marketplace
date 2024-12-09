import React, { useState } from "react";
import { unixfs } from "@helia/unixfs";
import { createHelia } from "helia";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const CreateNFT: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [fileUrl, setfileUrl] = useState<string>("");
  const [ipfsUploading, setIpfsUploading] = useState(false);
  const [isMinting, setisMinting] = useState(false);

  const { address } = useAccount(); // Connected wallet address

  // Use Scaffold-ETH hook
  const { writeContractAsync: mintNFT } = useScaffoldWriteContract("CreateNFT");

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Upload file and fileData to IPFS
  const uploadToIPFS = async () => {
    if (!file) throw new Error("No file selected");

    setIpfsUploading(true);
    try {
      const helia = await createHelia();
      const fs = unixfs(helia);

      // Upload file to IPFS
      const fileArrayBuffer = await file.arrayBuffer();
      const cidFile = await fs.addBytes(new Uint8Array(fileArrayBuffer));
      const fileUrl = `https://ipfs.io/ipfs/${cidFile.toString()}`;

      setfileUrl(fileUrl);
      return fileUrl;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw new Error("Failed to upload to IPFS");
    } finally {
      setIpfsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setisMinting(true);

    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      // Upload metadata to IPFS
      const fileURI = await uploadToIPFS();
      console.log("File URL:", fileURI);

      // Write to the contract using Scaffold-ETH hook
      await mintNFT({
        functionName: "mintNFT",
        args: [address, collectionName, name, description, fileURI],
      });

      alert("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT.");
    } finally {
      setisMinting(false);
    }
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-center">Create NFT</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Input */}
            <div>
              <label className="block font-semibold">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="file-input file-input-bordered w-full"
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block font-semibold">NFT Name</label>
              <input
                type="text"
                placeholder="Enter NFT name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold">Description</label>
              <textarea
                placeholder="Enter description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                className="textarea textarea-bordered w-full"
              ></textarea>
            </div>

            {/* Collection Name */}
            <div>
              <label className="block font-semibold">Collection Name</label>
              <input
                type="text"
                placeholder="Enter collection name"
                value={collectionName}
                onChange={e => setCollectionName(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${ipfsUploading || isMinting ? "loading" : ""}`}
              disabled={ipfsUploading || isMinting}
            >
              {ipfsUploading ? "Uploading..." : isMinting ? "Minting..." : "Create NFT"}
            </button>
          </form>

          {/* Metadata URL */}
          {fileUrl && (
            <div className="mt-4">
              <p>File URL:</p>
              <a href={fileUrl} target="_blank" rel="noreferrer" className="link link-primary">
                <p>URL to the image</p>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
