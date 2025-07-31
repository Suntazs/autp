import ServicesSection from '../../components/ServicesSection';
import FeaturesSection from '../../components/FeaturesSection';
import ServicesListSection from '../../components/sections/ServicesListSection';
import { BlogSlider } from '@/components/blog'
import Meeting from "@/components/meeting";
export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <ServicesSection />
      <ServicesListSection />
      <FeaturesSection />
      <BlogSlider />
      <Meeting />
    </div>
  );
}
