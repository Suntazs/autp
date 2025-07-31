"use client";

import { useState } from "react";
import Image from "next/image";

export default function FeaturesSection() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const features = [
    {
      id: 1,
      description: "Our Dev Mode MCP server lets you bring Figma Design context directly into your agentic coding tools."
    },
    {
      id: 2,
      description: "Create and deploy websites seamlessly with our intuitive platform that works for both developers and designers."
    },
    {
      id: 3,
      description: "Leverage artificial intelligence to accelerate your development workflow and bring ideas to life quickly."
    }
  ];

  return (
    <section className="w-full bg-[#CB9FD2] relative">
      <div className="w-full max-w-[1600px] mx-auto">
        
        {/* Content Container - with padding but not affecting image */}
        <div className="px-4 md:px-8 lg:px-16 py-8 md:py-16 lg:pr-[400px] xl:pr-[500px]">
      {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl max-w-2xl font-bold text-black leading-tight mb-6 md:mb-8">
        Ship products, any way you want
      </h2>

      {/* Features List */}
          <div className="space-y-4 md:space-y-6 max-w-2xl">
        {features.map((feature) => (
          <div
            key={feature.id}
                className="group relative cursor-pointer py-2 md:py-4"
            onMouseEnter={() => setHoveredItem(feature.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
                {/* Hover Arrow - hidden on mobile */}
            <div 
                  className={`hidden md:block absolute left-0 top-6 transform -translate-x-12 transition-all duration-300 ease-out ${
                hoveredItem === feature.id 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-2'
              }`}
            >
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                className="text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </div>

            {/* Content Container */}
            <div 
              className={`transition-transform duration-300 ease-out px-2 ${
                    hoveredItem === feature.id ? 'md:translate-x-8' : 'translate-x-0'
              }`}
            >
              {/* Description */}
                  <p className="text-black text-base sm:text-lg md:text-xl leading-relaxed py-2">
                {feature.description}
              </p>
            </div>

            {/* Separator Line */}
            {feature.id !== features.length && (
                  <hr className="mt-4 md:mt-8 border-black" />
            )}
          </div>
        ))}
          </div>
      </div>

        {/* Image Container - touches bottom and right, padding only on left */}
        <div className="mx-4 mt-8 md:mx-0 md:mt-0 md:absolute md:bottom-0 md:right-0 w-auto md:w-[400px] lg:w-[500px] xl:w-[700px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[450px]">
          <div className="w-full h-full bg-gray-200 rounded-tl-3xl overflow-hidden md:pl-8">
        <Image
          src="/img/an-elderly-man-with-gray-hair-and-wearing-glasses-.png"
          alt="Elderly man typing"
              width={700}
              height={450}
          className="w-full h-full object-cover"
              priority
        />
          </div>
      </div>
      </div>
    </section>
  );
} 