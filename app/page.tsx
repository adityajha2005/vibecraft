// pages/index.tsx

import Header from "./components/landingPage/Header";
import Hero from "./components/landingPage/Hero";
import Features from "./components/landingPage/Features";
import HowItWorks from "./components/landingPage/HowItWorks";
import Testimonials from "./components/landingPage/Testimonials";
import CallToAction from "./components/landingPage/CallToAction";
import Footer from "./components/landingPage/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
