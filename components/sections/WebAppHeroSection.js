"use client";

import { useState, useEffect } from "react";
import CurvedLoop from "@/components/sections/textslider";
import RotatingFlower from "@/components/ui/RotatingFlower";

const WebAppHeroSection = ({ 
  heading = "WEB-APP", 
  description = "Modern web applications built with cutting-edge technology.",
  mobileTextSize = "text-[3.5rem] xs:text-[4rem]",
  desktopTextSize = "text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem]"
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.05,
        y: (e.clientY - window.innerHeight / 2) * 0.05,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll tracking for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Line reveal animation
  useEffect(() => {
    const firstLineTimer = setTimeout(() => {
      setShowFirstLine(true);
    }, 300);
    
    const secondLineTimer = setTimeout(() => {
      setShowSecondLine(true);
    }, 700);

    return () => {
      clearTimeout(firstLineTimer);
      clearTimeout(secondLineTimer);
    };
  }, []);

  return (
    <>
      <section className="w-full min-h-[600px] sm:min-h-auto flex flex-col justify-center items-center relative py-8 sm:py-24 xl:py-32">
        {/* Mobile Layout ( < sm ) */}
        <div className="flex flex-col items-center w-full gap-4 sm:hidden">
          {/* Dynamic Heading – centered text */}
          <div className="relative inline-block">
            <h1 className={`${mobileTextSize} font-black text-black leading-none tracking-tight select-none`}>
              {heading}
            </h1>
          </div>

          {/* Description */}
          <p className="text-center text-gray-700 text-base px-4">
            {description}
          </p>
        </div>

        {/* Desktop / Tablet Layout ( ≥ sm ) */}
        <div className="hidden sm:block w-full overflow-hidden">
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
            {/* Split the heading into words */}
            {(() => {
              const words = heading.split(/[\s-]+/);
              const firstWord = words[0] || '';
              const secondWord = words.slice(1).join(' ') || '';
              
              return (
                <>
                  {/* First word (WEB) with line */}
                  <div className="flex items-center w-full">
                    <div className="pl-4 sm:pl-6 md:pl-8">
                      <div className={`${desktopTextSize} font-black text-black leading-none tracking-tight select-none`}>
                        {firstWord}
                      </div>
                    </div>
                    
                    {/* First line that fills remaining space */}
                    <div className="flex-1 h-[3rem] sm:h-[4rem] md:h-[6rem] lg:h-[8rem] xl:h-[12rem] bg-[#CB9FD2] ml-4"
                         style={{
                           transform: showFirstLine ? 'scaleX(1)' : 'scaleX(0)',
                           transformOrigin: 'right center',
                           transition: 'transform 1s ease-out'
                         }}
                    />
                  </div>
                  
                  {/* Second word (APPLICATIONS) with line */}
                  <div className="flex items-center w-full">
                    <div className="pl-4 sm:pl-6 md:pl-8">
                      <div className={`${desktopTextSize} font-black text-black leading-none tracking-tight select-none whitespace-nowrap`}>
                        {secondWord}
                      </div>
                    </div>
                    
                    {/* Second line that fills remaining space */}
                    <div className="flex-1 h-[3rem] sm:h-[4rem] md:h-[6rem] lg:h-[8rem] xl:h-[12rem] bg-[#FFB7B7] ml-4"
                         style={{
                           transform: showSecondLine ? 'scaleX(1)' : 'scaleX(0)',
                           transformOrigin: 'right center',
                           transition: 'transform 1s ease-out'
                         }}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        </div>



        {/* Rotating Flower - replaces the top-right circle */}
        <RotatingFlower
          className="w-48 h-48 mb-8 top-[15%] right-[10%] z-10"
          style={{
            transform: `translate(${
              mousePosition.x * 1.5 + scrollY * 0.25
            }px, ${mousePosition.y * 1.5 - scrollY * 0.2}px)`,
          }}
        />

        {/* Central Content Area - This can be used for additional content */}
        <div className="relative z-10 hidden sm:flex flex-col items-center justify-center max-w-2xl mx-auto text-center mt-8">
          <p className="text-center text-gray-700 text-lg md:text-xl">
            {description}
          </p>
        </div>
      </section>
      
      <CurvedLoop 
        marqueeText="services ✦ E-commerce ✦ WebApp ✦ SAAS ✦ Automation ✦"
        speed={2}
        curveAmount={-30}
        direction="left"
        interactive={true}
        className="custom-text-style"
      />
    </>
  );
};

export default WebAppHeroSection; 