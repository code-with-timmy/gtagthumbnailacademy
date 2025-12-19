import React from "react";

import HeroSection from "@/home/HeroSection";
import CreatorsSection from "@/home/CreatorsSection";
import TemplatesSection from "@/home/TemplatesSection";
import VoiceCallSection from "@/home/VoiceCallSection";
import InstructorSection from "@/home/InstructorSection";
import FeaturesSection from "@/home/FeaturesSection";
import DiscordSection from "@/home/DiscordSection";
import FinalCTASection from "@/home/FinalCTASection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CreatorsSection />
      <TemplatesSection />
      <VoiceCallSection />
      <InstructorSection />
      <FeaturesSection />
      <DiscordSection />
      <FinalCTASection />
    </div>
  );
}
