"use client";

import { useState, useRef, useEffect } from "react";


export default function HeroSection() {
  const [inputValue, setInputValue] = useState("");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showFirstHeading, setShowFirstHeading] = useState(false);
  const [showSecondHeading, setShowSecondHeading] = useState(false);
  const [showWebsiteLine, setShowWebsiteLine] = useState(false);
  const [showDevelopmentLine, setShowDevelopmentLine] = useState(false);

  const inputRef = useRef(null);
  const hiddenSpanRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const placeholderTexts = [
    "What's your name?",
    "Enter your first name",
    "Type your last name",
    "What should we call you?",
    "Your name here",
  ];

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

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

  // Scroll tracking for parallax effect and line animations
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // No scrollProgress needed now; only parallax uses scrollY
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Heading reveal animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstHeading(true);
      setShowSecondHeading(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Line reveal animations
  useEffect(() => {
    const websiteTimer = setTimeout(() => {
      setShowWebsiteLine(true);
    }, 800);

    const developmentTimer = setTimeout(() => {
      setShowDevelopmentLine(true);
    }, 1200);

    return () => {
      clearTimeout(websiteTimer);
      clearTimeout(developmentTimer);
    };
  }, []);

  // Calculate cursor position
  useEffect(() => {
    if (hiddenSpanRef.current && inputRef.current) {
      const textToMeasure = isFocused ? inputValue : placeholderText;
      hiddenSpanRef.current.textContent = textToMeasure;
      const textWidth = hiddenSpanRef.current.offsetWidth;
      const inputPadding = 16;
      const cursorSpacing = 1;
      setCursorPosition(textWidth + inputPadding + cursorSpacing);
    }
  }, [inputValue, placeholderText, isFocused]);

  // Typing effect for placeholder
  useEffect(() => {
    if (isFocused || isAnimating) return;

    const currentText = placeholderTexts[currentTextIndex];

    if (!isDeleting) {
      if (placeholderText.length < currentText.length) {
        typingTimeoutRef.current = setTimeout(() => {
          setPlaceholderText(currentText.slice(0, placeholderText.length + 1));
        }, 100 + Math.random() * 100);
      } else {
        typingTimeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      if (placeholderText.length > 0) {
        typingTimeoutRef.current = setTimeout(() => {
          setPlaceholderText(placeholderText.slice(0, -1));
        }, 50 + Math.random() * 50);
      } else {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % placeholderTexts.length);
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [placeholderText, isDeleting, currentTextIndex, isFocused, isAnimating]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsAnimating(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const deleteText = () => {
      setPlaceholderText((prev) => {
        if (prev.length > 0) {
          setTimeout(deleteText, 30);
          return prev.slice(0, -1);
        } else {
          setIsAnimating(false);
          return "";
        }
      });
    };

    deleteText();
  };

  const handleBlur = () => {
    if (inputValue === "") {
      setIsFocused(false);
      setIsAnimating(false);
      setPlaceholderText("");
      setIsDeleting(false);
    }
  };

  return (
    <section className="w-full min-h-[600px] sm:min-h-auto flex flex-col justify-center items-center relative px-4 sm:px-6 md:px-8 lg:px-24 py-8 sm:py-12 md:py-16 lg:py-24 xl:py-34 ">
      {/* --------------------------------------------- */}
      {/* Mobile Layout ( < sm ) */}
      <div className="flex flex-col items-center w-full gap-4 sm:hidden">
        {/* WEBSITE – overlay reveals L ➜ R */}
        <div className="relative inline-block">
          <h1 className="text-[3.5rem] xs:text-[4rem] font-black text-black leading-none tracking-tight select-none">
            WEBSITE
          </h1>
          <span
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-screen h-full bg-[#E4FF97] origin-left transition-transform duration-1000 ease-out ${
              showWebsiteLine ? 'scale-x-0' : 'scale-x-100'
            }`}
          />
        </div>

        {/* DEVELOPMENT – overlay reveals R ➜ L */}
        <div className="relative inline-block">
          <h1 className="text-[3.5rem] xs:text-[4rem] font-black text-black leading-none tracking-tight select-none">
            DEVELOPMENT
          </h1>
          <span
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-screen h-full bg-[#FFB7B7] origin-right transition-transform duration-1000 ease-out ${
              showDevelopmentLine ? 'scale-x-0' : 'scale-x-100'
            }`}
          />
        </div>

        {/* Description */}
        <p className="text-center text-gray-700 text-base px-4">
          Crafting modern, responsive experiences from design to deployment.
        </p>

        {/* Action Buttons */}
        
      </div>

      {/* --------------------------------------------- */}
      {/* Desktop / Tablet Layout ( ≥ sm ) */}
      <div className="hidden sm:flex flex-col w-full gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        {/* WEBSITE Row */}
        <div className="flex items-center w-screen relative left-1/2 transform -translate-x-1/2">
          <div className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] font-black text-black leading-none tracking-tight select-none ml-4 sm:ml-6 md:ml-8">
            WEBSITE
          </div>
          <div
            className={`flex-1 h-[3rem] sm:h-[4rem] md:h-[6rem] lg:h-[8rem] xl:h-[12rem] bg-[#E4FF97] ml-2 sm:ml-3 md:ml-4 transition-transform duration-1000 ease-out origin-right ${
              showWebsiteLine ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </div>

        {/* DEVELOPMENT Row */}
        <div className="flex items-center w-screen relative left-1/2 transform -translate-x-1/2">
          <div
            className={`flex-1 h-[3rem] sm:h-[4rem] md:h-[6rem] lg:h-[8rem] xl:h-[12rem] bg-[#FFB7B7] mr-2 sm:mr-3 md:mr-4 transition-transform duration-1000 ease-out origin-left ${
              showDevelopmentLine ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
          <div className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] font-black text-black leading-none tracking-tight select-none mr-4 sm:mr-6 md:mr-8">
            DEVELOPMENT
          </div>
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

      <div
        className="w-32 h-32 rounded-full mb-8 absolute top-[15%] right-[10%] -z-10 transition-transform duration-300 ease-out"
        style={{
          background: "linear-gradient(250deg, #ffffff 25%, #adff00 100%)",
          boxShadow: "0 4px 15px rgba(173, 255, 0, 0.2)",
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