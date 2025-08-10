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
    <MetalSlab
      sectionHeight={160}          // how tall this whole block is
      stickyWindowVh={100}         // spin over exactly the viewport height
      overshootPx={170}            // a little extra spin past that window
      spins={0.2}                  // slower spin (0.6 turns). Try 0.4 for even slower
      tiltDeg={{ x: 12, z: 7 }}    // a bit more tip as you scroll
      className=""
    >
      {/* Your text sits below, scrolls normally; slab is on top */}
      <section
        ref={heroSectionRef}
        className="relative w-full min-h-screen flex flex-col items-center justify-start z-0 px-4 sm:px-8"
      >
        <div className="h-screen w-full flex flex-col items-center justify-end">
          <div className="flex flex-col items-center justify-end w-full">
            <p className="w-full flex flex-row items-center justify-between text-center text-neutral-700">
              <span>SIMPLE</span>
              <span>TO</span>
              <span>COMPLEX</span>
            </p>
            <h1
              className="text-[11vw] text-center w-full font-bold leading-[1] tracking-tight"
              style={{ lineHeight: 1, letterSpacing: "-0.08em" }}
            >
              WEB DEVELOPMENT
            </h1>
          </div>

          <div className="w-full h-[120px] flex flex-row items-center justify-center">
            <div className="w-full h-full flex flex-row items-center justify-between">
              <span>Scroll Down</span>
              <div className="flex flex-col">
                <p>Follow Us</p>
                <div className="flex flex-row items-center justify-center">
                  <p>Instagram /</p>
                  <p>&nbsp;Facebook /</p>
                  <p>&nbsp;Twitter</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* some extra space so you can see the overshoot */}
        <div className="h-[40vh]" />

        <span
          ref={hiddenSpanRef}
          className="invisible absolute whitespace-pre left-0 top-0"
          style={{ font: "inherit" }}
        />
      </section>
    </MetalSlab>
  );
}