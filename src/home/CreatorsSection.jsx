import React from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

const creators = [
  {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/037593266_channels4_profile22.jpg",
    name: "VMT",
  },
  {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/755dfe1ca_channels4_profile23.jpg",
    name: "Jmancurly",
  },
  {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/38ac0d8f7_channels4_profile24.jpg",
    name: "Be Prepared",
  },
  {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/00d8aa66b_channels4_profile25.jpg",
    name: "Erik1515",
  },
  {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/c847fc0c1_channels4_profile26.jpg",
    name: "H4kpy",
  },
  {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/b045e681b_channels4_profile27.jpg",
    name: "FizzFizz",
  },
  {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/92fface43_channels4_profile28.jpg",
    name: "CJVR",
  },
  {
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6913ef9d88f5466c017efc78/8adcd0be0_channels4_profile29.jpg",
    name: "CubCub11",
  },
];
// const creators = [
//   { name: 'Jmancurly', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/a0afb9f2f_00d8aa66b_channels4_profile25.jpg' },
//   { name: 'Be Prepared', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/7c9cbc297_38ac0d8f7_channels4_profile24.jpg' },
//   { name: 'Erik1515', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/5baadcd2b_92fface43_channels4_profile28.jpg' },
//   { name: 'H4kpy', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/5c50fe528_755dfe1ca_channels4_profile23.jpg' },
//   { name: 'VMT', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/f9fd5faac_037593266_channels4_profile22.jpg' },
//   { name: 'FizzFizz', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/2d9884ae7_b045e681b_channels4_profile27.jpg' },
//   { name: 'CubCub11', img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/41c25e75f_c847fc0c1_channels4_profile26.jpg' },
// ];

export default function CreatorsSection() {
  const doubledCreators = [...creators, ...creators, ...creators];

  return (
    <section className="py-20 relative overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-300 text-sm">
            <Users className="w-4 h-4" />
            Trusted Collaborations
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="coolvetica text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Who I've Worked With for a Long Time
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-center max-w-2xl mx-auto mb-12"
        >
          I've created hundreds of thumbnails for hundreds of creators, across
          dozens of niches on YouTube. Through that experience, I've learned the
          formula behind generating millions of views.
        </motion.p>

        {/* Scrolling Creators - Row 1 */}
        <div className="mb-8 relative">
          <div className="flex animate-scroll">
            {doubledCreators.map((creator, idx) => (
              <div
                key={`row1-${idx}`}
                className="flex flex-col items-center mx-6 flex-shrink-0"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-purple-500/50 mb-3 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <img
                    src={creator.img}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-base font-bold text-white">
                  {creator.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrolling Creators - Row 2 (reversed direction) */}
        <div className="relative">
          <div
            className="flex animate-scroll"
            style={{ animationDirection: "reverse" }}
          >
            {doubledCreators.map((creator, idx) => (
              <div
                key={`row2-${idx}`}
                className="flex flex-col items-center mx-6 flex-shrink-0"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-cyan-500/50 mb-3 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                  <img
                    src={creator.img}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-base font-bold text-white">
                  {creator.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discord Float Button */}
      <a
        href="https://discord.gg/HQeRgqQh7R"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-4 top-32 z-40 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">
          Join Discord!
        </span>
      </a>
    </section>
  );
}
