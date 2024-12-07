import React, { useState } from "react";
import { unixfs } from "@helia/unixfs";
import { createHelia } from "helia";

const CreateNFT = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");

  // Initialize Helia Node
  const initializeHelia = async () => {
    const helia = await createHelia();
    return helia;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file || !name || !description || !collectionName) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      // Initialize Helia and UnixFS
      const helia = await initializeHelia();
      const fs = unixfs(helia);

      // Upload file to IPFS
      const fileArrayBuffer = await file.arrayBuffer();
      const cidFile = await fs.addBytes(new Uint8Array(fileArrayBuffer));
      const fileUrl = `https://ipfs.io/ipfs/${cidFile.toString()}`;

      // Create metadata object
      const metadata = {
        name,
        description,
        image: fileUrl,
        collectionName,
      };

      // Upload metadata to IPFS
      const metadataBytes = new TextEncoder().encode(JSON.stringify(metadata));
      const cidMetadata = await fs.addBytes(metadataBytes);
      const metadataUrl = `https://ipfs.io/ipfs/${cidMetadata.toString()}`;

      setMetadataUrl(metadataUrl);

      alert("NFT Metadata uploaded successfully!");
    } catch (error) {
      console.error("Error uploading to IPFS via Helia:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-center">Create Your NFT</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Upload Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
                required
              />
            </div>

            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">NFT Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter NFT name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Description Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                placeholder="Enter a description for your NFT"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
                required
              ></textarea>
            </div>

            {/* Collection Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Collection Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter collection name"
                value={collectionName}
                onChange={e => setCollectionName(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Create NFT
              </button>
            </div>
          </form>

          {/* Display Metadata URL */}
          {metadataUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-bold">Metadata URL:</h3>
              <a href={metadataUrl} target="_blank" rel="noopener noreferrer" className="link link-primary">
                {metadataUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
