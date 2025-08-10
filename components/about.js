"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const videoContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  // Initialize with some default colors for immediate visibility
  const [edgeColors, setEdgeColors] = useState({
    top: Array(8).fill({ r: 100, g: 100, b: 255, a: 0.8 }),
    right: Array(8).fill({ r: 255, g: 100, b: 100, a: 0.8 }),
    bottom: Array(8).fill({ r: 100, g: 255, b: 100, a: 0.8 }),
    left: Array(8).fill({ r: 255, g: 200, b: 100, a: 0.8 })
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Advanced color extraction effect
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set canvas size
    canvas.width = 160; // Larger for better sampling
    canvas.height = 90; // 16:9 aspect ratio
    
    let animationId;
    
    // Ensure video is playing
    const playVideo = async () => {
      try {
        await video.play();
      } catch (e) {
        // Video might already be playing or autoplay might be blocked
        console.log('Video play attempt:', e);
      }
    };
    
    const extractEdgeColors = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Number of sample points per edge
        const samplesPerEdge = 8;
        const sampleSize = 5; // Size of area to sample
        const edgeOffset = 2; // How far from edge to sample
        
        // Helper function to get average color from a region with saturation boost
        const getAverageColor = (x, y, width, height) => {
          try {
            const imageData = ctx.getImageData(x, y, width, height);
            const data = imageData.data;
            let r = 0, g = 0, b = 0;
            let count = 0;
            
            for (let i = 0; i < data.length; i += 4) {
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              count++;
            }
            
            if (count === 0) return { r: 0, g: 0, b: 0, a: 0 };
            
            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);
            
            // Boost saturation and brightness for more vivid colors
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const delta = max - min;
            
            if (delta > 0) {
              const saturationBoost = 1.6;
              const brightnessBoost = 1.2;
              const mid = (max + min) / 2;
              r = Math.min(255, Math.floor((mid + (r - mid) * saturationBoost) * brightnessBoost));
              g = Math.min(255, Math.floor((mid + (g - mid) * saturationBoost) * brightnessBoost));
              b = Math.min(255, Math.floor((mid + (b - mid) * saturationBoost) * brightnessBoost));
            }
            
            return { r, g, b, a: 0.8 };
          } catch (e) {
            return { r: 0, g: 0, b: 0, a: 0 };
          }
        };
        
        // Sample colors along each edge
        const colors = {
          top: [],
          right: [],
          bottom: [],
          left: []
        };
        
        // Top edge
        for (let i = 0; i < samplesPerEdge; i++) {
          const x = Math.floor((canvas.width / samplesPerEdge) * i);
          colors.top.push(getAverageColor(x, edgeOffset, sampleSize, sampleSize));
        }
        
        // Right edge
        for (let i = 0; i < samplesPerEdge; i++) {
          const y = Math.floor((canvas.height / samplesPerEdge) * i);
          colors.right.push(getAverageColor(canvas.width - sampleSize - edgeOffset, y, sampleSize, sampleSize));
        }
        
        // Bottom edge
        for (let i = 0; i < samplesPerEdge; i++) {
          const x = Math.floor((canvas.width / samplesPerEdge) * i);
          colors.bottom.push(getAverageColor(x, canvas.height - sampleSize - edgeOffset, sampleSize, sampleSize));
        }
        
        // Left edge
        for (let i = 0; i < samplesPerEdge; i++) {
          const y = Math.floor((canvas.height / samplesPerEdge) * i);
          colors.left.push(getAverageColor(edgeOffset, y, sampleSize, sampleSize));
        }
        
        setEdgeColors(colors);
        
        // Debug: Log to see if colors are being extracted
        console.log('Extracted colors:', colors);
      }
      
      animationId = requestAnimationFrame(extractEdgeColors);
    };
    
    // Start extraction when video is ready
    const startExtraction = () => {
      playVideo();
      // Give a small delay to ensure video is rendering
      setTimeout(() => {
        extractEdgeColors();
      }, 100);
    };
    
    // Start extraction after a delay to ensure DOM is ready
    setTimeout(() => {
      // Check if video is already loaded
      if (video.readyState >= 3) {
        startExtraction();
      } else {
        video.addEventListener('loadeddata', startExtraction);
      }
    }, 500);
    
    // Also try to start on other video events
    video.addEventListener('loadedmetadata', startExtraction);
    video.addEventListener('canplay', startExtraction);
    video.addEventListener('play', startExtraction);
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      video.removeEventListener('loadeddata', startExtraction);
      video.removeEventListener('loadedmetadata', startExtraction);
      video.removeEventListener('canplay', startExtraction);
      video.removeEventListener('play', startExtraction);
    };
  }, []);

  // Create gradient strings from edge colors
  const createGradient = (colors, direction) => {
    if (!colors.length) return 'transparent';
    
    const gradientStops = colors.map((color, index) => {
      const position = (index / (colors.length - 1)) * 100;
      return `rgba(${color.r},${color.g},${color.b},${color.a}) ${position}%`;
    }).join(', ');
    
    const gradientDirection = {
      top: 'to right',
      bottom: 'to right',
      left: 'to bottom',
      right: 'to bottom'
    };
    
    return `linear-gradient(${gradientDirection[direction]}, ${gradientStops})`;
  };

  // GSAP animation for the video
  useEffect(() => {
    if (!videoContainerRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Calculate initial position (in hero section)
      const heroHeight = window.innerHeight;
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const initialY = -sectionTop + heroHeight * 0.15; // Position in hero area (10% from top - well above the hero text)
      
      // Get video dimensions - 40% width on desktop, full width on mobile
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768; // Tailwind's md breakpoint
      const padding = 16; // px-4 = 1rem = 16px
      const videoWidth = isMobile ? screenWidth - (padding * 2) : screenWidth * 0.4; // Full width minus padding on mobile, 40% on desktop
      const maxTravel = isMobile ? 0 : (screenWidth - videoWidth) / 2 - padding; // No horizontal movement on mobile
      
      // Store mouse position
      let currentMouseX = 0;
      let currentMouseY = 0;
      let actualMouseX = 0; // Store actual mouse position for scroll-back
      let actualMouseY = 0; // Store actual mouse Y position
      let targetMouseX = 0; // Target position for smooth animation
      let targetMouseY = 0;
      
      // Set initial position - center of hero section with high z-index
      gsap.set(videoContainerRef.current, {
        position: 'absolute',
        top: 0,
        left: '50%',
        x: -videoWidth / 2, // Center using x instead of xPercent
        y: initialY,
        scale: 1,
        zIndex: 200, // Very high z-index to be above hero text
      });

      // Mouse tracking effect with smooth movement
      const handleMouseMove = (e) => {
        if (!videoContainerRef.current || isMobile) return; // Don't track mouse on mobile
        
        // Always store actual mouse position
        actualMouseX = e.clientX;
        actualMouseY = e.clientY;
        
        // Calculate scroll progress
        const scrollY = window.scrollY;
        const scrollProgress = Math.min(scrollY / (sectionTop * 0.3), 1);
        
        // Gradually limit movement based on scroll progress
        // At start: full movement, at end: no movement
        const movementLimit = 1 - scrollProgress;
        
        // Map mouse position to travel range
        const mouseRatio = (e.clientX / screenWidth) - 0.5; // -0.5 to 0.5
        targetMouseX = mouseRatio * maxTravel * 2 * movementLimit; // Full side-to-side with gradual limiting
        targetMouseY = (e.clientY - window.innerHeight / 2) * 0.05 * movementLimit; // Subtle vertical movement
        
        // Clamp to max travel distance
        targetMouseX = Math.max(-maxTravel * movementLimit, Math.min(maxTravel * movementLimit, targetMouseX));
        
        // Update current position for use in scroll animation
        currentMouseX = targetMouseX;
        currentMouseY = targetMouseY;
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Continuous animation loop for smooth mouse following
      let animationFrame;
      const animateVideo = () => {
        if (!videoContainerRef.current || isMobile) return; // Don't animate on mobile
        
        const scrollY = window.scrollY;
        const scrollProgress = Math.min(scrollY / (sectionTop * 0.3), 1);
        
        if (scrollProgress === 0) { // Only animate mouse movement when not scrolling
          gsap.to(videoContainerRef.current, {
            x: -videoWidth / 2 + currentMouseX,
            y: initialY + currentMouseY,
            duration: 1.5, // Much slower, smoother movement
            ease: "power2.out"
          });
        }
        
        animationFrame = requestAnimationFrame(animateVideo);
      };
      if (!isMobile) animateVideo(); // Only start animation on desktop

      // Create scroll animation - smooth transition
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: () => `+=${sectionTop * 0.3}`, // Short distance for quick animation
        scrub: 1, // Smoother scrub value
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Calculate target position - left side on desktop, centered on mobile
          const startX = -videoWidth / 2 + currentMouseX; // Current position (centered + mouse offset)
          const targetX = isMobile ? -videoWidth / 2 : -screenWidth * 0.35 - videoWidth / 2; // Stay centered on mobile, left side on desktop
          const targetY = isMobile ? 20 : 50; // Higher position on mobile
          
          // Interpolate between start and target based on progress
          const currentX = startX + (targetX - startX) * progress;
          const currentY = (initialY + currentMouseY) + (targetY - (initialY + currentMouseY)) * progress;
          const scale = isMobile ? 1 : 1 + progress * 0.5; // No scaling on mobile
          
          // Adjust z-index during animation
          const zIndex = progress > 0.5 ? 30 : 200; // Lower z-index when in About section
          
          gsap.to(videoContainerRef.current, {
            x: currentX,
            y: currentY,
            scale: scale,
            zIndex: zIndex,
            duration: 0,
            overwrite: true
          });
        },
        onLeaveBack: () => {
          // Reset z-index when scrolling back
          gsap.set(videoContainerRef.current, {
            zIndex: 200
          });
          
          // Position video based on current mouse position (no movement on mobile)
          const mouseRatio = (actualMouseX / screenWidth) - 0.5;
          const targetX = isMobile ? 0 : mouseRatio * maxTravel * 2;
          const verticalOffset = isMobile ? 0 : ((actualMouseY - window.innerHeight / 2) * 0.05);
          
          gsap.to(videoContainerRef.current, {
            x: -videoWidth / 2 + Math.max(-maxTravel, Math.min(maxTravel, targetX)),
            y: initialY + verticalOffset,
            scale: 1,
            duration: 0.8, // Smoother transition
            ease: "power2.out",
            overwrite: true
          });
        }
      });
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    });

    return () => ctx.revert();
  }, []);

  // Handle window resize to update mobile/desktop behavior
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768;
      const padding = 16;
      const videoWidth = isMobile ? screenWidth - (padding * 2) : screenWidth * 0.4;
      
      // Reset video position based on new dimensions
      if (videoContainerRef.current) {
        gsap.set(videoContainerRef.current, {
          x: -videoWidth / 2,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-neutral-950 mx-auto px-4 md:px-8 lg:px-16 py-20 md:py-50 relative z-20 overflow-visible" style={{ isolation: 'isolate' }}>
      {/* Hidden canvas for color extraction */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Parallax Video - positioned absolutely within this section */}
      <div 
        ref={videoContainerRef}
        className="w-[calc(100vw-2rem)] md:w-[40vw] h-[calc(56.25vw-1.125rem)] md:h-[22.5vw] rounded-lg will-change-transform"
        style={{
          aspectRatio: '16/9',
          transformOrigin: 'center center',
          pointerEvents: 'none' // Prevent video from blocking interactions
        }}
      >
        {/* Video container with dynamic edge shadows */}
        <div className="w-full h-full relative">
          {/* Shadow elements for each edge with corner overlap */}
          {/* Top shadow */}
          <div 
            className="absolute -top-10 -left-2 -right-2 h-12 opacity-80"
            style={{
              background: createGradient(edgeColors.top, 'top'),
              filter: 'blur(25px)',
              transform: 'scaleY(1.5)',
              transition: 'background 0.5s ease-out',
              borderRadius: '50%'
            }}
          />
          
          {/* Right shadow */}
          <div 
            className="absolute -top-2 -right-10 -bottom-2 w-12 opacity-80"
            style={{
              background: createGradient(edgeColors.right, 'right'),
              filter: 'blur(25px)',
              transform: 'scaleX(1.5)',
              transition: 'background 0.5s ease-out',
              borderRadius: '50%'
            }}
          />
          
          {/* Bottom shadow */}
          <div 
            className="absolute -bottom-10 -left-2 -right-2 h-12 opacity-80"
            style={{
              background: createGradient(edgeColors.bottom, 'bottom'),
              filter: 'blur(25px)',
              transform: 'scaleY(1.5)',
              transition: 'background 0.5s ease-out',
              borderRadius: '50%'
            }}
          />
          
          {/* Left shadow */}
          <div 
            className="absolute -top-2 -left-10 -bottom-2 w-12 opacity-80"
            style={{
              background: createGradient(edgeColors.left, 'left'),
              filter: 'blur(25px)',
              transform: 'scaleX(1.5)',
              transition: 'background 0.5s ease-out',
              borderRadius: '50%'
            }}
          />
          
          {/* Additional ambient glow layers - continuous blend */}
          <div 
            className="absolute -inset-16 opacity-50"
            style={{
              background: `
                conic-gradient(
                  from 0deg at 50% 50%,
                  rgba(${edgeColors.top[0]?.r || 0},${edgeColors.top[0]?.g || 0},${edgeColors.top[0]?.b || 0},0.6),
                  rgba(${edgeColors.right[0]?.r || 0},${edgeColors.right[0]?.g || 0},${edgeColors.right[0]?.b || 0},0.6),
                  rgba(${edgeColors.bottom[7]?.r || 0},${edgeColors.bottom[7]?.g || 0},${edgeColors.bottom[7]?.b || 0},0.6),
                  rgba(${edgeColors.left[7]?.r || 0},${edgeColors.left[7]?.g || 0},${edgeColors.left[7]?.b || 0},0.6),
                  rgba(${edgeColors.top[0]?.r || 0},${edgeColors.top[0]?.g || 0},${edgeColors.top[0]?.b || 0},0.6)
                )
              `,
              filter: 'blur(35px)',
              transition: 'background 0.5s ease-out'
            }}
          />
          
          {/* Overlay blend layer for smoother corners */}
          <div 
            className="absolute -inset-10 opacity-40"
            style={{
              background: `
                radial-gradient(ellipse at center, transparent 35%, 
                  rgba(${Math.floor((edgeColors.top[3]?.r + edgeColors.bottom[3]?.r + edgeColors.left[3]?.r + edgeColors.right[3]?.r) / 4 || 0)},
                       ${Math.floor((edgeColors.top[3]?.g + edgeColors.bottom[3]?.g + edgeColors.left[3]?.g + edgeColors.right[3]?.g) / 4 || 0)},
                       ${Math.floor((edgeColors.top[3]?.b + edgeColors.bottom[3]?.b + edgeColors.left[3]?.b + edgeColors.right[3]?.b) / 4 || 0)},0.5) 65%)
              `,
              filter: 'blur(20px)',
              transition: 'background 0.5s ease-out'
            }}
          />
          
          {/* Video element */}
          <video 
            ref={videoRef}
            src="/video/hero-video-compressed.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover rounded-lg relative z-10" 
          />
        </div>
      </div>
      
      <div className="relative z-40"> {/* Text content above video */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Top section - Heading (30% width on large screens) */}
          <div className="relative w-full lg:w-[30%] flex-shrink-0">
            <div>
              <h2 className="text-[clamp(3rem,5vw,10rem)] font-bold text-white bg-black/20 w-fit px-3 backdrop-blur-sm">
                About Us
              </h2>
            </div>
          </div>

          {/* Bottom section - Description (70% width on large screens) */}
          <div className={`w-full lg:w-[70%] transition-all duration-1000 delay-500 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="space-y-6 bg-black/20 w-fit backdrop-blur-sm px-4 py-6">
              <p className="text-zinc-100 text-3xl leading-relaxed">
                From customer service chatbots to automated marketing through implementing cutting-edge AI solutions that work 24/7 to grow your business while you focus on what matters most.
              </p>
              <div>
                <div className="flex flex-row gap-2 items-center mb-2">

                <div className=" rounded-full h-[45px] w-[45px] bg-white"></div>
                <h3 className="text-zinc-300 text-2xl font-bold">Our Mission</h3>
                </div>

                <p className="text-zinc-300 text-lg leading-relaxed">
                  To provide cutting-edge AI solutions that help businesses grow and succeed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
