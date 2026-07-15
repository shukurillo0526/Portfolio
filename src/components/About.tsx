import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  Code2, 
  Sparkles, 
  Play, 
  FileCode, 
  Server, 
  GitMerge, 
  Database, 
  Zap, 
  PenTool, 
  GitBranch, 
  Box, 
  Cloud,
  ChevronRight,
  User,
  Clock,
  Briefcase,
  Terminal,
  Award
} from 'lucide-react';
import { personalInfo, skills } from '../data';

// Map icon strings to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers,
  Code2,
  Sparkles,
  Play,
  FileHtml: FileCode,
  FileCode,
  Server,
  GitMerge,
  Database,
  Zap,
  PenTool,
  GitBranch,
  Box,
  Cloud,
  Terminal,
  Clock
};

export default function About() {
  const [activeTab, setActiveTab] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(skills.map(skill => skill.category)))];

  const filteredSkills = activeTab === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === activeTab);

  return (
    <section id="about" className="py-28 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Absolute Glow Spotlight blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Column 1: Narrative & Bento Stats */}
          <div className="lg:col-span-5 flex flex-col items-start text-left space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>Identity & Philosophy</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight" id="about-heading">
              A meticulous builder of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">clean digital platforms.</span>
            </h2>
            
            <p className="text-base text-slate-400 leading-relaxed font-sans" id="about-bio-main">
              {personalInfo.bio}
            </p>
            
            <p className="text-base text-slate-400 leading-relaxed font-sans animate-fade-in" id="about-bio-secondary">
              I believe in strong software engineering principles, high visual standards, and meticulous product architecture. Whether structuring database models or tuning client-side transition curves, I strive for speed and readability above all else.
            </p>

            {/* Bento Statistics Grid */}
            <div className="grid grid-cols-3 gap-4 w-full pt-4" id="bento-stats">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Terminal className="w-4.5 h-4.5 text-indigo-400 mb-2" />
                <span className="text-2xl font-black text-white leading-none">5</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Active Apps</span>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Award className="w-4.5 h-4.5 text-violet-400 mb-2" />
                <span className="text-2xl font-black text-white leading-none">7.0</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">IELTS Band</span>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-md relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Zap className="w-4.5 h-4.5 text-indigo-400 mb-2" />
                <span className="text-2xl font-black text-white leading-none">15x</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Vibe Speed</span>
              </motion.div>
            </div>
          </div>

          {/* Column 2: Visual Skills Engine */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-8 text-left w-full">
            <div className="flex flex-col space-y-3 w-full">
              <h3 className="text-2xl font-bold text-white tracking-tight">Expertise & Stack</h3>
              <p className="text-sm text-slate-400 font-sans">
                Select a tier category below to explore specific tool integrations and performance proficiencies.
              </p>
            </div>

            {/* Category tabs selection */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-850 rounded-xl w-full" id="skill-tabs-container">
              {categories.map((category) => (
                <button
                  key={category}
                  id={`skill-tab-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setActiveTab(category)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    activeTab === category
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Grid of skill meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full" id="skills-grid">
              {filteredSkills.map((skill, index) => {
                const IconComponent = iconMap[skill.iconName] || Code2;
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    whileHover={{ y: -4, scale: 1.015 }}
                    className="p-5 bg-slate-900 border border-slate-850 hover:border-slate-700/80 rounded-2xl shadow-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-350 relative group overflow-hidden"
                    id={`skill-card-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {/* Subtle Glowing Hover Accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300" id={`skill-icon-bg-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                          <IconComponent className="w-4.5 h-4.5" />
                        </div>
                        <span className="font-bold text-white text-sm sm:text-base tracking-tight">{skill.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded-md border border-indigo-500/10">{skill.level}%</span>
                    </div>

                    {/* Progress Slider Bar with scroll triggered animation */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.05 }}
                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full relative overflow-hidden"
                        id={`skill-meter-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        {/* Shimmer light bar effect */}
                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

