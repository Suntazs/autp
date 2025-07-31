"use client";

import { useState, useEffect } from "react";

export default function TestimonialSection({ 
  testimonialText, 
  highlightedText = "",
  companyLogo, 
  companyName, 
  reviewerPicture, 
  reviewerName, 
  reviewerRole,
  sectionId = "testimonial-section" 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById(sectionId);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [sectionId]);

  // Split testimonial text to highlight specific portion if provided
  const renderTestimonialText = () => {
    if (!highlightedText) {
      return testimonialText;
    }
    
    const parts = testimonialText.split(highlightedText);
    return (
      <>
        {parts[0]}
        <span 
          className="relative inline-block"
          style={{ backgroundColor: 'transparent' }}
        >
          <span className="relative z-10">{highlightedText}</span>
          <span 
            className={`absolute inset-0 transition-all duration-1000 delay-700 ease-out ${isVisible ? 'scale-x-100' : 'scale-x-0'}`}
            style={{ 
              backgroundColor: '#FADCA2',
              transformOrigin: 'left center',
              zIndex: -1
            }}
          ></span>
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section 
      id={sectionId}
      className="w-full max-w-[1600px] mx-auto px-0 md:px-8 lg:px-16 py-20"
    >
      <div className="relative bg-gray-50 p-12 px-4 md:p-16 lg:p-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#adff00]/10 to-transparent"></div>
        
        <div className="relative z-10">
          <div className={`transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Large quotation mark */}
            <div className="mb-8">
              <svg 
                width="80" 
                height="60" 
                viewBox="0 0 80 60" 
                fill="none" 
                className="text-[#00D4AA]"
              >
                <path 
                  d="M0 60V36C0 16.16 16.16 0 36 0V12C22.76 12 12 22.76 12 36V44H36V60H0ZM44 60V36C44 16.16 60.16 0 80 0V12C66.76 12 56 22.76 56 36V44H80V60H44Z" 
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Testimonial text */}
            <blockquote 
              className={`text-black text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-12 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ fontFamily: "AnthroTrial, Arial, sans-serif" }}
            >
              {renderTestimonialText()}
            </blockquote>

            {/* Company and person info */}
            <div className={`transition-all duration-1000 delay-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Company logo/name */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-lg font-medium">
                  {companyLogo ? (
                    <img 
                      src={companyLogo} 
                      alt={`${companyName} logo`}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                      <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  )}
                  {companyName}
                </div>
              </div>

              {/* Person info with image */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden flex items-center justify-center">
                    {reviewerPicture ? (
                      <img 
                        src={reviewerPicture} 
                        alt={reviewerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl font-semibold">
                        {reviewerName ? reviewerName.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-black font-semibold text-lg mb-1" style={{ fontFamily: "AnthroTrial, Arial, sans-serif" }}>
                    {reviewerName}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {reviewerRole}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 