"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
export default function Navbar() {
  const [showHeading, setShowHeading] = useState(false);

  // Heading reveal animation
  useEffect(() => {
    // Start animation with a delay
    const timer = setTimeout(() => {
      setShowHeading(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex justify-between items-center absolute top-4 left-5 right-0">
      <div className="relative overflow-hidden h-[88px] flex items-center">
        <h1 className="text-6xl">Automastion</h1>

        {/* Reveal overlay with black background */}
        <div
          className={`absolute bg-black ${showHeading ? "heading-reveal" : ""}`}
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </div>

      <div className="flex justify-between items-center bg-black w-[65%] p-5 h-[88px]">
        <h1 className="text-white ml-5 uppercase text-base">Home</h1>
        <h1 className="text-white uppercase text-base">About</h1>
        <h1 className="text-white uppercase text-base">Services</h1>
        <h1 className="text-white uppercase text-base">Contact</h1>
        <Link
          href="/"
          className="text-black bg-[#adff00] rounded-full p-3 text-center max-w-[250px] w-full mr-5 text-base uppercase"
        >
          Book a meeting
        </Link>
      </div>
    </div>
  );
}
