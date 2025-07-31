"use client";

import { useState, useEffect } from "react";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 mb-34   ">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Heading */}
          <div className="relative">
            <div className={`transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h2 
                className="font-bold leading-none"
                style={{
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  fontFamily: "AnthroTrial, Arial, sans-serif"
                }}
              >
                <span className="font-bold text-black">Who we are </span>
                <span className="font-light text-gray-400">, What we do , Why</span>
                <span className="font-bold text-black"> us ?</span>
              </h2>
            </div>
          </div>

          {/* Right side - Description */}
          <div className={`transition-all duration-1000 delay-500 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="space-y-6">
              
              <p className="text-gray-600 text-lg leading-relaxed" style={{ fontFamily: "AnthroTrial, Arial, sans-serif" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam elementum dictum ipsum at tristique. Maecenas volutpat suscipit efficitur. Pellentesque nulla odio, pretium sit amet tincidunt et, volutpat non sapien. Vestibulum sagittis, nulla dictum dignissim dictum, sapien odio hendrerit est, a malesuada metus urna ut libero. Etiam fringilla ornare rhoncus. Proin. 
               </p>
              
              <p className="text-gray-600 text-lg leading-relaxed" style={{ fontFamily: "AnthroTrial, Arial, sans-serif" }}>
                From customer service chatbots to automated marketing campaigns, we'll guide you through implementing cutting-edge AI solutions that work 24/7 to grow your business while you focus on what matters most.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
