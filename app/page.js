import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import StatsSection from "./components/StatsSection";
import ProcessSection from "./components/ProcessSection";
import ParallaxCTA from "./components/ParallaxCTA";
import TeamSection from "./components/TeamSection";
import PortfolioSection from "./components/PortfolioSection";
import GallerySection from "./components/GallerySection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import VideoSection from "./components/VideoSection";
import ContactForm from "./components/ContactForm";
import ScrollToTopButton from "./components/ScrollToTopButton";
import WhatsAppButton from "./components/WhatsAppButton"; // Import WhatsApp Button

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <Services />
      <StatsSection />
      <ProcessSection />
      <ParallaxCTA />
      <TeamSection />
      <PortfolioSection />
      <GallerySection />
      <TestimonialsSection />
      <FAQSection />
      <VideoSection />
      <ScrollToTopButton />
      <WhatsAppButton /> {/* Add WhatsApp Button Here */}
    </main>
  );
}
