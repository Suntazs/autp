"use client";

import { useState, useEffect } from "react";

// Flower Component
const RotatingFlower = ({ className, style }) => {
  return (
    <div 
      className={`absolute -z-10 transition-transform duration-300 ease-out ${className}`}
      style={style}
    >
      <div className="relative w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
        {/* Flower made of overlapping circles */}
        <div className="relative w-full h-full">
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          
          {/* Petals - 8 circles arranged in a flower pattern */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const radius = 24; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <div
                key={i}
                className="absolute w-6 h-6 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function ServicesSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showServicesLine, setShowServicesLine] = useState(false);

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
    const servicesTimer = setTimeout(() => {
      setShowServicesLine(true);
    }, 800);

    return () => clearTimeout(servicesTimer);
  }, []);

  return (
    <section className="w-full min-h-[600px] sm:min-h-auto flex flex-col justify-center items-center relative px-4 sm:px-6 md:px-8 lg:px-24 py-8 sm:py-12 md:py-16 lg:py-[280px] xl:py-[300px]">
      {/* --------------------------------------------- */}
      {/* Mobile Layout ( < sm ) */}
      <div className="flex flex-col items-center w-full gap-4 sm:hidden">
        {/* SERVICES – overlay reveals L ➜ R */}
        <div className="relative inline-block">
          <h1 className="text-[3.5rem] xs:text-[4rem] font-black text-black leading-none tracking-tight select-none">
            SERVICES
          </h1>
          <span
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-screen h-full bg-[#E4FF97] origin-left transition-transform duration-1000 ease-out ${
              showServicesLine ? 'scale-x-0' : 'scale-x-100'
            }`}
          />
        </div>

        {/* Description */}
        <p className="text-center text-gray-700 text-base px-4">
          Comprehensive solutions tailored to your business needs.
        </p>
      </div>

      {/* --------------------------------------------- */}
      {/* Desktop / Tablet Layout ( ≥ sm ) */}
      <div className="hidden sm:flex flex-col w-full gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        {/* SERVICES Row */}
        <div className="flex items-center w-screen relative left-1/2 transform -translate-x-1/2">
          <div className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] font-black text-black leading-none tracking-tight select-none ml-4 sm:ml-6 md:ml-8">
            SERVICES
          </div>
          <div
            className={`flex-1 h-[3rem] sm:h-[4rem] md:h-[6rem] lg:h-[8rem] xl:h-[12rem] bg-[#E4FF97] ml-2 sm:ml-3 md:ml-4 transition-transform duration-1000 ease-out origin-right ${
              showServicesLine ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </div>
      </div>

      {/* Background Circles with Parallax Effect */}
      <div
        className="w-40 h-40 rounded-full mb-8 absolute top-[20%] left-[-80px] -z-10 transition-transform duration-300 ease-out"
        style={{
          background: "linear-gradient(135deg, #ffffff 25%, #adff00 100%)",
          boxShadow: "0 4px 15px rgba(173, 255, 0, 0.2)",
          transform: `translate(${mousePosition.x * 1.2 + scrollY * 0.2}px, ${
            mousePosition.y * 1.2 + scrollY * 0.1
          }px)`,
        }}
      />

      <div
        className="w-48 h-48 rounded-full mb-8 absolute bottom-[15%] right-[18%] -z-10 transition-transform duration-300 ease-out"
        style={{
          background: "linear-gradient(65deg, #ffffff 25%, #adff00 100%)",
          boxShadow: "0 4px 15px rgba(173, 255, 0, 0.2)",
          transform: `translate(${
            mousePosition.x * 0.8 - scrollY * 0.15
          }px, ${mousePosition.y * 0.8 + scrollY * 0.3}px)`,
        }}
      />

      {/* Rotating Flower - replaces the top-right circle */}
      <RotatingFlower
        className="w-48 h-48 mb-8 top-[15%] right-[10%]"
        style={{
          transform: `translate(${
            mousePosition.x * 1.5 + scrollY * 0.25
          }px, ${mousePosition.y * 1.5 - scrollY * 0.2}px)`,
        }}
      />

      {/* Central Content Area - This can be used for additional content */}
      <div className="relative z-10 hidden sm:flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto text-center">
        {/* You can add more content here if needed */}
      </div>
    </section>
  );
} 