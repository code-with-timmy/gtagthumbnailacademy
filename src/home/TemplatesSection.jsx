import React from 'react';
import { Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const templates = [
  {
    num: '#1',
    name: 'Venom Style',
    desc: 'Dark & Menacing Design',
    img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/93120d0c9_Codyvenomgori7lla.png'
  },
  {
    num: '#2',
    name: 'GhostFace Style',
    desc: 'Horror-Themed Layout',
    img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/ef4796c44_GHOSTFACECODY.png'
  },
  {
    num: '#3',
    name: 'Winter Theme',
    desc: 'Seasonal Design Pack',
    img: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69435cc8e3d996630f3c64bb/81f73493b_CodywinterGorillatagPSD-Recove5red.png'
  }
];

export default function TemplatesSection() {
  return (
    <section className="py-32 relative bg-[#0a0e1a]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-4 px-12 py-5 rounded-full border border-purple-500/40 bg-purple-600/20 text-purple-200 text-2xl font-bold uppercase tracking-[0.2em]">
            <Gift className="w-8 h-8" />
            Exclusive Bonus Templates
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="coolvetica text-8xl md:text-[10rem] lg:text-[16rem] font-bold text-center mb-8 tracking-wider leading-none"
        >
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Premium PSD Templates</span>
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="coolvetica text-8xl md:text-[10rem] lg:text-[16rem] font-bold text-center mb-16 tracking-wider leading-none"
        >
          Included Free!
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 text-center mb-20 text-3xl md:text-4xl tracking-wide max-w-5xl mx-auto leading-relaxed"
        >
          Get instant access to <span className="text-purple-400 font-bold">3 professional-grade</span> thumbnail templates
        </motion.p>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {templates.map((template, idx) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="relative group"
            >
              {/* Card with exact styling from screenshot */}
              <div className="bg-gradient-to-b from-[#1a1d35] via-[#151828] to-[#0f111f] rounded-[32px] p-8 border border-blue-500/20 shadow-[0_8px_60px_rgba(37,99,235,0.2)]">
                {/* Image Container */}
                <div className="relative rounded-[24px] overflow-hidden bg-black mb-7">
                  <img
                    src={template.img}
                    alt={template.name}
                    className="w-full aspect-video object-cover"
                  />
                  {/* PSD Badge - cyan color matching screenshot */}
                  <div className="absolute top-5 right-5 bg-cyan-500 text-white text-base font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_4px_20px_rgba(6,182,212,0.5)]">
                    <span className="text-sm">Ps</span>
                    <span>PSD</span>
                  </div>
                  {/* TEEN Rating Badge */}
                  {(idx === 0 || idx === 1) && (
                    <div className={`absolute ${idx === 0 ? 'bottom-5 left-5' : 'top-5 left-5'} bg-white text-black px-3 py-2.5 rounded-md flex flex-col items-center font-black leading-none shadow-lg`}>
                      <span className="text-[13px]">T</span>
                      <span className="text-[10px] mt-1">TEEN</span>
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="text-center">
                  {/* Template Number Badge */}
                  <div className="inline-block px-6 py-2 bg-blue-600/25 text-cyan-400 text-sm font-bold rounded-full mb-5 border border-blue-500/40 uppercase tracking-[0.2em]">
                    Template {template.num}
                  </div>
                  
                  {/* Title */}
                  <h4 className="coolvetica text-[32px] font-bold mb-3 text-white leading-tight tracking-wide">
                    {template.name}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-[17px] mb-6 leading-relaxed tracking-wide">
                    {template.desc}
                  </p>
                  
                  {/* Editable Layers Badge */}
                  <div className="flex items-center justify-center gap-3 text-green-400 text-[15px] font-medium tracking-wide">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                    <span>Fully Editable Layers</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}