"use client";

import { forwardRef } from "react";

const DevelopSection = forwardRef(({ isSelected, sectionProgress }, ref) => {
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
            03
          </span>
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            DEVELOP
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Transform designs into functional, responsive web applications. 
            Write clean, maintainable code using modern frameworks and best practices.
          </p>
        </div>

        {/* Custom Content for Web Development */}
        <div className="bg-gray-900/20 border border-gray-600/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Code Editor Mockup */}
            <div className="space-y-4">
              <h3 className="text-[#adff00] font-semibold text-lg mb-4">Development Environment</h3>
              
              {/* Mock Code Editor */}
              <div className="bg-gray-950/50 rounded-lg border border-gray-700/30 overflow-hidden">
                {/* Editor Header */}
                <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-400 ml-2">App.jsx</span>
                  </div>
                </div>
                
                {/* Code Content */}
                <div className="p-4 text-sm font-mono">
                  <div className="space-y-1">
                    <div className="text-purple-400">import React from &apos;react&apos;;</div>
                    <div className="text-blue-400">import &apos;./App.css&apos;;</div>
                    <div className="text-gray-500"></div>
                    <div className="text-orange-400">function <span className="text-yellow-300">App</span>() {'{{'}</div>
                    <div className="text-pink-400 ml-4">return (</div>
                    <div className="text-gray-300 ml-8">&lt;<span className="text-red-400">div</span> <span className="text-green-400">className</span>=<span className="text-yellow-300">&quot;app&quot;</span>&gt;</div>
                    <div className="text-gray-300 ml-12">&lt;<span className="text-red-400">h1</span>&gt;Hello World&lt;/<span className="text-red-400">h1</span>&gt;</div>
                    <div className="text-gray-300 ml-8">&lt;/<span className="text-red-400">div</span>&gt;</div>
                    <div className="text-pink-400 ml-4">);</div>
                    <div className="text-orange-400">{'}'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack & Progress */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[#adff00] font-semibold text-lg mb-4">Tech Stack</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "React", progress: 85, color: "blue" },
                    { name: "Next.js", progress: 70, color: "purple" },
                    { name: "Tailwind", progress: 95, color: "cyan" },
                    { name: "Node.js", progress: 60, color: "green" },
                  ].map((tech, index) => (
                    <div key={index} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">{tech.name}</span>
                        <span className="text-xs text-gray-400">{tech.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full bg-gradient-to-r ${
                            tech.color === 'blue' ? 'from-blue-400 to-blue-500' :
                            tech.color === 'purple' ? 'from-purple-400 to-purple-500' :
                            tech.color === 'cyan' ? 'from-cyan-400 to-cyan-500' :
                            'from-green-400 to-green-500'
                          }`}
                          style={{ width: `${tech.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Status */}
              <div>
                <h4 className="text-gray-200 font-medium mb-3">Development Status</h4>
                <div className="space-y-2">
                  {[
                    { task: "Component Structure", status: "complete" },
                    { task: "API Integration", status: "active" },
                    { task: "Testing Suite", status: "pending" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-800/20 rounded">
                      <span className="text-sm text-gray-300">{item.task}</span>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'active' ? 'bg-[#adff00]/20 text-[#adff00]' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DevelopSection.displayName = "DevelopSection";

export default DevelopSection; 