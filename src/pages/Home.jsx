import React from "react";
import SiteHeader from "../components/landing/SiteHeader";
import HeroSection from "../components/landing/HeroSection";
import TracklistSection from "../components/landing/TracklistSection";
import FeaturedVisual from "../components/landing/FeaturedVisual";
import EditionsSection from "../components/landing/EditionsSection";
import OrderSection from "../components/landing/OrderSection";
import ContactSection from "../components/landing/ContactSection";
import SiteFooter from "../components/landing/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <TracklistSection />
        <div id="lyrics" />
        <FeaturedVisual />
        <EditionsSection />
        <OrderSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}