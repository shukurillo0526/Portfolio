import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, ArrowRight, FolderGit2, X, CheckCircle2 } from 'lucide-react';
import { projects } from '../data';
import { Project } from '../types';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-28 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Background radial spotlight flare */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 text-left">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Projects Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none" id="projects-title">
              Featured Case Studies
            </h2>
            <p className="text-base text-slate-400 font-sans">
              A curated collection of client products and software engineering experiments built with rigorous architectural execution.
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0" id="project-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`project-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-900 text-slate-400 border border-slate-850 hover:bg-slate-850 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="projects-grid">
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] hover:border-slate-750 transition-all duration-350"
              id={`project-card-${project.id}`}
            >
              {/* Cover Image Container with zoom overlay */}
              <div className="relative overflow-hidden aspect-video bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  id={`project-img-${project.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                
                {/* Category label indicator */}
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-slate-900/90 border border-slate-800 backdrop-blur-md text-indigo-300 font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm">
                  {project.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between text-left space-y-6">
                <div className="space-y-4.5">
                  {/* Tag badging */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-indigo-500/5 text-indigo-300 font-semibold text-xxs tracking-wide rounded-md border border-indigo-500/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-indigo-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Case Study Trigger */}
                <div className="pt-5 flex items-center justify-between border-t border-slate-850 mt-auto">
                  <button
                    id={`project-details-btn-${project.id}`}
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center space-x-1.5 text-indigo-400 hover:text-indigo-300 font-bold text-sm group/btn cursor-pointer transition-colors"
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                  
                  <div className="flex items-center space-x-3 text-slate-500">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors p-1"
                        aria-label="GitHub Repository"
                      >
                        <Github className="w-4.5 h-4.5" />
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors p-1"
                        aria-label="Live Website URL"
                      >
                        <ExternalLink className="w-4.5 h-4.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Project Details Modal (AnimatePresence Case Study) */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="project-details-modal">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                className="relative bg-slate-900 rounded-2xl overflow-hidden w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl z-10 text-left border border-slate-800"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 p-2 bg-slate-950/80 hover:bg-slate-850 rounded-full text-slate-300 border border-slate-800 shadow-md transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Cover Banner */}
                <div className="relative h-56 sm:h-72 bg-slate-950 flex-shrink-0">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 sm:left-8 right-6">
                    <span className="px-3 py-1 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black text-white mt-2 tracking-tight">
                      {selectedProject.title}
                    </h3>
                  </div>
                </div>

                {/* Modal Scroll Body */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">Project Overview</h4>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                      {selectedProject.longDescription || selectedProject.description}
                    </p>
                  </div>

                  {/* Core Features list */}
                  {selectedProject.features && selectedProject.features.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3.5">Key Solutions & Features</h4>
                      <ul className="space-y-3" id="modal-feature-list">
                        {selectedProject.features.map((feature, i) => (
                          <li key={i} className="flex items-start space-x-3 text-sm text-slate-300">
                            <CheckCircle2 className="w-4.5 h-4.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                            <span className="font-sans leading-relaxed text-slate-350">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech stack badge list */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">Tech Stack Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-slate-950 text-indigo-300 border border-indigo-500/10 font-semibold text-xs rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer and linkouts */}
                <div className="p-6 bg-slate-950 border-t border-slate-850 flex flex-wrap gap-4 items-center justify-between flex-shrink-0">
                  <div className="text-[10px] text-slate-500 font-mono">
                    Project File: {selectedProject.id}_case_study.md
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {selectedProject.live && (
                      <a
                        href={selectedProject.live}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/10 transition-colors flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Preview</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

