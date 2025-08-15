"use client";

import { useState, useRef, useEffect } from "react";
import MetalSlab from "@/components/ui/MetalSlab";

export default function HeroSection() {


  const inputRef = useRef(null);
  const hiddenSpanRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const heroSectionRef = useRef(null);

  // (blink/reveal/typing effects… unchanged)

  return (
    <section
      ref={heroSectionRef}
      className="relative w-full h-screen flex flex-col items-center justify-end z-0 px-4 sm:px-8 overflow-hidden"
    >
      <MetalSlab
        // Absolute overlay inside the section; doesn't affect layout
        anchorRef={heroSectionRef}
        stickyWindowVh={100}
        overshootPx={0}
        spins={0.2}
        tiltDeg={{ x: 12, z: 7 }}
        stopAtProgress={1}
      />

      <div className="w-full flex flex-col items-center justify-end">
        <div className="flex flex-col items-center justify-end w-full">
          <p className="w-full flex flex-row items-center justify-between text-center text-white">
            <span>SIMPLE</span>
            <span>TO</span>
            <span>COMPLEX</span>
          </p>
          <h1
            className="text-[11vw] text-center w-full font-bold leading-[1] tracking-tight text-white"
            style={{ lineHeight: 1, letterSpacing: "-0.08em" }}
          >
            WEB DEVELOPMENT
          </h1>
        </div>
      </div>
    </section>
  );
}