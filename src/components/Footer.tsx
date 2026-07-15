import React from 'react';
import { Code2, Github, Linkedin, Send, ArrowUp } from 'lucide-react';
import { personalInfo } from '../data';

export default function Footer() {
  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-slate-950 text-white py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12 border-b border-slate-900">
          {/* Logo & Slogan Column */}
          <div className="md:col-span-6 space-y-4 text-left">
            <a
              href="#home"
              className="flex items-center space-x-2 text-white font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
            >
              <Code2 className="w-6 h-6 text-indigo-400" />
              <span>Shukurillokh<span className="text-indigo-400">.</span></span>
            </a>
            <p className="text-sm text-gray-400 max-w-sm font-sans leading-relaxed">
              Pioneering the future of smart kitchen and food ecosystems with AI-first agentic platforms and robust full-stack systems.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Navigation</h4>
            <div className="flex flex-col space-y-2">
              <a href="#home" className="text-sm text-gray-400 hover:text-white transition-colors">Home</a>
              <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#projects" className="text-sm text-gray-400 hover:text-white transition-colors">Projects</a>
              <a href="#experience" className="text-sm text-gray-400 hover:text-white transition-colors">Experience</a>
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Contact</h4>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors font-mono">
                {personalInfo.email}
              </a>
              <div className="font-mono text-xs space-y-0.5">
                <div>UZ: <a href={`tel:${personalInfo.phone}`} className="hover:text-white transition-colors">{personalInfo.phone}</a></div>
                <div>KR: <a href={`tel:${personalInfo.phoneKR}`} className="hover:text-white transition-colors">{personalInfo.phoneKR}</a></div>
                <div>TG: <a href={personalInfo.telegram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">@sheikh0526</a></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500 font-sans text-center sm:text-left">
            &copy; {new Date().getFullYear()} Shukurillokh Mamarasulov. All rights reserved. Crafted with care and modern Tailwind CSS.
          </p>

          <div className="flex items-center space-x-6">
            {/* Social media connections */}
            <div className="flex space-x-4">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-indigo-400 transition-colors"
                aria-label="GitHub Repository Link"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-indigo-400 transition-colors"
                aria-label="LinkedIn Profile Link"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.telegram}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-indigo-400 transition-colors"
                aria-label="Telegram Channel Link"
              >
                <Send className="w-5 h-5 -rotate-45 relative right-0.5" />
              </a>
            </div>

            {/* Scroll Back to Top Button */}
            <button
              id="footer-scroll-top-btn"
              onClick={handleScrollToTop}
              className="p-2.5 bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
              aria-label="Scroll to top of webpage"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
