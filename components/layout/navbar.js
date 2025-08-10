"use client";

import { useState, useEffect } from "react";

export default function Navbar({ onBookMeeting }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBookMeetingClick = () => {
    onBookMeeting?.(); // Trigger the booking modal
  };

  return (
    <>
      {/* Desktop version */}
      <div className="hidden md:block">
        {/* Left side with mix-blend-difference - separate layer */}
        <div className="fixed top-0 left-0 w-full max-w-[800px] h-[88px] z-[100] mix-blend-difference">
          <div className="flex items-center h-full px-8">
            <div className="flex items-center justify-between w-full">
              <div className="text-white">
                <h2 className="text-xl font-medium">US Based</h2>
                <p className="text-base opacity-80">Working globally</p>
              </div>
              
              <div className="text-white">
                <h2 className="text-xl font-medium">Building at</h2>
                <p className="text-base opacity-80">Trackstack</p>
              </div>
              
              <div className="text-white">
                <h2 className="text-xl font-medium">Freelance availability</h2>
                <p className="text-base opacity-80">September 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side button - completely separate layer */}
        <div className="fixed top-0 right-0 h-[88px] z-[100] flex items-center px-8">
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Rolling circle - positioned behind the button */}
            <div 
              className={`absolute top-1/2 left-0 w-12 h-12 bg-black rounded-full flex items-center justify-center -z-10 transform -translate-y-1/2 transition-all duration-[900ms] ${
                isHovered 
                  ? '-translate-x-12 rotate-[-380deg]' 
                  : 'translate-x-0 rotate-0'
              }`}
              style={{
                transitionTimingFunction: isHovered 
                  ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  : 'ease-out'
              }}
            >
              <span className="text-white text-2xl">👍</span>
            </div>
            
            <button
              onClick={handleBookMeetingClick}
              className="relative bg-black text-white rounded-full px-6 py-3 text-base uppercase"
            >
              Get in touch
            </button>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="md:hidden">
        {/* Mobile left content with mix-blend */}
        <div className="fixed top-0 left-0 h-[88px] z-[100] mix-blend-difference">
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-white text-center">
              <h2 className="text-base font-medium">US Based</h2>
              <p className="text-sm opacity-80">Working globally</p>
            </div>
          </div>
        </div>
        
        {/* Mobile button - separate layer */}
        <div className="fixed top-0 right-0 h-[88px] z-[100] flex items-center px-4">
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Rolling circle for mobile - positioned behind the button */}
            <div 
              className={`absolute top-1/2 left-0 w-8 h-8 bg-black border border-white rounded-full flex items-center justify-center -z-10 transform -translate-y-1/2 transition-all duration-[900ms] ${
                isHovered 
                  ? '-translate-x-8 rotate-[-380deg]' 
                  : 'translate-x-0 rotate-0'
              }`}
              style={{
                transitionTimingFunction: isHovered 
                  ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  : 'ease-out'
              }}
            >
              <span className="text-white text-base">👍</span>
            </div>
            
            <button
              onClick={handleBookMeetingClick}
              className="relative bg-black text-white border border-white rounded-full px-4 py-2 text-sm uppercase hover:opacity-90 transition-opacity duration-200"
            >
              Get in touch
            </button>
          </div>
        </div>
      </div>
     </>
  );
}
