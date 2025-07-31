"use client";

import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import AboutSection from "@/components/about";
import Meeting from "@/components/meeting";
import { BlogSlider } from '@/components/blog'
import CurvedLoop from "@/components/sections/textslider";
import TestimonialSection from "@/components/TestimonialSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center relative mt-10">
      <HeroSection />
      <AboutSection />

      <CurvedLoop 
        marqueeText="services ✦ E-commerce ✦ WebApp ✦ SAAS ✦ Automation ✦"
        speed={2}
        curveAmount={-30}
        direction="left"
        interactive={true}
        className="custom-text-style"
      />
      <ProcessSection />
      
      {/* First Testimonial - You can customize all these props */}
      <TestimonialSection 
        testimonialText="One of the best companies I have worked with. They are very professional and always deliver on time. And did more than asked."
        highlightedText="always deliver on time"
        companyLogo={null} // You can add a logo URL here like "/img/company-logo.png"
        companyName="perplexity"
        reviewerPicture="/img/an-elderly-man-with-gray-hair-and-wearing-glasses-.png"
        reviewerName="Henry Modisett"
        reviewerRole="Head of Design"
        sectionId="testimonial-1"
      />


      <BlogSlider />
      <Meeting />
    </main>
  );
}
