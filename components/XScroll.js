'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(ScrollTrigger);

export default function XScroll() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const sliderRef = useRef(null);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const savedScrollPosition = useRef(null);

  // Sample portfolio items for each service
  const portfolioItems = {
    0: [ // E-commerce
      { 
        title: "Fashion Store", 
        description: "Modern fashion e-commerce with cart.", 
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop" 
      },
      { 
        title: "Electronics Shop", 
        description: "Tech store with advanced filtering.", 
        image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&h=600&fit=crop" 
      },
      { 
        title: "Jewelry Store", 
        description: "Luxury jewelry showcase.", 
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop" 
      },
      { 
        title: "Food Market", 
        description: "Online food delivery platform.", 
        image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&h=600&fit=crop" 
      },
      { 
        title: "Book Store", 
        description: "Digital bookstore with previews.", 
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop" 
      },
      { 
        title: "Shoe Store", 
        description: "Athletic footwear marketplace.", 
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop" 
      }
    ],
    1: [ // Corporate
      { 
        title: "Law Firm", 
        description: "Professional legal website.", 
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop" 
      },
      { 
        title: "Consulting", 
        description: "Business consulting platform.", 
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop" 
      },
      { 
        title: "Real Estate", 
        description: "Property showcase website.", 
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop" 
      },
      { 
        title: "Medical Practice", 
        description: "Healthcare appointment system.", 
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop" 
      },
      { 
        title: "Marketing Agency", 
        description: "Creative agency portfolio.", 
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop" 
      },
      { 
        title: "Finance Corp", 
        description: "Banking and investment services.", 
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop" 
      }
    ],
    2: [ // Web Apps
      { 
        title: "CRM System", 
        description: "Customer management platform.", 
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop" 
      },
      { 
        title: "Task Manager", 
        description: "Project collaboration tool.", 
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop" 
      },
      { 
        title: "Learning Platform", 
        description: "Educational course system.", 
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop" 
      },
      { 
        title: "Social Network", 
        description: "Community platform.", 
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
      },
      { 
        title: "Analytics Tool", 
        description: "Data visualization dashboard.", 
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" 
      },
      { 
        title: "Chat Application", 
        description: "Real-time messaging platform.", 
        image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop" 
      }
    ]
  };

  // Get all portfolio items for the infinite scroll
  const getPortfolioItemsForPanel = () => {
    const items = portfolioItems[currentPanel] || portfolioItems[0];
    // Create infinite array by repeating items multiple times
    // We need at least 5 sets for smooth infinite scroll
    return [...items, ...items, ...items, ...items, ...items];
  };

  // Get the actual number of unique items
  const getUniqueItemCount = () => {
    const items = portfolioItems[currentPanel] || portfolioItems[0];
    return items.length;
  };

  // Check slider scroll position and update current slide
  const checkSliderScrollPosition = () => {
    const slider = sliderRef.current;
    if (slider) {
      // Calculate current slide based on scroll position
      const slideWidth = window.innerWidth < 768 ? 380 : 530;
      const scrollPosition = slider.scrollLeft;
      const currentSlideIndex = Math.round(scrollPosition / slideWidth);
      
      // Get the actual slide number (0-5) using modulo
      const uniqueItemCount = getUniqueItemCount();
      const actualSlide = currentSlideIndex % uniqueItemCount;
      
      console.log('Scroll debug:', {
        scrollPosition,
        currentSlideIndex,
        actualSlide,
        uniqueItemCount,
        totalItems: getPortfolioItemsForPanel().length
      });
      
      setCurrentSlide(actualSlide);
    }
  };

  // Slider navigation - always enabled for infinite scroll
  const scrollSliderLeft = () => {
    console.log('Left button clicked');
    const slider = sliderRef.current;
    if (slider) {
      const slideWidth = window.innerWidth < 768 ? 380 : 530;
      const uniqueItemCount = getUniqueItemCount();
      const setWidth = slideWidth * uniqueItemCount;
      
      console.log('Left scroll debug:', {
        scrollLeft: slider.scrollLeft,
        slideWidth,
        setWidth
      });
      
      // If we can't scroll anymore to the left, jump forward
      if (slider.scrollLeft - slideWidth <= 10) {
        // Jump forward by 2 sets instantly before scrolling
        slider.scrollLeft += setWidth * 2;
        // Then perform the scroll
        setTimeout(() => {
          slider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        }, 10);
      } else {
        // Normal scroll
        slider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      }
    } else {
      console.log('Slider ref not found');
    }
  };

  const scrollSliderRight = () => {
    console.log('Right button clicked');
    const slider = sliderRef.current;
    if (slider) {
      const slideWidth = window.innerWidth < 768 ? 380 : 530;
      const uniqueItemCount = getUniqueItemCount();
      const setWidth = slideWidth * uniqueItemCount;
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      
      console.log('Right scroll debug:', {
        scrollLeft: slider.scrollLeft,
        maxScroll,
        scrollWidth: slider.scrollWidth,
        clientWidth: slider.clientWidth,
        setWidth
      });
      
      // If we can't scroll anymore to the right, jump back
      if (slider.scrollLeft + slideWidth >= maxScroll - 10) {
        // Jump back by 2 sets instantly before scrolling
        slider.scrollLeft -= setWidth * 2;
        // Then perform the scroll
        setTimeout(() => {
          slider.scrollBy({ left: slideWidth, behavior: 'smooth' });
        }, 10);
      } else {
        // Normal scroll
        slider.scrollBy({ left: slideWidth, behavior: 'smooth' });
      }
    } else {
      console.log('Slider ref not found');
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      
      if (!wrapper || !container) return;

      const panels = gsap.utils.toArray('.service-panel');
      const numPanels = panels.length;
      
      // Use more viewport height for smoother scrolling
      const scrollDistance = numPanels * window.innerHeight * 1.5;
      
      // Create horizontal scroll animation with optimized settings
      const scrollTween = gsap.to(wrapper, {
        x: () => -(numPanels - 1) * window.innerWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          pin: true,
          scrub: 1, // Direct 1:1 scrolling for responsiveness
          snap: {
            snapTo: (progress) => {
              // Custom snap logic for better control
              const panelWidth = 1 / (numPanels - 1);
              const snapIndex = Math.round(progress / panelWidth);
              return snapIndex * panelWidth;
            },
            duration: { min: 0.4, max: 0.8 }, // Gentler, longer duration
            delay: 0, // No cooldown
            ease: "power1.inOut", // Gentler easing
            inertia: false // Disable inertia for more predictable snapping
          },
          onUpdate: (self) => {
            // Update current panel
            const currentPanelIndex = Math.round(self.progress * (numPanels - 1));
            
            // Only update if panel actually changed
            if (currentPanelIndex !== currentPanel) {
              // Save current slider position before changing panels
              if (sliderRef.current) {
                savedScrollPosition.current = sliderRef.current.scrollLeft;
              }
              setCurrentPanel(currentPanelIndex);
            }
          }
        }
      });

      // Add smooth wheel scrolling for better control
      container.addEventListener('wheel', (e) => {
        // Only handle horizontal scrolling when in the pinned section
        if (scrollTween.scrollTrigger.isActive && scrollTween.scrollTrigger.progress > 0 && scrollTween.scrollTrigger.progress < 1) {
          // Prevent default vertical scroll
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
          }
        }
      }, { passive: false });

      // Optimize performance
      ScrollTrigger.config({
        limitCallbacks: true, // Limit callback frequency
        syncInterval: 40 // Sync scroll position less frequently
      });

      // Handle resize
      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      // Debounce resize for better performance
      let resizeTimer;
      const debouncedResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
      };

      window.addEventListener('resize', debouncedResize);

      return () => {
        window.removeEventListener('resize', debouncedResize);
        clearTimeout(resizeTimer);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Set up slider scroll listener
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      let isScrolling = false;
      
      const handleScroll = () => {
        checkSliderScrollPosition();
        
        // Handle infinite scroll for manual dragging
        if (!isScrolling) {
          isScrolling = true;
          
          setTimeout(() => {
            const slideWidth = window.innerWidth < 768 ? 380 : 530;
            const uniqueItemCount = getUniqueItemCount();
            const setWidth = slideWidth * uniqueItemCount;
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            
            // Check boundaries and jump if needed
            if (slider.scrollLeft <= 10) {
              slider.scrollLeft += setWidth * 2;
            } else if (slider.scrollLeft >= maxScroll - 10) {
              slider.scrollLeft -= setWidth * 2;
            }
            
            isScrolling = false;
          }, 50);
        }
      };
      
      slider.addEventListener('scroll', handleScroll);
      
      // Always start at the beginning of the third set (shows 1/6)
      const slideWidth = window.innerWidth < 768 ? 380 : 530;
      const uniqueItemCount = getUniqueItemCount();
      slider.scrollLeft = slideWidth * uniqueItemCount * 2; // Start at third set, first item
      
      checkSliderScrollPosition();
      
      return () => {
        slider.removeEventListener('scroll', handleScroll);
      };
    }
  }, [currentPanel]);

  // Reset slider when panel changes  
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      // Small delay to ensure the slider is ready
      setTimeout(() => {
        // Always start at the beginning of the third set (shows 1/6)
        const slideWidth = window.innerWidth < 768 ? 380 : 530;
        const uniqueItemCount = getUniqueItemCount();
        slider.scrollLeft = slideWidth * uniqueItemCount * 2; // Start at third set, first item
        
        // Reset current slide to 0 to show 1/6
        setCurrentSlide(0);
        // Update display
        checkSliderScrollPosition();
      }, 100);
    }
  }, [currentPanel]);

  return (
    <div ref={containerRef} className="c--hs-a relative bg-neutral-950">
      <div ref={wrapperRef} className="c--hs-a__wrapper flex h-screen">
        {/* Service 1 */}
        <div className="service-panel flex-shrink-0 w-screen h-screen relative flex flex-col">
          <div className="z-10 px-4 sm:px-8 pt-22 flex-1">
            <p className="text-white text-md mb-4">01</p>
            <h2 className="text-white text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">E-COMMERCE</h2>
            <div className='flex items-center gap-2 mb-4 flex-wrap max-w-5xl'>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Shopify</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Next.js</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>WooCommerce</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>BigCommerce</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Magento</div> 
            </div>
            <p className="text-white text-md max-w-6xl">
              Full-featured online stores with payment processing, inventory management, and customer accounts. Perfect for businesses looking to sell products online with professional storefronts.
            </p>
          </div>
        </div>

        {/* Service 2 */}
        <div className="service-panel flex-shrink-0 w-screen h-screen relative flex flex-col">
          <div className="z-10 px-4 sm:px-8 pt-22 flex-1">
            <p className="text-white text-md mb-4">02</p>
            <h2 className="text-white text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">CORPORATE</h2>
            <div className='flex items-center gap-2 mb-4 flex-wrap max-w-5xl'>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>WordPress</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Webflow</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>React</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Framer</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Next.js</div> 
            </div>
            <p className="text-white text-md max-w-6xl">
              Professional corporate websites that establish credibility and drive business growth. Showcase your services, team, and company values with a modern design.
            </p>
          </div>
        </div>

        {/* Service 3 */}
        <div className="service-panel flex-shrink-0 w-screen h-screen relative flex flex-col">
          <div className="z-10 px-4 sm:px-8 pt-22 flex-1">
            <p className="text-white text-md mb-4">03</p>
            <h2 className="text-white text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">WEB APPS</h2>
            <div className='flex items-center gap-2 mb-4 flex-wrap max-w-5xl'>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>React</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Vue.js</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Angular</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Node.js</div>
              <div className='bg-neutral-800 px-3 py-2 rounded-md w-fit text-neutral-100'>Django</div> 
            </div>
            <p className="text-white text-md max-w-6xl">
              Complex web applications with advanced functionality and user management systems. Built for businesses that need custom solutions and advanced features.
            </p>
          </div>
        </div>

        {/* Bottom section with navigation and slider - Now outside service panels */}
        <div className="absolute bottom-0 left-0 w-[300vw] z-50 pointer-events-none">
          {/* Navigation Block */}
          <div className="flex">
            {/* Nav for Service 1 */}
            <div className="w-screen px-4 sm:px-8 mb-6 pointer-events-auto">
              <div className="flex justify-between items-center h-10">
                <span className="text-white text-lg font-medium">
                  {currentSlide + 1} / {getUniqueItemCount()}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={scrollSliderLeft}
                    className="rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-white/20 bg-white/10 hover:bg-white/20 cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={scrollSliderRight}
                    className="rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-white/20 bg-white/10 hover:bg-white/20 cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Nav for Service 2 */}
            <div className="w-screen px-4 sm:px-8 mb-6 pointer-events-auto">
              <div className="flex justify-between items-center h-10">
                <span className="text-white text-lg font-medium">
                  {currentSlide + 1} / {getUniqueItemCount()}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={scrollSliderLeft}
                    className="rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-white/20 bg-white/10 hover:bg-white/20 cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={scrollSliderRight}
                    className="rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-white/20 bg-white/10 hover:bg-white/20 cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Nav for Service 3 */}
            <div className="w-screen px-4 sm:px-8 mb-6 pointer-events-auto">
              <div className="flex justify-between items-center h-10">
                <span className="text-white text-lg font-medium">
                  {currentSlide + 1} / {getUniqueItemCount()}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={scrollSliderLeft}
                    className="rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-white/20 bg-white/10 hover:bg-white/20 cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={scrollSliderRight}
                    className="rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 border border-white/20 bg-white/10 hover:bg-white/20 cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Block */}
          <div className="w-full overflow-hidden pb-8 pointer-events-auto">
            <div 
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto snap-none scroll-smooth scrollbar-hide px-4 sm:px-8"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                // Prevent horizontal scroll from affecting this
                overscrollBehaviorX: 'contain',
                touchAction: 'pan-x'
              }}
              onWheel={(e) => {
                // Prevent horizontal scroll from affecting slider
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                  e.stopPropagation();
                }
              }}
            >
              {getPortfolioItemsForPanel().map((item, idx) => (
                <div 
                  key={`${currentPanel}-${idx}`} 
                  className="flex-shrink-0"
                >
                  <div className="overflow-hidden group cursor-pointer">
                    <div className="h-[250px] md:h-[300px] w-[350px] md:w-[500px] overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <h5 className="text-white text-base md:text-lg font-bold mb-1 group-hover:text-white/80 transition-colors">
                        {item.title}
                      </h5>
                      <p className="text-white/60 text-sm group-hover:text-white/50 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
