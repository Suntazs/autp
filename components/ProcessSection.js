"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
export default function ProcessSection() {
  const [activeSection, setActiveSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState({});
  const [selectedSection, setSelectedSection] = useState(0);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  
  // Slider navigation states for each section
  const [sliderStates, setSliderStates] = useState({
    0: { canScrollLeft: false, canScrollRight: true },
    1: { canScrollLeft: false, canScrollRight: true },
    2: { canScrollLeft: false, canScrollRight: true },
    3: { canScrollLeft: false, canScrollRight: true }
  });

  const sectionRefs = useRef([]);
  const categoryScrollRef = useRef(null);
  const categoryRefs = useRef([]);
  const manualScrollTimeoutRef = useRef(null);
  const sliderRefs = useRef({});

  const services = [
    { 
      id: "01", 
      title: "E-COMMERCE", 
      subtitle: "Online Store Solutions",
      description: "Full-featured online stores with payment processing, inventory management, and customer accounts. Perfect for businesses looking to sell products online with professional storefronts.",
      features: ["Shopping Cart", "Payment Gateway", "Inventory System", "User Accounts", "Order Management", "SEO Optimization"],
      price: "Starting from $2,500",
      color: "from-purple-500/20 to-pink-500/20"
    },
    { 
      id: "02", 
      title: "CORPORATE", 
      subtitle: "Business Websites",
      description: "Professional corporate websites that establish credibility and drive business growth. Showcase your services, team, and company values with a modern design.",
      features: ["Professional Design", "CMS Integration", "Contact Forms", "SEO Optimization", "Team Pages", "Service Showcase"],
      price: "Starting from $1,500",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    { 
      id: "03", 
      title: "PORTFOLIO", 
      subtitle: "Creative Showcases",
      description: "Stunning portfolio websites for artists, designers, photographers, and creative professionals. Display your work beautifully with gallery systems and project showcases.",
      features: ["Gallery System", "Project Showcase", "Contact Integration", "Mobile Responsive", "Image Optimization", "Custom Layouts"],
      price: "Starting from $800",
      color: "from-green-500/20 to-emerald-500/20"
    },
    { 
      id: "04", 
      title: "WEB APPS", 
      subtitle: "Custom Applications",
      description: "Complex web applications with advanced functionality and user management systems. Built for businesses that need custom solutions and advanced features.",
      features: ["User Authentication", "Database Integration", "API Development", "Admin Dashboard", "Real-time Features", "Custom Logic"],
      price: "Starting from $5,000",
      color: "from-orange-500/20 to-red-500/20"
    },
  ];

  // Sample websites for each category
  const sampleWebsites = {
    0: [ // E-commerce
      { 
        title: "Fashion Store", 
        description: "Modern fashion e-commerce with cart, wishlist, and secure checkout.", 
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop" 
      },
      { 
        title: "Electronics Shop", 
        description: "Tech store with advanced filtering and product comparisons.", 
        image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&h=600&fit=crop" 
      },
      { 
        title: "Jewelry Store", 
        description: "Luxury jewelry showcase with 360° product views.", 
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop" 
      },
      { 
        title: "Food Market", 
        description: "Online food delivery platform with real-time tracking.", 
        image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&h=600&fit=crop" 
      },
      { 
        title: "Book Store", 
        description: "Digital bookstore with preview features and recommendations.", 
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop" 
      }
    ],
    1: [ // Corporate
      { 
        title: "Law Firm", 
        description: "Professional legal website with case studies and client portal.", 
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop" 
      },
      { 
        title: "Consulting", 
        description: "Business consulting site with service portfolios.", 
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop" 
      },
      { 
        title: "Real Estate", 
        description: "Property showcase platform with virtual tours.", 
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop" 
      },
      { 
        title: "Medical Practice", 
        description: "Healthcare website with appointment scheduling.", 
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop" 
      },
      { 
        title: "Marketing Agency", 
        description: "Creative agency portfolio showcasing campaigns.", 
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop" 
      }
    ],
    2: [ // Portfolio
      { 
        title: "Photography", 
        description: "Stunning photo gallery with lightbox effects.", 
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop" 
      },
      { 
        title: "Design Studio", 
        description: "Creative portfolio with interactive showcases.", 
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop" 
      },
      { 
        title: "Architecture", 
        description: "Architectural firm showcase with 3D viewers.", 
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop" 
      },
      { 
        title: "Artist Portfolio", 
        description: "Artist portfolio with exhibition history.", 
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop" 
      },
      { 
        title: "Creative Agency", 
        description: "Multi-disciplinary creative showcase.", 
        image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop" 
      }
    ],
    3: [ // Web Apps
      { 
        title: "CRM System", 
        description: "Customer relationship management platform.", 
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop" 
      },
      { 
        title: "Task Manager", 
        description: "Project management with team collaboration.", 
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop" 
      },
      { 
        title: "Learning Platform", 
        description: "Educational platform with course creation.", 
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop" 
      },
      { 
        title: "Social Network", 
        description: "Community platform with user profiles.", 
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
      },
      { 
        title: "Analytics Tool", 
        description: "Data visualization with real-time metrics.", 
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" 
      }
    ]
  };

  // Center selected category in mobile scroll
  const centerSelectedCategory = (index) => {
    if (categoryScrollRef.current && categoryRefs.current[index]) {
      const scrollContainer = categoryScrollRef.current;
      const selectedElement = categoryRefs.current[index];
      
      const containerWidth = scrollContainer.offsetWidth;
      const elementWidth = selectedElement.offsetWidth;
      const elementLeft = selectedElement.offsetLeft;
      const currentScrollLeft = scrollContainer.scrollLeft;
      
      const targetScrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2);
      
      // Only scroll if the target position is significantly different
      if (Math.abs(currentScrollLeft - targetScrollLeft) > 10) {
        scrollContainer.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  // Check scroll position for slider arrows
  const checkSliderScrollPosition = (sectionIndex) => {
    const slider = sliderRefs.current[sectionIndex];
    if (slider) {
      const { scrollLeft, scrollWidth, clientWidth } = slider;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
      
      setSliderStates(prev => ({
        ...prev,
        [sectionIndex]: { canScrollLeft, canScrollRight }
      }));
    }
  };

  // Slider navigation functions
  const scrollSliderLeft = (sectionIndex) => {
    const slider = sliderRefs.current[sectionIndex];
    if (slider) {
      slider.scrollBy({ left: -308, behavior: 'smooth' }); // 280px + 28px gap
    }
  };

  const scrollSliderRight = (sectionIndex) => {
    const slider = sliderRefs.current[sectionIndex];
    if (slider) {
      slider.scrollBy({ left: 308, behavior: 'smooth' }); // 280px + 28px gap
    }
  };

  // Scroll tracking for section progress
  useEffect(() => {
    let lastScrollTime = 0;
    let lastScrollY = window.scrollY;
    
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const viewportCenter = scrollTop + windowHeight / 2;

      // Calculate overall progress across all sections
      if (sectionRefs.current.length > 0) {
        const firstSection = sectionRefs.current[0];
        const lastSection = sectionRefs.current[services.length - 1];
        
        if (firstSection && lastSection) {
          const firstRect = firstSection.getBoundingClientRect();
          const lastRect = lastSection.getBoundingClientRect();
          
          const firstSectionTop = scrollTop + firstRect.top;
          const lastSectionBottom = scrollTop + lastRect.top + lastRect.height;
          
          const totalDistance = lastSectionBottom - firstSectionTop;
          const scrolledDistance = Math.max(0, viewportCenter - firstSectionTop);
          const overallProg = Math.min(1, Math.max(0, scrolledDistance / totalDistance));
          
          setOverallProgress(overallProg);
        }
      }

      // Individual section progress for desktop
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const sectionTop = scrollTop + rect.top;
          const sectionHeight = rect.height;

          let progress = 0;

          // Smooth progress calculation that follows scroll continuously
          const sectionStartTrigger = sectionTop - windowHeight * 0.1;
          const sectionEndTrigger = sectionTop + sectionHeight * 0.9;

          if (viewportCenter >= sectionStartTrigger && viewportCenter <= sectionEndTrigger) {
            const progressDistance = sectionEndTrigger - sectionStartTrigger;
            const scrolledDistance = Math.max(0, viewportCenter - sectionStartTrigger);
            progress = Math.min(1, scrolledDistance / progressDistance);
          } else if (viewportCenter > sectionEndTrigger) {
            progress = 1;
          }

          setSectionProgress((prev) => ({
            ...prev,
            [index]: progress,
          }));
        }
      });
    };

    const handleSectionDetection = () => {
      // Skip auto-detection if user is manually scrolling
      if (isManualScrolling) return;

      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const viewportCenter = scrollTop + windowHeight / 2;
      let newActiveSection = activeSection;
      let bestMatch = { index: activeSection, distance: Infinity, confidence: 0 };

      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const sectionTop = scrollTop + rect.top;
          const sectionHeight = rect.height;
          const sectionCenter = sectionTop + sectionHeight / 2;
          const sectionBottom = sectionTop + sectionHeight;

          // Calculate distance from viewport center to section center
          const distance = Math.abs(viewportCenter - sectionCenter);
          
          // Calculate confidence based on how much of the section is in view
          const visibleTop = Math.max(sectionTop, scrollTop);
          const visibleBottom = Math.min(sectionBottom, scrollTop + windowHeight);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const confidence = visibleHeight / sectionHeight;

          // Prefer sections with higher confidence (more visible)
          if (confidence > bestMatch.confidence || (confidence === bestMatch.confidence && distance < bestMatch.distance)) {
            bestMatch = { index, distance, confidence };
          }

          // Direct hit - viewport center is within section bounds
          if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
            newActiveSection = index;
          }
        }
      });

      // Use best match if no direct hit and it has decent confidence
      if (newActiveSection === activeSection && bestMatch.confidence > 0.3) {
        newActiveSection = bestMatch.index;
      }

             // Only update if there's a significant change to prevent glitching
       if (newActiveSection !== activeSection) {
         setActiveSection(newActiveSection);
         setSelectedSection(newActiveSection);
         // Center the selected category on mobile with smooth scroll
         centerSelectedCategory(newActiveSection);
       }
    };

    let animationFrameId = null;

    const handleScroll = () => {
      // Detect user-initiated scrolling to clear manual scrolling flag
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTime;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY);
      
      // Clear manual scrolling flag immediately for any movement
      if (isManualScrolling) {
        // Clear manual flag for ANY scrolling after click (even tiny movements)
        if (scrollDiff > 3 || timeDiff > 200) {
          setIsManualScrolling(false);
          if (manualScrollTimeoutRef.current) {
            clearTimeout(manualScrollTimeoutRef.current);
          }
        }
      }
      
      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
      
      // Cancel previous animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Use requestAnimationFrame for smoothest updates
      animationFrameId = requestAnimationFrame(() => {
        updateProgress();
        handleSectionDetection();
      });
    };

    // Direct user input detection
    const handleUserScroll = () => {
      if (isManualScrolling) {
        setIsManualScrolling(false);
        if (manualScrollTimeoutRef.current) {
          clearTimeout(manualScrollTimeoutRef.current);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleUserScroll, { passive: true });
    window.addEventListener("touchmove", handleUserScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchmove", handleUserScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, [activeSection, isManualScrolling]);

  // Set up scroll listeners for sliders
  useEffect(() => {
    const sliders = sliderRefs.current;
    const listeners = {};

    Object.keys(sliders).forEach(sectionIndex => {
      const slider = sliders[sectionIndex];
      if (slider) {
        const handleScroll = () => checkSliderScrollPosition(parseInt(sectionIndex));
        slider.addEventListener('scroll', handleScroll);
        listeners[sectionIndex] = handleScroll;
        
        // Initial check
        checkSliderScrollPosition(parseInt(sectionIndex));
      }
    });

    return () => {
      Object.keys(listeners).forEach(sectionIndex => {
        const slider = sliders[sectionIndex];
        if (slider && listeners[sectionIndex]) {
          slider.removeEventListener('scroll', listeners[sectionIndex]);
        }
      });
    };
  }, [services.length]);

  const scrollToSection = (index) => {
    // Set manual scrolling flag to prevent auto-detection conflicts
    setIsManualScrolling(true);
    setSelectedSection(index);
    setActiveSection(index);
    
    // Center the category with smooth behavior for manual selection
    centerSelectedCategory(index);
    
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Clear manual scrolling flag after a shorter time and detect user scroll
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }
    manualScrollTimeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false);
    }, 100); // Very short timeout for immediate responsiveness
  };

  const renderServiceSection = (service, index) => {
    // E-COMMERCE Design (Modern Layout)
    if (index === 0) {
      return (
        <div
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          className={`transition-all duration-300 ${
            selectedSection === index ? "opacity-100" : "opacity-80"
          }`}
        >
          <div className=" p-4 md:p-8 mb-8 bg-[#E4FF97] transition-all duration-300">
            {/* Header with animated badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3  py-2 mb-4">
                <span className="text-black text-lg font-semibold">{service.id}</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-black  mb-2">
                {service.title}
              </h2>
              <h3 className="text-lg md:text-2xl text-black mb-8 font-light">{service.subtitle}</h3>
                                           <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
                {service.description}
              </p>
              <div className="mb-8">
                <Link href="/services/ecommerce-design" className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm font-medium">
                  Learn More
                </Link>
              </div>
            </div>



            {/* Our Work Slider */}
            <div className="mb-6">
              {/* Header with navigation arrows - desktop only */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-black font-extralight text-lg md:text-2xl flex items-center gap-3">
                  Our Work
                </h4>
                
                {/* Navigation arrows - desktop only */}
                <div className="hidden md:flex gap-4">
                  <button
                    onClick={() => scrollSliderLeft(index)}
                    disabled={!sliderStates[index]?.canScrollLeft}
                    className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
                      sliderStates[index]?.canScrollLeft 
                        ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${sliderStates[index]?.canScrollLeft ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => scrollSliderRight(index)}
                    disabled={!sliderStates[index]?.canScrollRight}
                    className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
                      sliderStates[index]?.canScrollRight 
                        ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${sliderStates[index]?.canScrollRight ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="w-full overflow-hidden">
                <div 
                  ref={(el) => (sliderRefs.current[index] = el)}
                  className="flex gap-3 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-hide"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {sampleWebsites[index]?.map((website, idx) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-[280px] md:min-w-[600px] snap-center"
                    >
                      <div className="overflow-hidden hover:opacity-90 transition-all duration-300">
                        {/* Hero Image - Mobile mockup style */}
                        <div className="h-[400px] md:h-[400px] overflow-hidden border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300">
                          <img 
                            src={website.image} 
                            alt={website.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="pt-4 md:pt-6">
                          <h5 className="text-base md:text-xl font-bold text-black mb-2">
                            {website.title}
                          </h5>
                          <p className="text-zinc-600 text-xs md:text-base">
                            {website.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // CORPORATE Design (Modern Layout)
    if (index === 1) {
      return (
        <div
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          className={`transition-all duration-300 ${
            selectedSection === index ? "opacity-100" : "opacity-80"
          }`}
        >
          <div className=" p-4 md:p-8 mb-8 bg-[#CB9FD2] transition-all duration-300">
            {/* Header with animated badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3  py-2 mb-4">
                <span className="text-black text-lg font-semibold">{service.id}</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-black  mb-2">
                {service.title}
              </h2>
              <h3 className="text-lg md:text-2xl text-black mb-8 font-light">{service.subtitle}</h3>
                                           <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
                {service.description}
              </p>
              <div className="mb-8">
                <Link href="/services/corporate-design" className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm font-medium">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Our Work Slider */}
            <div className="mb-6">
              {/* Header with navigation arrows - desktop only */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-black font-extralight text-lg md:text-2xl flex items-center gap-3">
                  Our Work
                </h4>
                
                {/* Navigation arrows - desktop only */}
                <div className="hidden md:flex gap-4">
                  <button
                    onClick={() => scrollSliderLeft(index)}
                    disabled={!sliderStates[index]?.canScrollLeft}
                    className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
                      sliderStates[index]?.canScrollLeft 
                        ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${sliderStates[index]?.canScrollLeft ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => scrollSliderRight(index)}
                    disabled={!sliderStates[index]?.canScrollRight}
                    className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
                      sliderStates[index]?.canScrollRight 
                        ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${sliderStates[index]?.canScrollRight ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="w-full overflow-hidden">
                <div 
                  ref={(el) => (sliderRefs.current[index] = el)}
                  className="flex gap-3 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-hide"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {sampleWebsites[index]?.map((website, idx) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-[280px] md:min-w-[600px] snap-center"
                    >
                      <div className="overflow-hidden hover:opacity-90 transition-all duration-300">
                        {/* Hero Image - Mobile mockup style */}
                        <div className="h-[400px] md:h-[400px] overflow-hidden border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300">
                          <img 
                            src={website.image} 
                            alt={website.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="pt-4 md:pt-6">
                          <h5 className="text-base md:text-xl font-bold text-black mb-2">
                            {website.title}
                          </h5>
                          <p className="text-zinc-600 text-xs md:text-base">
                            {website.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // PORTFOLIO Design (Modern Layout)
    if (index === 2) {
      return (
        <div
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          className={`transition-all duration-300 ${
            selectedSection === index ? "opacity-100" : "opacity-80"
          }`}
        >
          <div className=" p-4 md:p-8 mb-8 bg-[#FADCA2] transition-all duration-300">
            {/* Header with animated badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3  py-2 mb-4">
                <span className="text-black text-lg font-semibold">{service.id}</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-black  mb-2">
                {service.title}
              </h2>
              <h3 className="text-lg md:text-2xl text-black mb-8 font-light">{service.subtitle}</h3>
                                           <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
                {service.description}
              </p>
              <div className="mb-8">
                <Link href="/services/portfolio-design" className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm font-medium">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Our Work Slider */}
            <div className="mb-6">
              {/* Header with navigation arrows - desktop only */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-black font-extralight text-lg md:text-2xl flex items-center gap-3">
                  Our Work
                </h4>
                
                {/* Navigation arrows - desktop only */}
                <div className="hidden md:flex gap-4">
                  <button
                    onClick={() => scrollSliderLeft(index)}
                    disabled={!sliderStates[index]?.canScrollLeft}
                    className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
                      sliderStates[index]?.canScrollLeft 
                        ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${sliderStates[index]?.canScrollLeft ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => scrollSliderRight(index)}
                    disabled={!sliderStates[index]?.canScrollRight}
                    className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
                      sliderStates[index]?.canScrollRight 
                        ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${sliderStates[index]?.canScrollRight ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="w-full overflow-hidden">
                <div 
                  ref={(el) => (sliderRefs.current[index] = el)}
                  className="flex gap-3 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-hide"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {sampleWebsites[index]?.map((website, idx) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-[280px] md:min-w-[600px] snap-center"
                    >
                      <div className="overflow-hidden hover:opacity-90 transition-all duration-300">
                        {/* Hero Image - Mobile mockup style */}
                        <div className="h-[400px] md:h-[400px] overflow-hidden border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300">
                          <img 
                            src={website.image} 
                            alt={website.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="pt-4 md:pt-6">
                          <h5 className="text-base md:text-xl font-bold text-black mb-2">
                            {website.title}
                          </h5>
                          <p className="text-zinc-600 text-xs md:text-base">
                            {website.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // WEB APPS Design (Modern Layout)
    if (index === 3) {
      return (
        <div
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          className={`transition-all duration-300 ${
            selectedSection === index ? "opacity-100" : "opacity-80"
          }`}
        >
          <div className=" p-4 md:p-8 mb-8 bg-[#FFB7B7] transition-all duration-300">
            {/* Header with animated badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3  py-2 mb-4">
                <span className="text-black text-lg font-semibold">{service.id}</span>
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-black  mb-2">
                {service.title}
              </h2>
              <h3 className="text-lg md:text-2xl text-black mb-8 font-light">{service.subtitle}</h3>
                                           <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
                {service.description}
              </p>
              <div className="mb-8">
                <Link href="/services/web-apps" className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm font-medium">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Our Work Slider */}
            <div className="mb-6">
              {/* Header with navigation arrows - desktop only */}
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-black font-extralight text-lg md:text-2xl flex items-center gap-3">
                  Our Work
                </h4>
                
                {/* Navigation arrows - desktop only */}
                <div className="hidden md:flex gap-4">
                  <button
                    onClick={() => scrollSliderLeft(index)}
                    disabled={!sliderStates[index]?.canScrollLeft}
                    className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
                      sliderStates[index]?.canScrollLeft 
                        ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${sliderStates[index]?.canScrollLeft ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => scrollSliderRight(index)}
                    disabled={!sliderStates[index]?.canScrollRight}
                    className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
                      sliderStates[index]?.canScrollRight 
                        ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${sliderStates[index]?.canScrollRight ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="w-full overflow-hidden">
                <div 
                  ref={(el) => (sliderRefs.current[index] = el)}
                  className="flex gap-3 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth scrollbar-hide"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {sampleWebsites[index]?.map((website, idx) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 w-[280px] md:min-w-[600px] snap-center"
                    >
                      <div className="overflow-hidden hover:opacity-90 transition-all duration-300">
                        {/* Hero Image - Mobile mockup style */}
                        <div className="h-[400px] md:h-[400px] overflow-hidden border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300">
                          <img 
                            src={website.image} 
                            alt={website.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Content */}
                        <div className="pt-4 md:pt-6">
                          <h5 className="text-base md:text-xl font-bold text-black mb-2">
                            {website.title}
                          </h5>
                          <p className="text-zinc-600 text-xs md:text-base">
                            {website.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Fallback (shouldn't reach here)
    return null;
  };

  return (
    <section className="w-full min-h-screen">
      {/* Mobile Category Bar */}
      <div className="md:hidden sticky top-20 z-[90] bg-black border-b border-gray-700/30 mb-4">
        <div className="w-full overflow-hidden">
          <div 
            ref={categoryScrollRef}
            className="flex overflow-x-auto scrollbar-hide px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                ref={(el) => (categoryRefs.current[index] = el)}
                className="flex-shrink-0 px-4 py-4 cursor-pointer transition-all duration-300"
                onClick={() => scrollToSection(index)}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${
                    selectedSection === index ? 'text-white' : 'text-white/60'
                  }`}>
                    {service.id}
                  </span>
                  <span className={`font-bold text-xs whitespace-nowrap transition-all duration-300 ${
                    selectedSection === index ? 'text-white' : 'text-white/60'
                  }`}>
                    {service.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Full width progress line */}
        <div className="relative w-full h-0.5 bg-gray-700">
          <div
            className="absolute top-0 left-0 h-0.5 bg-[#adff00]"
            style={{
              width: `${overallProgress * 100}%`,
            }}
          />
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">

      {/* Desktop and Mobile Layout */}
      <div className="flex gap-8 relative">
        {/* Desktop Left Side - Service Navigation */}
        <div className="hidden md:block w-1/4">
          <div className="sticky top-30 mb-10">
            <div className="space-y-0 relative">
              {/* Sliding Background Block */}
              <div
                className="absolute inset-x-0 bg-black z-0"
                style={{
                  height: '72px', // Height of each item (p-3 = 12px top/bottom + content height)
                  transform: `translateY(${selectedSection * 72}px)`,
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform'
                }}
              />
              
              {services.map((service, index) => (
                <div key={index} className="relative z-10">
                  <div
                    className="flex flex-col cursor-pointer hover:opacity-90 transition-all duration-300 p-3 bg-transparent"
                    onClick={() => scrollToSection(index)}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={`w-8 h-8 flex items-center justify-center text-sm transition-colors duration-300 ${
                          selectedSection === index ? "text-white" : "text-black"
                        }`}
                      >
                        {service.id}
                      </div>
                      <h3
                        className={`font-bold text-lg transition-colors duration-300 ${
                          selectedSection === index ? "text-white" : "text-black"
                        }`}
                      >
                        {service.title}
                      </h3>
                    </div>

                    {/* Horizontal Progress Line */}
                    <div className="relative">
                      <div className="w-full h-0.5 bg-gray-700" />
                      <div
                        className="absolute top-0 left-0 h-0.5 bg-[#adff00]"
                        style={{
                          width: `${(sectionProgress[index] || 0) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Service Details (Full width on mobile) */}
        <div className="w-full md:w-3/4 md:border-l md:border-gray-700/30 md:pl-8">
          {services.map((service, index) => renderServiceSection(service, index))}
        </div>
      </div>
      </div>
      
      <style jsx global>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          display: none;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          display: none;
        }
      `}</style>
    </section>
  );
} 