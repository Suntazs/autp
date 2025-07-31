"use client";

import { forwardRef } from "react";

const AnalyzeSection = forwardRef(({ isSelected, sectionProgress }, ref) => {
  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ${
        isSelected ? "opacity-100" : "opacity-80"
      }`}
    >
      <div className="bg-transparent border border-gray-700/30 backdrop-blur-sm rounded-2xl p-8 mb-8 hover:border-[#adff00]/20 transition-all duration-300">
        <div className="mb-6">
          <span className="text-[#adff00] text-sm font-semibold tracking-wider">
            01
          </span>
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            ANALYZE
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Dive deep into your web project requirements. Analyze user needs, 
            market trends, and technical specifications to create a solid foundation 
            for your development process.
          </p>
        </div>

        {/* Custom Content for Web Development Analysis */}
        <div className="bg-gray-900/20 border border-gray-600/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Analysis Tools */}
            <div className="space-y-4">
              <h3 className="text-[#adff00] font-semibold text-lg mb-3">Analysis Tools</h3>
              <div className="space-y-3">
                {[
                  { name: "User Research", status: "Complete", progress: 100 },
                  { name: "Market Analysis", status: "In Progress", progress: 75 },
                  { name: "Tech Stack Review", status: "Pending", progress: 30 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/20">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.progress === 100 ? 'bg-green-400' : 
                        item.progress > 50 ? 'bg-yellow-400' : 'bg-gray-400'
                      }`} />
                      <span className="text-gray-200 text-sm">{item.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Visual representation */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 border-2 border-[#adff00]/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#adff00]/20 to-transparent rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#adff00]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#adff00] rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AnalyzeSection.displayName = "AnalyzeSection";

export default AnalyzeSection; 