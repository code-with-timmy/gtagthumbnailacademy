import React, { useState } from "react";

import HeroSection from "@/home/HeroSection";
import CreatorsSection from "@/home/CreatorsSection";
import TemplatesSection from "@/home/TemplatesSection";
import VoiceCallSection from "@/home/VoiceCallSection";
import InstructorSection from "@/home/InstructorSection";
import FeaturesSection from "@/home/FeaturesSection";
import DiscordSection from "@/home/DiscordSection";
import FinalCTASection from "@/home/FinalCTASection";
import { useNavigate } from "react-router-dom";
import TermsOfServiceModal from "@/components/TermsOfServiceModal";

export default function Home() {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);

  const handleAccessCourse = () => {
    setShowTerms(true);
  };

  const handleAcceptTerms = () => {
    setShowTerms(false);
    navigate("/purchase");
  };
  return (
    <div>
      <HeroSection handleAccessCourse={handleAccessCourse} />
      <CreatorsSection />
      <TemplatesSection />
      <VoiceCallSection />
      <InstructorSection />
      <FeaturesSection />
      <DiscordSection />
      <FinalCTASection handleAccessCourse={handleAccessCourse} />
      <TermsOfServiceModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
      />
    </div>
  );
}
