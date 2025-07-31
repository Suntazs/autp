"use client";

import { useState, useEffect } from "react";

export default function ServicesListSection() {
  const [showServices, setShowServices] = useState([false, false, false, false]);
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      title: "Web Applications",
      description: "Custom web applications built with modern frameworks and cutting-edge technologies for seamless user experiences and robust functionality.",
      alignment: "left" // Text left
    },
    {
      title: "Website Development", 
      description: "Professional websites designed to captivate your audience and drive business growth with responsive design and optimized performance.",
      alignment: "right" // Text right
    },
    {
      title: "SaaS Solutions",
      description: "Scalable Software as a Service platforms designed to streamline operations and provide exceptional value to your customers.",
      alignment: "left" // Text left
    },
    {
      title: "E-commerce Platforms",
      description: "Complete e-commerce solutions that transform your products into profitable online experiences with secure payments and intuitive shopping flows.",
      alignment: "right" // Text right
    }
  ];

  // Stagger the reveal animations
  useEffect(() => {
    services.forEach((_, index) => {
      setTimeout(() => {
        setShowServices(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 200 + 500); // Start after 500ms, then 200ms intervals
    });
  }, []);

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Services List */}
      <div className="space-y-24 md:space-y-32 lg:space-y-40 xl:space-y-48">
        {services.map((service, index) => (
          <div key={index} className="w-full">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">
              {service.alignment === "left" ? (
                // Text on left
                <div 
                  className={`max-w-5xl transition-all duration-1000 ease-out cursor-pointer ${
                    showServices[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="text-black leading-relaxed text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                    <div className="flex items-start flex-wrap">
                      <h3 className={`font-bold inline text-2xl md:text-3xl lg:text-4xl xl:text-5xl transition-all duration-300 ${
                        hoveredService === index ? 'underline decoration-2 underline-offset-4' : ''
                      }`}>
                        {service.title}
                      </h3>
                      
                      <span className="inline">. </span>
                      
                      {/* Arrow that appears on hover */}
                      <span 
                        className={`inline-block transition-all duration-500 ease-out ${
                          hoveredService === index 
                            ? 'opacity-100 translate-x-0 w-8 md:w-10 lg:w-12' 
                            : 'opacity-0 -translate-x-4 w-0'
                        }`}
                      >
                        <svg 
                          className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 mx-1 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      
                      <span className={`inline transition-all duration-500 ease-out ${
                        hoveredService === index ? 'ml-2' : 'ml-0'
                      }`}>
                        {service.description}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Text on right
                <div 
                  className={`max-w-5xl ml-auto text-right transition-all duration-1000 ease-out cursor-pointer ${
                    showServices[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="text-black leading-relaxed text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                    <div className="flex items-start flex-wrap justify-end">
                      <span className={`inline transition-all duration-500 ease-out order-3 ${
                        hoveredService === index ? 'mr-2' : 'mr-0'
                      }`}>
                        {service.description}
                      </span>
                      
                      {/* Arrow that appears on hover */}
                      <span 
                        className={`inline-block transition-all duration-500 ease-out order-2 ${
                          hoveredService === index 
                            ? 'opacity-100 translate-x-0 w-8 md:w-10 lg:w-12' 
                            : 'opacity-0 translate-x-4 w-0'
                        }`}
                      >
                        <svg 
                          className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 mx-1 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      
                      <div className="order-1">
                        <h3 className={`font-bold inline text-2xl md:text-3xl lg:text-4xl xl:text-5xl transition-all duration-300 ${
                          hoveredService === index ? 'underline decoration-2 underline-offset-4' : ''
                        }`}>
                          {service.title}
                        </h3>
                        <span className="inline">. </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 