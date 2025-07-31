"use client";

import { forwardRef } from "react";

const DeploySection = forwardRef(({ isSelected, sectionProgress }, ref) => {
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
            04
          </span>
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            DEPLOY
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Launch your web application to the world. Set up hosting, configure domains, 
            and ensure optimal performance with monitoring and analytics.
          </p>
        </div>

        {/* Custom Content for Web Deployment */}
        <div className="bg-gray-900/20 border border-gray-600/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Deployment Pipeline */}
            <div className="space-y-6">
              <h3 className="text-[#adff00] font-semibold text-lg mb-4">Deployment Pipeline</h3>
              
              {/* Pipeline Steps */}
              <div className="space-y-4">
                {[
                  { step: "Build", platform: "Vercel", status: "success", time: "2m 34s" },
                  { step: "Test", platform: "GitHub Actions", status: "success", time: "1m 12s" },
                  { step: "Deploy", platform: "Netlify", status: "active", time: "Running..." },
                  { step: "Monitor", platform: "Sentry", status: "pending", time: "Waiting..." },
                ].map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/20">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      item.status === 'success' ? 'bg-green-500/20 border-green-500/30' :
                      item.status === 'active' ? 'bg-[#adff00]/20 border-[#adff00]/30 animate-pulse' :
                      'bg-gray-500/20 border-gray-500/30'
                    } border-2`}>
                      {item.status === 'success' ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : item.status === 'active' ? (
                        <div className="w-2 h-2 bg-[#adff00] rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">{item.step}</h4>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </div>
                      <p className="text-sm text-gray-400">{item.platform}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Stats & Metrics */}
            <div className="space-y-6">
              <h3 className="text-[#adff00] font-semibold text-lg mb-4">Live Metrics</h3>
              
              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { metric: "Uptime", value: "99.9%", color: "green" },
                  { metric: "Load Time", value: "1.2s", color: "blue" },
                  { metric: "Visitors", value: "1,234", color: "purple" },
                  { metric: "Core Vitals", value: "95/100", color: "orange" },
                ].map((stat, index) => (
                  <div key={index} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/20 text-center">
                    <div className={`text-2xl font-bold mb-1 ${
                      stat.color === 'green' ? 'text-green-400' :
                      stat.color === 'blue' ? 'text-blue-400' :
                      stat.color === 'purple' ? 'text-purple-400' :
                      'text-orange-400'
                    }`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.metric}</div>
                  </div>
                ))}
              </div>

              {/* Deployment Status */}
              <div className="p-4 bg-gray-800/20 rounded-lg border border-gray-700/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">Deployment Status</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Domain:</span>
                    <span className="text-white">mywebsite.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SSL:</span>
                    <span className="text-green-400">Secured</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CDN:</span>
                    <span className="text-blue-400">Active</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-[#adff00]/10 border border-[#adff00]/30 text-[#adff00] text-sm rounded-lg hover:bg-[#adff00]/20 transition-colors">
                  View Site
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-800/30 border border-gray-700/30 text-gray-300 text-sm rounded-lg hover:bg-gray-700/30 transition-colors">
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

DeploySection.displayName = "DeploySection";

export default DeploySection; 