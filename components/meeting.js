"use client"
import React, { useEffect, useRef, useState } from 'react'
import ButtonDefault from "@/components/ui/buttons/buttondefult";
import BookMeeting from "@/components/layout/popups/book-meeting";

const Meeting = () => {
  const circleRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3 // Trigger when 30% of the element is visible
      }
    );

    if (circleRef.current) {
      observer.observe(circleRef.current);
    }

    return () => {
      if (circleRef.current) {
        observer.unobserve(circleRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full bg-[#F3FFE3] h-[500px] overflow-hidden border-none">
      {/* Background */}
      
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Let&apos;s Connect
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Ready to transform your ideas into reality? Schedule a meeting with our team 
          and discover how we can help bring your vision to life.
        </p>
        <ButtonDefault 
          className="w-fit" 
          onClick={() => setIsBookingOpen(true)}
        >
          Book a Meeting
        </ButtonDefault>
      </div>

      {/* Book Meeting Drawer */}
      <BookMeeting 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  )
}

export default Meeting