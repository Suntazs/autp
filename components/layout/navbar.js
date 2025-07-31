"use client";

import { useState, useEffect } from "react";

export default function Navbar({ onBookMeeting }) {
  const [showHeading, setShowHeading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const [blurVisible, setBlurVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 0); // Detect any scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blur effect with smooth fade in/out
  useEffect(() => {
    if (isScrolled) {
      // Fade in after navbar animation
      const timer = setTimeout(() => {
        setShowBlur(true);
        setTimeout(() => setBlurVisible(true), 50); // Small delay for fade-in
      }, 700);
      return () => clearTimeout(timer);
    } else {
      // Fade out immediately when scrolling up
      setBlurVisible(false);
      const timer = setTimeout(() => {
        setShowBlur(false);
      }, 300); // Wait for fade-out animation to complete
      return () => clearTimeout(timer);
    }
  }, [isScrolled]);

  // Close mobile menu when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleBookMeetingClick = () => {
    setIsMobileMenuOpen(false); // Close mobile menu if open
    onBookMeeting?.(); // Trigger the booking modal
  };

  return (
    <>
      <div className={`fixed left-0 right-0 transition-all duration-700 ease-in-out z-[100] ${
        isScrolled ? 'top-0' : 'top-4'
      }`}>
        {/* Automastion/Auto text - positioned absolutely on top */}
        <div className="absolute left-5 top-0 z-20 overflow-hidden h-[88px] flex items-center">
          <h1 className={`${isMobile ? 'text-4xl' : 'text-6xl'} transition-colors duration-700 ease-in-out ${
            isScrolled ? 'text-white' : 'text-black'
          }`}>
            {isMobile ? 'Auto' : 'Automastion'}
          </h1>

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

        {/* Desktop Navigation */}
        <div className={`hidden md:flex justify-between items-center bg-black h-[88px] transition-all duration-700 ease-in-out ml-auto ${
          isScrolled 
            ? 'w-full pl-[420px] pr-8' // Increased padding-left to prevent overlap
            : 'w-[65%] p-5'
        }`}>
          <h1 className={`text-white uppercase text-base ${isScrolled ? 'ml-8' : 'ml-5'}`}>Home</h1>
          <h1 className="text-white uppercase text-base">About</h1>
          <h1 className="text-white uppercase text-base">Services</h1>
          <h1 className="text-white uppercase text-base">Contact</h1>
          <button
            onClick={handleBookMeetingClick}
            className="text-black bg-[#adff00] rounded-full p-3 text-center max-w-[250px] w-full mr-5 text-base uppercase hover:bg-[#adff00]/90 transition-colors duration-200"
          >
            Book a meeting
          </button>
        </div>

        {/* Mobile Navigation - Now expands like desktop */}
        <div className={`md:hidden flex justify-end items-center bg-black h-[88px] transition-all duration-700 ease-in-out ml-auto mobile-menu-container ${
          isScrolled 
            ? 'w-full pr-5 pl-[200px]' // Expand full width when scrolled, with padding for Auto text
            : 'w-[120px] pr-5' // Small width when not scrolled
        }`}>
          {/* Hamburger Menu Button with proper X animation */}
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col justify-center items-center w-[60px] h-[60px] my-[14px] relative z-[60]"
          >
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'
            }`}></div>
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out my-1 ${
              isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`}></div>
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'
            }`}></div>
          </button>
        </div>

        {/* Mobile Menu Overlay with Animations - Expands from hamburger position */}
        <div 
          className={`md:hidden fixed bg-black transition-all duration-500 ease-in-out z-50 mobile-menu-container ${
            isMobileMenuOpen 
              ? 'opacity-100 visible' 
              : 'opacity-0 invisible'
          } ${
            isScrolled 
              ? 'top-[88px] left-0 right-0 bottom-0' // Only expand down when scrolled
              : 'top-0 left-0 right-0 bottom-0' // Expand all directions when not scrolled
          }`}
          style={{
            transform: isMobileMenuOpen 
              ? 'scale(1)' 
              : 'scale(0.8)',
            transformOrigin: isScrolled 
              ? 'top right' // Expand from top-right (hamburger position) when scrolled
              : 'center right', // Expand from center-right when not scrolled
          }}
        >
          <div className={`flex flex-col justify-center items-center h-full space-y-8 transition-all duration-300 delay-200 ${
            isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } ${isScrolled ? 'pt-8' : ''}`}>
            <h1 className="text-white uppercase text-2xl">Home</h1>
            <h1 className="text-white uppercase text-2xl">About</h1>
            <h1 className="text-white uppercase text-2xl">Services</h1>
            <h1 className="text-white uppercase text-2xl">Contact</h1>
            <button
              onClick={handleBookMeetingClick}
              className="text-black bg-[#adff00] rounded-full p-4 text-center w-[80%] max-w-[300px] text-lg uppercase hover:bg-[#adff00]/90 transition-colors duration-200"
            >
              Book a meeting
            </button>
          </div>
        </div>
      </div>

      {/* Blur fade effect below navbar with smooth fade in/out */}
      {showBlur && (
        <div 
          className={`fixed top-[88px] left-0 right-0 h-6 z-40 transition-opacity duration-300 ease-in-out ${
            blurVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
            backdropFilter: 'blur(6px)',
          }}
        />
      )}
    </>
  );
}
