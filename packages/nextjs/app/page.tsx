"use client";

import { useState } from "react";
import CreateNFT from "./CreateNFT";
import ReadNFTPage from "./ReadNFTPage";
import AuctionNFTsPage from "./AuctionPage";  // Import the AuctionNFTsPage component
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [selectedPage, setSelectedPage] = useState<string>("create");

  const handleMenuClick = (page: string) => {
    setSelectedPage(page);
  };

  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <label htmlFor="my-drawer" className="cursor-pointer inline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </label>
        <div className="drawer-content">
          {/* Page content here */}
          {selectedPage === "create" ? (
            <CreateNFT />
          ) : selectedPage === "read" ? (
            <ReadNFTPage />
          ) : (
            <AuctionNFTsPage />  // Show AuctionNFTsPage if selected
          )}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li onClick={() => handleMenuClick("create")}>
              <a>Create NFTs</a>
            </li>
            <li onClick={() => handleMenuClick("read")}>
              <a>View Collections</a>
            </li>
            <li onClick={() => handleMenuClick("auction")}> {/* Add Auction link */}
              <a>NFT Auctions</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
