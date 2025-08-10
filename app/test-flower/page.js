"use client";

import RotatingFlower from "@/components/ui/RotatingFlower";
import XScroll from "@/components/XScroll";

export default function TestFlowerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* First section to push flowers below the fold */}
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Scroll down to see the flowers pop in!</h1>
      </div>
      
      {/* Second section with flowers */}
      <div className="min-h-screen relative flex items-center justify-center">
        <h2 className="text-2xl">Watch the flowers appear!</h2>
        
        {/* Test flowers with different delays */}
        <RotatingFlower 
          className="absolute top-20 left-20 w-32 h-32" 
          colorTheme={1} 
          delay={0} 
        />
        
        <RotatingFlower 
          className="absolute top-20 right-20 w-32 h-32" 
          colorTheme={2} 
          delay={200} 
        />
        
        <RotatingFlower 
          className="absolute bottom-20 left-20 w-32 h-32" 
          colorTheme={3} 
          delay={400} 
        />
        
        <RotatingFlower 
          className="absolute bottom-20 right-20 w-32 h-32" 
          colorTheme={4} 
          delay={600} 
        />
        
        <RotatingFlower 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40" 
          colorTheme={5} 
          delay={800} 
        />
      </div>

      {/* Pre-horizontal scroll section */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Keep scrolling to explore what we offer</p>
          <div className="mt-8 animate-bounce">
            <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* XScroll Component - Horizontal Scroll Section */}
      <XScroll />
      
      {/* Post-horizontal scroll section */}
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">Thank You!</h2>
          <p className="text-xl text-gray-600">That was our services showcase</p>
        </div>
      </div>

      {/* Extra content for scrolling */}
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800">Continue exploring...</h2>
      </div>
    </div>
  );
} 