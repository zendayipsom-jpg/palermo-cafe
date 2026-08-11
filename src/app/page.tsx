import Hero from "@/components/home/Hero";
import History from "@/components/home/History";
import MenuPreview from "@/components/home/MenuPreview";
import FoodGallery from "@/components/home/FoodGallery";
import Experience from "@/components/home/Experience";
import Locations from "@/components/home/Locations";
import ReservationCTA from "@/components/home/ReservationCTA";
import BlogPreview from "@/components/home/BlogPreview";
import PromoBanner from "@/components/home/PromoBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import {
  GradientDivider,
  MarqueeDivider,
  MarqueeWithIcons,
  MarqueeReversed,
} from "@/components/shared/SectionDivider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PromoBanner />
        <GradientDivider />
        <History />
        <MarqueeDivider />
        <MenuPreview />
        <MarqueeWithIcons />
        <FoodGallery />
        <GradientDivider />
        <Experience />
        <MarqueeReversed />
        <Locations />
        <MarqueeDivider />
        <ReservationCTA />
        <GradientDivider />
        <BlogPreview />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
