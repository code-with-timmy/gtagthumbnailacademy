import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CreatorsSection from '../components/home/CreatorsSection';
import TemplatesSection from '../components/home/TemplatesSection';
import VoiceCallSection from '../components/home/VoiceCallSection';
import InstructorSection from '../components/home/InstructorSection';
import FeaturesSection from '../components/home/FeaturesSection';
import DiscordSection from '../components/home/DiscordSection';
import FinalCTASection from '../components/home/FinalCTASection';

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