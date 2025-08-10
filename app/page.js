"use client";

import HeroSection from "@/components/HeroSection";

import Meeting from "@/components/meeting";
import { BlogSlider } from '@/components/blog'

import TestimonialSection from "@/components/TestimonialSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center relative bg-neutral-950">
      <HeroSection />
      
        ]
        
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
