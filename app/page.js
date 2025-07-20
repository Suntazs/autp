"use client";

import { useState, useRef, useEffect } from "react";
import ButtonDefault from "@/components/ui/buttons/buttondefult";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showFirstHeading, setShowFirstHeading] = useState(false);
  const [showSecondHeading, setShowSecondHeading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState({});
  const [selectedSection, setSelectedSection] = useState(0);

  const inputRef = useRef(null);
  const hiddenSpanRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const sectionRefs = useRef([]);

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
        x: (e.clientX - window.innerWidth / 2) * 0.05, // Increased movement factor
        y: (e.clientY - window.innerHeight / 2) * 0.05,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll tracking for parallax effect and section progress
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Calculate section progress
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      let currentActiveSection = 0;

      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const sectionTop = scrollTop + rect.top;
          const sectionHeight = rect.height;

          // Calculate how much of the section has been scrolled through
          const sectionStart = sectionTop - windowHeight;
          const sectionEnd = sectionTop + sectionHeight;
          const viewportTop = scrollTop;
          const viewportBottom = scrollTop + windowHeight;

          let progress = 0;

          // Only calculate progress if all previous sections are complete
          let canProgress = true;
          for (let i = 0; i < index; i++) {
            const prevSectionProgress = sectionProgress[i] || 0;
            if (prevSectionProgress < 1) {
              canProgress = false;
              break;
            }
          }

          if (canProgress) {
            if (viewportBottom > sectionStart && viewportTop < sectionEnd) {
              // Section is in view, calculate progress
              const totalScrollDistance = sectionHeight + windowHeight;
              const scrolledDistance = Math.max(
                0,
                viewportBottom - sectionStart
              );
              progress = Math.min(1, scrolledDistance / totalScrollDistance);
              currentActiveSection = index;
            } else if (viewportTop >= sectionEnd) {
              // Section is fully scrolled past
              progress = 1;
            }
          }

          setSectionProgress((prev) => ({
            ...prev,
            [index]: progress,
          }));
        }
      });

      setActiveSection(currentActiveSection);

      // Update selected section based on scroll position if not manually selected
      setSelectedSection(currentActiveSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionProgress]);

  // Function to scroll to a specific section
  const scrollToSection = (index) => {
    setSelectedSection(index);
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Heading reveal animation
  useEffect(() => {
    // Start both animations with a longer initial delay
    const timer = setTimeout(() => {
      setShowFirstHeading(true);
      setShowSecondHeading(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Calculate cursor position
  useEffect(() => {
    if (hiddenSpanRef.current && inputRef.current) {
      const textToMeasure = isFocused ? inputValue : placeholderText;
      hiddenSpanRef.current.textContent = textToMeasure;
      const textWidth = hiddenSpanRef.current.offsetWidth;
      const inputPadding = 16; // padding from the input
      const cursorSpacing = 1; // 1px spacing from text
      setCursorPosition(textWidth + inputPadding + cursorSpacing);
    }
  }, [inputValue, placeholderText, isFocused]);

  // Typing effect for placeholder
  useEffect(() => {
    if (isFocused || isAnimating) return;

    const currentText = placeholderTexts[currentTextIndex];

    if (!isDeleting) {
      // Typing phase
      if (placeholderText.length < currentText.length) {
        typingTimeoutRef.current = setTimeout(() => {
          setPlaceholderText(currentText.slice(0, placeholderText.length + 1));
        }, 100 + Math.random() * 100); // Variable typing speed
      } else {
        // Pause before deleting
        typingTimeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    } else {
      // Deleting phase
      if (placeholderText.length > 0) {
        typingTimeoutRef.current = setTimeout(() => {
          setPlaceholderText(placeholderText.slice(0, -1));
        }, 50 + Math.random() * 50); // Faster deletion
      } else {
        // Move to next text
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

    // Clear any ongoing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Smoothly delete the placeholder text
    const deleteText = () => {
      setPlaceholderText((prev) => {
        if (prev.length > 0) {
          setTimeout(deleteText, 30); // Fast deletion on focus
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
      // Reset typing effect when input is empty and loses focus
      setPlaceholderText("");
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center relative mt-10">
      <section className="flex flex-col items-center p-24 w-full relative">
        {/* Clean Circle with Gradient */}
        <div
          className=" w-40 h-40 rounded-full mb-8 absolute top-[20%] left-[-80px] -z-10 transition-transform duration-300 ease-out"
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

        {/* <img
        src="/img/an-elderly-man-with-gray-hair-and-wearing-glasses-.png"
        alt="granpa"
        className=" w-[500px] absolute bottom-0 left-[5%] -z-10"
      /> */}

        <div className="w-full max-w-4xl mb-20 px-4 flex flex-col items-center">
          <div
            className="relative overflow-hidden"
            style={{ width: "max-content" }}
          >
            <div
              className="flex flex-col items-center"
              style={{ minWidth: "max-content" }}
            >
              <h1
                className="font-bold text-center block"
                style={{
                  fontSize: "clamp(2rem, 12vw, 8rem)",
                  whiteSpace: "nowrap",
                  lineHeight: "1.2",
                  marginBottom: "-0.5rem",
                  minWidth: "max-content",
                }}
              >
                Innovation
              </h1>

              <h1
                className="font-bold text-center block"
                style={{
                  fontSize: "clamp(2rem, 12vw, 8rem)",
                  whiteSpace: "nowrap",
                  lineHeight: "1.2",
                  minWidth: "max-content",
                }}
              >
                Unleashed
              </h1>
            </div>

            {/* Reveal overlay for first heading */}
            <div
              className={`absolute bg-[#adff00] ${
                showFirstHeading ? "heading-reveal" : ""
              }`}
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: "50%",
              }}
            />

            {/* Reveal overlay for second heading */}
            <div
              className={`absolute bg-[#adff00] ${
                showSecondHeading ? "heading-reveal-delayed" : ""
              }`}
              style={{
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-[400px] mb-16">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full bg-[#1a1a1a] text-white rounded-full p-4 border-none outline-none focus:outline-none focus:ring-0 focus:border-none"
              style={{
                borderWidth: "3px",
                border: "none",
                caretColor: "transparent",
              }}
            />

            {/* Placeholder text overlay */}
            {!isFocused && inputValue === "" && (
              <div
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                style={{
                  fontSize: "16px",
                  fontFamily: "inherit",
                }}
              >
                {placeholderText}
              </div>
            )}

            {/* Hidden span to measure text width */}
            <span
              ref={hiddenSpanRef}
              className="absolute invisible text-white"
              style={{
                fontSize: "16px",
                fontFamily: "inherit",
                whiteSpace: "pre",
                left: "16px",
              }}
            >
              {isFocused ? inputValue : placeholderText}
            </span>

            {/* Custom cursor */}
            {cursorVisible && (
              <div
                className="absolute top-1/2 transform -translate-y-1/2 bg-[#adff00] transition-all duration-75"
                style={{
                  left: `${cursorPosition}px`,
                  width: "5px",
                  height: "20px",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
          <ButtonDefault className="w-fit">Click me Boo</ButtonDefault>
        </div>
        <div className="w-[500px]">
          <h1 className="text-xl font-light text-center mb-2">
            Busniess automastion
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            feugiat rutrum luctus. Nullam eu ante auctor sodales nec et nibh.
            Morbi at tempor ex. Sed pulvinar
          </p>
        </div>
      </section>
      <section className="py-12 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex gap-8 lg:gap-16">
          {/* Left Side - Progress Navigation */}
          <div className="w-1/4 sticky top-20 h-fit">
            <div className="space-y-8">
              {[
                { title: "ANALYZE" },
                { title: "TRAIN" },
                { title: "TEST" },
                { title: "DEPLOY" },
              ].map((section, index) => (
                <div key={index} className="relative">
                  <div
                    className={`flex items-center gap-4 mb-3 cursor-pointer hover:opacity-90 transition-all duration-300 p-3 rounded-lg ${
                      selectedSection === index ? "bg-black" : "bg-transparent"
                    }`}
                    onClick={() => scrollToSection(index)}
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-sm text-white">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-bold text-lg text-white">
                      {section.title}
                    </h3>
                  </div>

                  {/* Horizontal Progress Line */}
                  <div className="relative mb-2">
                    <div className="w-full h-0.5 bg-gray-700 rounded-full" />
                    <div
                      className="absolute top-0 left-0 h-0.5 bg-[#adff00] rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${(sectionProgress[index] || 0) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Content Sections */}
          <div className="w-3/4 space-y-32">
            {/* Section 1 - ANALYZE */}
            <div
              ref={(el) => (sectionRefs.current[0] = el)}
              className={`min-h-screen flex flex-col justify-center transition-opacity duration-300 ${
                selectedSection === 0 ? "opacity-100" : "opacity-80"
              }`}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="mb-6">
                  <span className="text-[#adff00] text-sm font-semibold">
                    01
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    ANALYZE
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Monitor, analyze, and optimize Fin's performance with a
                    complete view across your entire customer experience. Spot
                    trends, uncover insights and improve service quality with
                    AI-powered Suggestions.
                  </p>
                </div>

                {/* Screenshot placeholder */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                  <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#adff00] rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-400">
                        Analytics Dashboard Preview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 - TRAIN */}
            <div
              ref={(el) => (sectionRefs.current[1] = el)}
              className={`min-h-screen flex flex-col justify-center transition-opacity duration-300 ${
                selectedSection === 1 ? "opacity-100" : "opacity-80"
              }`}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="mb-6">
                  <span className="text-[#adff00] text-sm font-semibold">
                    02
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-4">TRAIN</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Enhance your AI capabilities with our comprehensive training
                    system. Build custom models, fine-tune responses, and create
                    intelligent workflows that adapt to your specific business
                    needs.
                  </p>
                </div>

                {/* Screenshot placeholder */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                  <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#adff00] rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-gray-400">
                        Training Interface Preview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 - TEST */}
            <div
              ref={(el) => (sectionRefs.current[2] = el)}
              className={`min-h-screen flex flex-col justify-center transition-opacity duration-300 ${
                selectedSection === 2 ? "opacity-100" : "opacity-80"
              }`}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="mb-6">
                  <span className="text-[#adff00] text-sm font-semibold">
                    03
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-4">TEST</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Validate your AI implementations with our comprehensive
                    testing suite. Run automated tests, simulate user
                    interactions, and ensure optimal performance before
                    deployment.
                  </p>
                </div>

                {/* Screenshot placeholder */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                  <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#adff00] rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-400">Testing Suite Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 - DEPLOY */}
            <div
              ref={(el) => (sectionRefs.current[3] = el)}
              className={`min-h-screen flex flex-col justify-center transition-opacity duration-300 ${
                selectedSection === 3 ? "opacity-100" : "opacity-80"
              }`}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="mb-6">
                  <span className="text-[#adff00] text-sm font-semibold">
                    04
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-4">DEPLOY</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Launch your AI solutions with confidence using our seamless
                    deployment process. Scale effortlessly, monitor performance
                    in real-time, and maintain optimal service delivery.
                  </p>
                </div>

                {/* Screenshot placeholder */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                  <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#adff00] rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-400">
                        Deployment Dashboard Preview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
