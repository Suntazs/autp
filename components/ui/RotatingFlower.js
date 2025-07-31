"use client";

import { useState, useEffect } from "react";

// Color themes from BlogSlide component
const colorThemes = {
  1: { // green
    background: "#E4FF97",
    accent: "#adff00",
    name: "green"
  },
  2: { // purple
    background: "#CB9FD2", 
    accent: "#8a2be2",
    name: "purple"
  },
  3: { // orange
    background: "#FADCA2",
    accent: "#ffa500", 
    name: "orange"
  },
  4: { // pink
    background: "#FFB7B7",
    accent: "#ff1493",
    name: "pink"
  },
  5: { // blue
    background: "#B7D7FF",
    accent: "#00bfff",
    name: "blue"
  },
  6: { // yellow
    background: "#FFFAB7",
    accent: "#ffff00",
    name: "yellow"
  }
};

const RotatingFlower = ({ 
  className, 
  style, 
  colorTheme = "black", // Can be number 1-6, "random", "black", or color name
  parallax = false, // Enable/disable parallax effect
  rotating = true, // Enable/disable rotation
  fill = true // Enable fill mode (whole flower same color, defaults to black)
}) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Initialize color theme
  useEffect(() => {
    let theme;
    
    if (fill) {
      // Fill mode - default to black, but allow color selection
      if (colorTheme === "random") {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        const randomTheme = colorThemes[randomNumber];
        theme = {
          background: randomTheme.accent, // Use accent color for fill
          accent: randomTheme.accent,
          name: randomTheme.name
        };
      } else if (typeof colorTheme === "number" && colorThemes[colorTheme]) {
        const selectedColorTheme = colorThemes[colorTheme];
        theme = {
          background: selectedColorTheme.accent, // Use accent color for fill
          accent: selectedColorTheme.accent,
          name: selectedColorTheme.name
        };
      } else if (typeof colorTheme === "string" && colorTheme !== "random") {
        const themeEntry = Object.values(colorThemes).find(t => t.name === colorTheme);
        if (themeEntry) {
          theme = {
            background: themeEntry.accent, // Use accent color for fill
            accent: themeEntry.accent,
            name: themeEntry.name
          };
        } else {
          // Default black fill
          theme = {
            background: "#000000",
            accent: "#000000",
            name: "black"
          };
        }
      } else {
        // Default black fill
        theme = {
          background: "#000000",
          accent: "#000000",
          name: "black"
        };
      }
    } else {
      // Normal mode - different colors for center and petals
      if (colorTheme === "random") {
        // Random selection from 1-6
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        theme = colorThemes[randomNumber];
      } else if (typeof colorTheme === "number" && colorThemes[colorTheme]) {
        // Direct number selection
        theme = colorThemes[colorTheme];
      } else if (typeof colorTheme === "string") {
        // Legacy color name support or find by name
        const themeEntry = Object.values(colorThemes).find(t => t.name === colorTheme);
        if (themeEntry) {
          theme = themeEntry;
        } else if (colorTheme === "black") {
          // Default black theme
          theme = {
            background: "#000000",
            accent: "#000000",
            name: "black"
          };
        } else {
          // Fallback to green for other unrecognized strings
          theme = colorThemes[1];
        }
      } else {
        // Fallback to black
        theme = {
          background: "#000000",
          accent: "#000000",
          name: "black"
        };
      }
    }
    
    setSelectedTheme(theme);
  }, [colorTheme, fill]);

  // Mouse tracking for parallax effect
  useEffect(() => {
    if (!parallax) return;

    const handleMouseMove = (e) => {
      const rect = e.currentTarget?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) * 0.02,
          y: (e.clientY - rect.top - rect.height / 2) * 0.02,
        });
      }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
    };

    // Find the parent element to attach mouse events
    const parentElement = document.querySelector(`[data-flower-parallax]`) || document.body;
    
    if (parentElement) {
      parentElement.addEventListener("mousemove", handleMouseMove);
      parentElement.addEventListener("mouseenter", handleMouseEnter);
      parentElement.addEventListener("mouseleave", handleMouseLeave);
      
      return () => {
        parentElement.removeEventListener("mousemove", handleMouseMove);
        parentElement.removeEventListener("mouseenter", handleMouseEnter);
        parentElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [parallax]);

  if (!selectedTheme) return null;

  return (
    <div 
      className={`absolute -z-10 transition-transform duration-300 ease-out ${className}`}
      style={{
        ...style,
        transform: parallax && isHovered 
          ? `translate(${Math.max(-15, Math.min(15, mousePosition.x))}px, ${Math.max(-10, Math.min(10, mousePosition.y))}px)` 
          : style?.transform || 'translate(0, 0)',
      }}
      data-flower-parallax={parallax}
    >
      <div 
        className={`relative w-full h-full ${rotating ? 'animate-spin' : ''}`} 
        style={{ 
          animationDuration: rotating ? '20s' : 'none',
          animationPlayState: rotating ? 'running' : 'paused'
        }}
      >
        {/* Flower made of overlapping circles */}
        <div className="relative w-full h-full">
          {/* Center circle */}
          <div 
            className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-500" 
            style={{ backgroundColor: selectedTheme.accent }}
          />
          
          {/* Petals - 8 circles arranged in a flower pattern */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const radius = 24; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <div
                key={i}
                className="absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-500"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  backgroundColor: selectedTheme.background,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RotatingFlower; 