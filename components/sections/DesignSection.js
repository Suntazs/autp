"use client";

import { forwardRef } from "react";

const DesignSection = forwardRef(({ isSelected, sectionProgress }, ref) => {
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
            02
          </span>
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            DESIGN
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Create stunning, user-centric designs and wireframes. Plan the user experience, 
            information architecture, and visual identity that will bring your web project to life.
          </p>
        </div>

        {/* Custom Content for Web Development Design */}
        <div className="bg-gray-900/20 border border-gray-600/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Design Process Steps */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-[#adff00] font-semibold text-lg mb-4">Design Workflow</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { step: "Wireframes", tool: "Figma", status: "completed" },
                  { step: "UI Design", tool: "Adobe XD", status: "active" },
                  { step: "Prototyping", tool: "Framer", status: "pending" },
                  { step: "Style Guide", tool: "Zeplin", status: "pending" },
                ].map((item, index) => (
                  <div key={index} className={`p-4 rounded-lg border transition-all duration-300 ${
                    item.status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
                    item.status === 'active' ? 'bg-[#adff00]/10 border-[#adff00]/30' :
                    'bg-gray-800/30 border-gray-700/30'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{item.step}</h4>
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'completed' ? 'bg-green-400' :
                        item.status === 'active' ? 'bg-[#adff00]' : 'bg-gray-400'
                      }`} />
                    </div>
                    <p className="text-sm text-gray-400">{item.tool}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Preview */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[200px]">
                {/* Mock Browser Window */}
                <div className="bg-gray-800/50 rounded-t-lg p-2 border border-gray-600/30">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-b-lg p-4 border-x border-b border-gray-600/30 min-h-[120px]">
                  <div className="space-y-2">
                    <div className="h-3 bg-[#adff00]/30 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-500/30 rounded w-full"></div>
                    <div className="h-2 bg-gray-500/30 rounded w-2/3"></div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-6 w-12 bg-[#adff00]/20 rounded"></div>
                      <div className="h-6 w-12 bg-gray-500/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Design Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DesignSection.displayName = "DesignSection";

export default DesignSection; 