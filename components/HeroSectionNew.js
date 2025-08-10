"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Load WebGL only on the client
const MetalSlab = dynamic(() => import("@/components/ui/MetalSlab"), { ssr: false });

export default function HeroSectionNew() {
  // Remove the type argument from useRef to avoid error
  const heroSectionRef = useRef(null);
  const [mounted, setMounted] = useState(true); // set true if you always want it visible

  useEffect(() => {
    // If you want lazy-mount when in view, swap this for an IntersectionObserver.
    setMounted(true);
  }, []);

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full min-h-screen bg-black"
    >
      {/* Slab at the top-left */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        {mounted && <MetalSlab />}
      </div>

      {/* your foreground content goes here */}
    </section>
  );
}