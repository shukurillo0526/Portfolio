import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, CheckSquare } from 'lucide-react';
import { experience } from '../data';

export default function Experience() {
  return (
    <section id="experience" className="py-28 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Glow spotlight decoration */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-left space-y-4 max-w-xl mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Professional Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none" id="experience-title">
            Work Experience
          </h2>
          <p className="text-base text-slate-400 font-sans">
            A linear chronology of engineering leadership, platform migration, and client-centric frontends.
          </p>
        </div>

        {/* Timeline Path Container */}
        <div className="relative max-w-4xl mx-auto text-left" id="experience-timeline">
          {/* Vertical central path line with beautiful glowing gradient */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/80 via-violet-500/30 to-indigo-500/0 -translate-x-1/2 -z-1" />

          {/* Timeline Nodes */}
          <div className="space-y-16">
            {experience.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                  id={`experience-row-${item.id}`}
                >
                  {/* Circle Pin Marker with absolute neon drop-shadow */}
                  <div className="absolute left-4 sm:left-1/2 top-1 w-8 h-8 rounded-full border-4 border-slate-950 bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.6)] -translate-x-1/2 flex items-center justify-center z-10">
                    <Briefcase className="w-3.5 h-3.5 text-white" />
                  </div>

                  {/* Spacer or Side panel for desktop centering */}
                  <div className="hidden sm:block w-1/2" />

                  {/* Chronological Card Wrapper */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 25 : -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0 sm:px-4"
                  >
                    <div
                      className="bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-350 relative group overflow-hidden"
                      id={`experience-card-${item.id}`}
                    >
                      {/* Interactive overlay card highlights */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Duration / Calendar Badge */}
                      <span className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md mb-4">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.duration}</span>
                      </span>

                      {/* Header Title */}
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-indigo-400 transition-colors duration-300">{item.role}</h3>
                      
                      {/* Company Name Subheader */}
                      <div className="text-sm font-bold text-slate-400 mb-4">{item.company}</div>
                      
                      {/* Overview Summary text */}
                      <p className="text-sm text-slate-300 font-sans leading-relaxed mb-5 border-l-2 border-slate-700 pl-3">
                        {item.description}
                      </p>

                      {/* Accomplishments Checklists */}
                      <ul className="space-y-3 mb-6" id={`experience-bullets-${item.id}`}>
                        {item.bulletPoints.map((bullet, idx) => (
                          <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-400">
                            <CheckSquare className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                            <span className="font-sans leading-relaxed text-slate-350">{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech stack mapping */}
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-850">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-indigo-500/5 text-indigo-300 font-semibold text-xxs border border-indigo-500/10 tracking-wide rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

