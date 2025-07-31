"use client";

import WebAppHeroSection from "@/components/sections/WebAppHeroSection";
import CurvedLoop from "@/components/sections/textslider";
import Meeting from "@/components/meeting";
import RotatingFlower from "@/components/ui/RotatingFlower";
import { useState, useEffect } from "react";

export default function WebAppPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.05,
        y: (e.clientY - window.innerHeight / 2) * 0.05,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll tracking for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center relative mt-10">
    <WebAppHeroSection 
        heading="WEB APPLICATIONS"
        description="Transform your business with powerful, scalable web applications built using cutting-edge technology. We create custom solutions that drive growth and enhance user experience."
      />

      {/* Benefits Section */}
      <section className="w-full relative">
        <div className="max-w-[1600px] px-4 md:px-8 lg:px-16  py-20 mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16">
            STRUGGLING WITH OUTDATED SYSTEMS?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Problem-Solution Cards */}
            <div className="group relative p-8 bg-white border-2 border-black hover:bg-[#E4FF97] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">REDUCE MANUAL WORK BY 80%</h3>
              <p className="text-gray-700">
                Stop wasting hours on repetitive tasks. Our automated workflows and smart integrations eliminate manual data entry and reduce human errors.
              </p>
            </div>

            <div className="group relative p-8 bg-white border-2 border-black hover:bg-[#E4FF97] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">INCREASE TEAM PRODUCTIVITY</h3>
              <p className="text-gray-700">
                Give your team real-time collaboration tools, instant access to data, and streamlined processes that boost productivity by up to 40%.
              </p>
            </div>

            <div className="group relative p-8 bg-white border-2 border-black hover:bg-[#E4FF97] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">REDUCE OPERATIONAL COSTS</h3>
              <p className="text-gray-700">
                Replace expensive software licenses with custom solutions. Eliminate redundant tools and streamline operations to cut unnecessary expenses.
              </p>
            </div>

            <div className="group relative p-8 bg-white border-2 border-black hover:bg-[#E4FF97] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">MAKE DATA-DRIVEN DECISIONS</h3>
              <p className="text-gray-700">
                Get instant insights with real-time dashboards. Track KPIs, identify trends, and make informed decisions that drive growth.
              </p>
            </div>

            <div className="group relative p-8 bg-white border-2 border-black hover:bg-[#E4FF97] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">SCALE WITHOUT LIMITS</h3>
              <p className="text-gray-700">
                Handle 10x more customers without hiring more staff. Our cloud-native architecture grows with your business automatically.
              </p>
            </div>

            <div className="group relative p-8 bg-white border-2 border-black hover:bg-[#E4FF97] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">IMPROVE CUSTOMER SATISFACTION</h3>
              <p className="text-gray-700">
                Deliver faster service, personalized experiences, and 24/7 availability that keeps customers coming back for more.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <RotatingFlower
          className="w-32 h-32 top-10 right-10"
          colorTheme={2}
          style={{
            transform: `translate(${mousePosition.x * 1.2}px, ${mousePosition.y * 1.2}px)`,
          }}
        />
      </section>

      {/* Process Section */}
      <section className="w-full relative bg-gray-50">
        <div className="max-w-[1600px] px-4 md:px-8 lg:px-16  py-20 mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center mb-16 max-w-4xl mx-auto leading-tight">
            HOW LONG DOES WEB APP DEVELOPMENT TAKE?
          </h2>
          
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 order-2 md:order-1 text-left">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 max-w-md leading-tight">WEEK 1-2: REQUIREMENTS & STRATEGY</h3>
                <p className="text-lg md:text-xl text-gray-700 mb-4 md:mb-6">
                  We dive deep into your business goals and user needs. No generic solutions - every feature is designed to solve your specific challenges and drive measurable results.
                </p>
                <p className="text-base md:text-lg text-gray-600">
                  We map out your user journeys, define technical requirements, and create a detailed project roadmap with clear milestones. You'll know exactly what to expect and when.
                </p>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center">

              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 flex justify-center">
              </div>
              <div className="w-full md:w-1/2 text-right">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 max-w-md ml-auto leading-tight">WEEK 3-4: DESIGN & USER TESTING</h3>
                <p className="text-lg md:text-xl text-gray-700 mb-4 md:mb-6">
                  Beautiful interfaces that actually convert. We create designs that your users will love and that drive the actions you want them to take.
                </p>
                <p className="text-base md:text-lg text-gray-600">
                  Interactive prototypes let you test and refine the user experience before any code is written. We integrate your brand identity and ensure every screen serves a purpose.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 order-2 md:order-1 text-left">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 max-w-md leading-tight">WEEK 5-10: DEVELOPMENT & INTEGRATION</h3>
                <p className="text-lg md:text-xl text-gray-700 mb-4 md:mb-6">
                  Fast, secure, and scalable development using proven technologies. We build in weekly sprints so you can see progress and provide feedback throughout.
                </p>
                <p className="text-base md:text-lg text-gray-600">
                  Every feature is thoroughly tested for security, performance, and reliability. We integrate with your existing systems and ensure everything works seamlessly together.
                </p>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center">
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 flex justify-center">

              </div>
              <div className="w-full md:w-1/2 text-right">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 max-w-md ml-auto leading-tight">WEEK 11-12: LAUNCH & OPTIMIZATION</h3>
                <p className="text-lg md:text-xl text-gray-700 mb-4 md:mb-6">
                  Smooth deployment with zero downtime. We handle everything from cloud setup to performance monitoring, so you can focus on your business.
                </p>
                <p className="text-base md:text-lg text-gray-600">
                  Post-launch support includes performance monitoring, user feedback analysis, and continuous improvements. Your web app evolves with your growing business needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Meeting />
    </main>
  );
}
