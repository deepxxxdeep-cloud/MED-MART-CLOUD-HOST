import Header from "../components/Header";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import WhyChooseUs from "../components/WhyChooseUs";
import FeaturedProducts from "../components/FeaturedProducts";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";
import SiteBackgroundVideo from "../components/SiteBackgroundVideo";

export default function Landing() {
  return (
    <div className="relative min-h-screen font-sans text-gray-800">
      <SiteBackgroundVideo />
      <Header />
      <main>
        <Hero />
        <CategoryGrid />
        <WhyChooseUs />
        <FeaturedProducts />
        <HowItWorks />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
