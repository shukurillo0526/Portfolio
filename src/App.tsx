import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import VibeCodingSimulator from './components/VibeCodingSimulator';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CompanionChat from './components/CompanionChat';

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleOpenContactModal = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-200 antialiased selection:bg-indigo-500/20 selection:text-indigo-300 scroll-smooth">
      {/* Dynamic Navigation Header */}
      <Header onContactClick={handleOpenContactModal} />

      {/* Main Sections */}
      <main>
        {/* Hero Landing */}
        <Hero onContactClick={handleOpenContactModal} />

        {/* Narrative & Skills Grid */}
        <About />

        {/* Case Studies Portfolio Grid */}
        <Projects />

        {/* Interactive Vibe Coding Simulator */}
        <VibeCodingSimulator />

        {/* Chronological Work History */}
        <Experience />

        {/* Dynamic Local Contact Form & Transmission Logs */}
        <Contact isModal={false} />
      </main>

      {/* Footer Navigation */}
      <Footer />

      {/* Overlay Contact Form Modal Dialog */}
      <AnimatePresence>
        {isContactModalOpen && (
          <Contact isModal={true} onClose={handleCloseContactModal} />
        )}
      </AnimatePresence>

      {/* Floating AI Companion Chat */}
      <CompanionChat />
    </div>
  );
}
