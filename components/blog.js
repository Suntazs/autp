"use client";

import { useState, useEffect, useRef } from "react";

export default function BlogSlide({ image, title, description, link, linkText = "Read More", colorTheme = "green" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Color themes matching ProcessSection backgrounds
  const colorThemes = {
    green: {
      background: "#E4FF97", // E-COMMERCE color
      accent: "#adff00"
    },
    purple: {
      background: "#CB9FD2", // CORPORATE color
      accent: "#8a2be2"
    }, 
    orange: {
      background: "#FADCA2", // PORTFOLIO color
      accent: "#ffa500"
    },
    pink: {
      background: "#FFB7B7", // WEB APPS color
      accent: "#ff1493"
    },
    blue: {
      background: "#B7D7FF", // Additional blue variation
      accent: "#00bfff"
    },
    yellow: {
      background: "#FFFAB7", // Additional yellow variation
      accent: "#ffff00"
    }
  };

  const theme = colorThemes[colorTheme] || colorThemes.green;

  // Mouse tracking for subtle parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = e.currentTarget?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) * 0.02,
          y: (e.clientY - rect.top - rect.height / 2) * 0.02,
        });
      }
    };

    const element = document.querySelector(`[data-blog-slide="${colorTheme}"]`);
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      return () => element.removeEventListener("mousemove", handleMouseMove);
    }
  }, [colorTheme]);

  return (
    <div
      data-blog-slide={colorTheme}
      className="relative w-full h-full cursor-pointer transition-all duration-500 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered 
          ? `translate(${Math.max(-10, Math.min(10, mousePosition.x))}px, ${Math.max(-5, Math.min(5, mousePosition.y))}px)` 
          : 'translate(0, 0)',
        filter: isHovered ? 'brightness(1.05)' : 'brightness(1)',
      }}
    >
      {/* Main container with background color, no borders - full height */}
      <div
        className="relative overflow-hidden transition-all duration-500 h-full flex flex-col"
        style={{
          backgroundColor: theme.background,
        }}
      >
        {/* Image section - taller for more visual impact */}
        <div className="relative w-full overflow-hidden flex-shrink-0 h-48 md:h-80">
          <img
            src={image || "/img/an-elderly-man-with-gray-hair-and-wearing-glasses-.png"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              transform: 'scale(1)', // No zoom effect
              filter: `brightness(0.9) contrast(1.1) saturate(1.2)`,
            }}
          />
        </div>

        {/* Content section - integrated heading within description */}
        <div className="flex-1 flex flex-col p-6 pb-8 md:p-8 md:pb-10">
          {/* Integrated description with bold heading */}
          <div className="flex-1 mb-4">
            <div className="text-black leading-relaxed transition-colors duration-300 text-lg md:text-xl">
              <h3 className="font-bold inline text-xl md:text-2xl">
                {title || "Blog Post Title"}
              </h3>
              <p className="inline">. {description || "This is a sample blog post description that showcases the vibrant design with colorful backgrounds and modern effects."}</p>
            </div>
          </div>

          {/* Link section - consistent bottom positioning */}
          <div className="flex-shrink-0 mt-auto pt-4 md:pt-6">
            <a
              href={link || "#"}
              className="inline-flex items-center gap-3 font-medium text-black transition-all duration-300 group text-lg md:text-xl"
            >
              <span>{linkText}</span>
              <svg
                className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Multiple blog examples with ProcessSection colors
export function BlogGrid() {
  const blogPosts = [
    {
      title: "Web Development Tips",
      description: "Essential tips and tricks for modern web development that every developer should know.",
      link: "/blog/web-dev-tips",
      colorTheme: "green"
    },
    {
      title: "Design Principles",
      description: "Core design principles that create beautiful and functional user interfaces.",
      link: "/blog/design-principles",
      colorTheme: "purple"
    },
    {
      title: "Coding Best Practices",
      description: "Write cleaner, maintainable code with these proven best practices.",
      link: "/blog/coding-practices",
      colorTheme: "orange"
    },
    {
      title: "Modern JavaScript",
      description: "Explore the latest JavaScript features and how to use them effectively.",
      link: "/blog/modern-js",
      colorTheme: "pink"
    },
    {
      title: "CSS Techniques",
      description: "Advanced CSS techniques for creating stunning visual effects.",
      link: "/blog/css-techniques",
      colorTheme: "blue"
    },
    {
      title: "React Patterns",
      description: "Common React patterns and how to implement them in your projects.",
      link: "/blog/react-patterns",
      colorTheme: "yellow"
    },
    {
      title: "Performance Optimization",
      description: "Speed up your website with these performance optimization strategies.",
      link: "/blog/performance",
      colorTheme: "green"
    },
    {
      title: "Mobile Development",
      description: "Building responsive and mobile-first applications.",
      link: "/blog/mobile-dev",
      colorTheme: "purple"
    },
    {
      title: "Database Design",
      description: "Designing efficient and scalable database architectures.",
      link: "/blog/database-design",
      colorTheme: "orange"
    },
    {
      title: "API Development",
      description: "Creating robust and well-documented APIs for your applications.",
      link: "/blog/api-development",
      colorTheme: "pink"
    },
    {
      title: "Testing Strategies",
      description: "Comprehensive testing strategies to ensure code quality.",
      link: "/blog/testing",
      colorTheme: "blue"
    },
    {
      title: "DevOps Practices",
      description: "Streamline your development workflow with modern DevOps practices.",
      link: "/blog/devops",
      colorTheme: "yellow"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 p-8">
      {blogPosts.map((post, index) => (
        <BlogSlide
          key={index}
          title={post.title}
          description={post.description}
          link={post.link}
          colorTheme={post.colorTheme}
        />
      ))}
    </div>
  );
}

// Blog Slider with removed left text and moved content to left
export function BlogSlider() {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [containerPadding, setContainerPadding] = useState('16px');
  const sliderRef = useRef(null);

  // Available color themes - order matters for deterministic generation
  const availableColors = ["green", "purple", "orange", "pink", "blue", "yellow"];

  // Function to generate deterministic colors with no adjacent duplicates
  const generateDeterministicColors = (count) => {
    const colors = [];
    let lastColor = null;
    
    // Use a seed-based approach for consistent colors
    for (let i = 0; i < count; i++) {
      let availableOptions = availableColors.filter(color => color !== lastColor);
      // Use index-based selection instead of random for consistency
      const selectedIndex = i % availableOptions.length;
      const selectedColor = availableOptions[selectedIndex];
      colors.push(selectedColor);
      lastColor = selectedColor;
    }
    
    return colors;
  };

  const blogPosts = [
    {
      title: "Web Development Tips",
      description: "Essential tips and tricks for modern web development that every developer should know.",
      link: "/blog/web-dev-tips"
    },
    {
      title: "Design Principles",
      description: "Core design principles that create beautiful and functional user interfaces.",
      link: "/blog/design-principles"
    },
    {
      title: "Coding Best Practices",
      description: "Write cleaner, maintainable code with these proven best practices.",
      link: "/blog/coding-practices"
    },
    {
      title: "Modern JavaScript",
      description: "Explore the latest JavaScript features and how to use them effectively.",
      link: "/blog/modern-js"
    },
    {
      title: "CSS Techniques",
      description: "Advanced CSS techniques for creating stunning visual effects.",
      link: "/blog/css-techniques"
    },
    {
      title: "React Patterns",
      description: "Common React patterns and how to implement them in your projects.",
      link: "/blog/react-patterns"
    },
    {
      title: "Performance Optimization",
      description: "Speed up your website with these performance optimization strategies.",
      link: "/blog/performance"
    },
    {
      title: "Mobile Development",
      description: "Building responsive and mobile-first applications.",
      link: "/blog/mobile-dev"
    },
    {
      title: "Database Design",
      description: "Designing efficient and scalable database architectures.",
      link: "/blog/database-design"
    },
    {
      title: "API Development",
      description: "Creating robust and well-documented APIs for your applications.",
      link: "/blog/api-development"
    }
  ];

  // Generate deterministic colors for posts (consistent between server and client)
  const [randomColors] = useState(() => generateDeterministicColors(blogPosts.length));

  // Check scroll position to show/hide arrows and update slide counter
  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);

      // Calculate current slide for both mobile and desktop
      const cardWidth = isMobile ? (340 + 24) : (540 + 24); // card width + gap
      const currentSlideIndex = Math.round(scrollLeft / cardWidth) + 1;
      setCurrentSlide(Math.min(Math.max(currentSlideIndex, 1), blogPosts.length));
    }
  };

  // Scroll handlers - updated for wider cards
  const scrollLeft = () => {
    if (sliderRef.current) {
      const scrollAmount = isMobile ? -364 : -564; // Updated mobile scroll amount (340px + 24px gap)
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const scrollAmount = isMobile ? 364 : 564; // Updated mobile scroll amount (340px + 24px gap)
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Calculate container padding to match the website container positioning
  const calculateContainerPadding = () => {
    // Default padding for SSR
    const defaultPadding = '16px';
    
    if (typeof window === 'undefined') return defaultPadding;
    
    const screenWidth = window.innerWidth;
    const maxContainerWidth = 1600;
    
    // Responsive padding values matching your container
    let basePadding;
    if (screenWidth >= 1024) { // lg breakpoint
      basePadding = 64; // px-16
    } else if (screenWidth >= 768) { // md breakpoint  
      basePadding = 32; // px-8
    } else {
      basePadding = 16; // px-4
    }
    
    // If screen is wider than max container width, add centering margin
    if (screenWidth > maxContainerWidth) {
      const centeringMargin = (screenWidth - maxContainerWidth) / 2;
      return `${centeringMargin + basePadding}px`;
    }
    
    return `${basePadding}px`;
  };

  // Handle initial client-side setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      setContainerPadding(calculateContainerPadding());
    }
  }, []);

  // Set up scroll listener and handle responsive padding
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      checkScrollPosition(); // Initial check
      slider.addEventListener('scroll', checkScrollPosition);
      
      // Set initial scroll position to show first card at container position
      // Since we have left padding, we don't need to scroll initially
      
      // Also check on resize
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        setContainerPadding(calculateContainerPadding());
        setTimeout(checkScrollPosition, 100);
      };
      
      window.addEventListener('resize', handleResize);

      return () => {
        slider.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMobile, blogPosts.length]);

  return (
    <div className="relative w-full py-20">
      {/* Heading section with integrated style - matching container positioning */}
      <div className="mb-8 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-black leading-relaxed text-lg md:text-3xl max-w-5xl">
          <h2 className="font-bold inline text-xl md:text-5xl">
            Latest Blogs
          </h2>
          <p className="inline">. Discover our collection of insightful articles covering web development, design principles, and the latest industry trends.</p>
        </div>  
      </div>

      {/* Navigation section with counter and arrows - matching container positioning */}
      <div className="flex justify-between items-center mb-4 md:mb-6 max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Card counter */}
        <div className="text-black text-lg md:text-xl font-medium">
          {currentSlide}/{blogPosts.length}
        </div>
        
        {/* Navigation arrows - only show on desktop */}
        <div className="hidden md:flex gap-4">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
              canScrollLeft 
                ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <svg className={`w-6 h-6 ${canScrollLeft ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-[0.5px] border-zinc-900 ${
              canScrollRight 
                ? 'bg-zinc-700/60 hover:bg-zinc-900' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <svg className={`w-6 h-6 ${canScrollRight ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider Container - allows scrolling left and right for perfect alignment */}
      <div 
        ref={sliderRef}
        className="flex overflow-x-auto overflow-y-visible snap-x snap-mandatory pb-4 scroll-smooth scrollbar-hide items-stretch pr-0"
        style={{ 
          gap: '24px', // Increased gap for larger cards
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: containerPadding, // Left space to scroll into
        }}
      >
        {blogPosts.map((post, index) => (
          <div 
            key={`${post.title}-${index}`}
            className="flex-shrink-0 snap-center flex items-stretch"
            style={{ 
              width: isMobile ? '340px' : '540px', // Mobile-friendly size for cards
              minWidth: isMobile ? '340px' : '540px',
              paddingTop: '10px',
              paddingBottom: '10px'
            }}
          >
            <BlogSlide
              title={post.title}
              description={post.description}
              link={post.link}
              colorTheme={randomColors[index]} // Use deterministic colors
            />
          </div>
        ))}
        
        {/* THE END text at the end */}
        <div 
          className="flex-shrink-0 flex items-center justify-center snap-center"
          style={{ 
            width: isMobile ? '280px' : 'calc(50vw - 170px)',
            paddingLeft: '20px',
            paddingRight: '20px'
          }}
        >
          <h2 
            className="font-bold text-black text-center"
            style={{ 
              fontSize: isMobile ? '2.5rem' : 'clamp(3rem, 8vw, 6rem)',
              letterSpacing: '0.05em'
            }}
          >
            THE END
          </h2>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
