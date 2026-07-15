import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Github, Linkedin, Send, Sparkles, Terminal, FileCode, Check } from 'lucide-react';
import { personalInfo } from '../data';

interface HeroProps {
  onContactClick: () => void;
}

type TabType = 'profile' | 'skills' | 'terminal';

export default function Hero({ onContactClick }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  
  // 3D Card Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Welcome to Shukurillokh terminal v1.5.0',
    'Type "help" to view list of available commands.',
    ''
  ]);

  // Handle smooth scroll to projects
  const handleScrollToProjects = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Scale to max 12 degrees
    const x = -(mouseY / height) * 24;
    const y = (mouseX / width) * 24;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Particle background engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(45, Math.floor(width / 30));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleWindowMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Render each node particle
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 70, 229, 0.25)'; // Indigo theme color
        ctx.fill();

        // Check distance to mouse for connecting lines
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(79, 70, 229, ${0.12 * (1 - distMouse / 160)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw connections with adjacent particles
        particles.forEach((p2) => {
          if (p === p2) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${0.1 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle simulated terminal execution
  const executeTerminalCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    let response: string[] = [];

    if (trimmed === '') {
      response = [''];
    } else if (trimmed === 'help') {
      response = [
        'Available commands:',
        '  about     - Brief bio information',
        '  projects  - List active project links',
        '  contact   - Display email & connection channels',
        '  clear     - Wipe out command log history'
      ];
    } else if (trimmed === 'about') {
      response = [
        `Name: ${personalInfo.name}`,
        `Role: ${personalInfo.title}`,
        'Passions: Clean modules, UX focus, high frame scores.'
      ];
    } else if (trimmed === 'projects') {
      response = [
        'Active Case Studies:',
        '  1. Plately (AI Kitchen & Food Ecosystem)',
        '  2. Markpad Native (Microsoft Store Markdown App)',
        '  3. SplitRide (Fare-Pooling Route App)',
        '  4. MyFlashMind (Spaced Repetition Flashcards)',
        '  5. SINO App (Modular Productivity Utility)'
      ];
    } else if (trimmed === 'contact') {
      response = [
        `Direct Email: ${personalInfo.email}`,
        'Social channels: GitHub, LinkedIn, Twitter',
        'Status: Building Plately & open for collaboration.'
      ];
    } else if (trimmed === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      response = [`Command not found: "${trimmed}". Type "help" for a list of commands.`];
    }

    setTerminalLogs((prev) => [...prev, `shukurillokh$ ${cmdStr}`, ...response, '']);
    setTerminalInput('');
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-950 text-white"
    >
      {/* Background canvas interactive nodes */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Decorative Blur Spots */}
      <div className="absolute top-1/6 right-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse duration-5000" />
      <div className="absolute bottom-1/5 left-1/10 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl -z-10 animate-pulse duration-7000" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Column 1: Typography Introduction */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-7 text-left">
            {/* Pulsing Status Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(99,102,241,0.15)]"
              id="hero-badge"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Available for Consultations</span>
            </motion.div>

            {/* Glowing Big Titles */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-none"
                id="hero-title"
              >
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 relative inline-block">{personalInfo.name}</span>
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-3.5xl lg:text-4.5xl font-bold text-slate-300 tracking-tight"
                id="hero-tagline"
              >
                {personalInfo.title}
              </motion.h2>
            </div>

            {/* Subtitle bio text block */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed font-sans"
              id="hero-subtitle"
            >
              {personalInfo.subTitle}
            </motion.p>

            {/* Actions CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2 w-full sm:w-auto"
              id="hero-actions"
            >
              <button
                id="hero-cta-projects"
                onClick={handleScrollToProjects}
                className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-base transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 flex items-center space-x-2.5 group cursor-pointer"
              >
                <span>Explore Showcase</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                id="hero-cta-contact"
                onClick={onContactClick}
                className="px-6 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-base transition-colors duration-300 cursor-pointer"
              >
                Initiate Chat
              </button>
            </motion.div>

            {/* Social handles list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center space-x-4 pt-4 border-t border-slate-900 w-full"
              id="hero-socials"
            >
              <span className="text-xxs font-bold uppercase tracking-wider text-slate-500">Secure Links:</span>
              <div className="flex space-x-1">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  id="hero-social-github"
                  className="p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-900/60 rounded-xl transition-all"
                  aria-label="GitHub Profile Link"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  id="hero-social-linkedin"
                  className="p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-900/60 rounded-xl transition-all"
                  aria-label="LinkedIn Profile Link"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={personalInfo.telegram}
                  target="_blank"
                  rel="noreferrer"
                  id="hero-social-telegram"
                  className="p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-900/60 rounded-xl transition-all"
                  aria-label="Telegram Profile Link"
                >
                  <Send className="w-5 h-5 -rotate-45 relative right-0.5 top-0.5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Column 2: Interactive 3D Mockup Container */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setIsHovered(true)}
              style={{
                transformStyle: 'preserve-3d',
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              id="hero-card"
            >
              {/* Glowing Interactive Aura overlay */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Editor Tab Headers */}
              <div className="bg-slate-950 border-b border-slate-850 px-4 flex items-center justify-between h-14">
                <div className="flex items-center space-x-1.5" id="mock-window-dots">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>

                {/* Interactive Selectors */}
                <div className="flex items-center space-x-1" id="mock-file-tabs">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-1.5 rounded-md text-xxs font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-slate-900 text-indigo-400 border border-slate-800/80'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>profile.ts</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`px-3 py-1.5 rounded-md text-xxs font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                      activeTab === 'skills'
                        ? 'bg-slate-900 text-indigo-400 border border-slate-800/80'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>skills.json</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`px-3 py-1.5 rounded-md text-xxs font-mono font-bold flex items-center space-x-1 cursor-pointer transition-colors ${
                      activeTab === 'terminal'
                        ? 'bg-slate-900 text-indigo-400 border border-slate-800/80'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>terminal.sh</span>
                  </button>
                </div>
              </div>

              {/* Editor Code Panels Wrapper */}
              <div className="p-6 font-mono text-xs sm:text-sm text-left h-[330px] overflow-y-auto bg-slate-900/40 relative">
                <AnimatePresence mode="wait">
                  {/* View 1: JSON profile */}
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5 text-slate-300 select-all"
                    >
                      <div>
                        <span className="text-violet-400">const</span> <span className="text-indigo-400">developer</span> = &#123;
                      </div>
                      <div className="pl-4">
                        <span className="text-slate-500">name:</span> <span className="text-emerald-400">"{personalInfo.name}"</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-slate-500">architecture:</span> <span className="text-emerald-400">"Agentic Developer & Solo Founder"</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-slate-500">education:</span> <span className="text-amber-400">"Computer Science @ SKKU Class of 2030"</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-slate-500">workflow_vibe:</span> <span className="text-emerald-400">"Vibecoding & Prompting"</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-slate-500">active_projects:</span> <span className="text-indigo-400">[</span>
                      </div>
                      <div className="pl-8 text-indigo-300">
                        <span className="text-emerald-400">"Plately"</span>, <span className="text-emerald-400">"Markpad Native"</span>,
                        <br />
                        <span className="text-emerald-400">"SplitRide"</span>, <span className="text-emerald-400">"MyFlashMind"</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-indigo-400">]</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-slate-500">solo_founder:</span> <span className="text-amber-400">true</span>
                      </div>
                      <div>&#125;;</div>
                    </motion.div>
                  )}

                  {/* View 2: Skills list */}
                  {activeTab === 'skills' && (
                    <motion.div
                      key="skills-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 text-slate-300"
                    >
                      <div className="text-slate-500">&#123; "core_proficiencies": [</div>
                      <div className="space-y-2 pl-4">
                        <div className="flex items-center justify-between">
                          <span className="text-indigo-300">"Agentic Coding (AI-First)"</span>
                          <span className="text-emerald-400 text-xxs font-bold">98%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full w-[98%]" />
                        </div>
                      </div>
                      <div className="space-y-2 pl-4">
                        <div className="flex items-center justify-between">
                          <span className="text-indigo-300">"Flutter & Dart"</span>
                          <span className="text-emerald-400 text-xxs font-bold">85%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full w-[85%]" />
                        </div>
                      </div>
                      <div className="space-y-2 pl-4">
                        <div className="flex items-center justify-between">
                          <span className="text-indigo-300">"Vibe Coding & AI Tools"</span>
                          <span className="text-emerald-400 text-xxs font-bold">95%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full w-[95%]" />
                        </div>
                      </div>
                      <div className="space-y-2 pl-4">
                        <div className="flex items-center justify-between">
                          <span className="text-indigo-300">"Python & C Programming"</span>
                          <span className="text-emerald-400 text-xxs font-bold">80%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full w-[80%]" />
                        </div>
                      </div>
                      <div className="text-slate-500">] &#125;</div>
                    </motion.div>
                  )}

                  {/* View 3: Fully Runnable Terminal Console Mockup */}
                  {activeTab === 'terminal' && (
                    <motion.div
                      key="terminal-tab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col h-full justify-between"
                    >
                      {/* Terminal Log Output */}
                      <div className="space-y-1.5 overflow-y-auto text-xxs sm:text-xs text-slate-400 font-mono pr-2 max-h-[220px]">
                        {terminalLogs.map((log, index) => (
                          <div key={index} className="whitespace-pre-wrap leading-relaxed">
                            {log.startsWith('shukurillokh$') ? (
                              <span className="text-indigo-400 font-bold">{log}</span>
                            ) : log.startsWith('Command not found') ? (
                              <span className="text-rose-400">{log}</span>
                            ) : (
                              log
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Interactive Prompt Line */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          executeTerminalCommand(terminalInput);
                        }}
                        className="flex items-center space-x-2 border-t border-slate-850 pt-3 mt-auto"
                      >
                        <span className="text-indigo-400 font-bold">shukurillokh$</span>
                        <input
                          type="text"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          placeholder="Type 'help'..."
                          className="flex-1 bg-transparent border-none text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-0 font-mono text-xs sm:text-sm"
                        />
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative Card Rim status footer */}
              <div className="bg-slate-950/80 px-5 py-3.5 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive Playground Ready</span>
                </div>
                <span>Ln 12, Col 34</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

