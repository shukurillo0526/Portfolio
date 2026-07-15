import React, { useState, useEffect } from 'react';
import { Menu, X, Code2 } from 'lucide-react';

interface HeaderProps {
  onContactClick: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Vibe Engine', href: '#vibe-engine' },
    { name: 'Experience', href: '#experience' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
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

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-900/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a
            id="logo-link"
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity"
          >
            <Code2 className="w-6 h-6 text-indigo-400" id="logo-icon" />
            <span id="logo-text">Shukurillokh<span className="text-indigo-400">.</span></span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" id="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                id={`nav-link-${link.name.toLowerCase()}`}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-slate-400 hover:text-white font-semibold text-sm transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            <button
              id="header-cta-button"
              onClick={onContactClick}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-500 transition-all duration-300 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Get in Touch
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-900/80 animate-in fade-in slide-in-from-top-4 duration-200" id="mobile-nav-drawer">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-2xl">
            {navLinks.map((link) => (
              <a
                key={link.href}
                id={`mobile-nav-link-${link.name.toLowerCase()}`}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block text-slate-350 hover:text-indigo-400 font-semibold text-base py-3 border-b border-slate-900"
              >
                {link.name}
              </a>
            ))}
            <button
              id="mobile-header-cta-button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onContactClick();
              }}
              className="w-full text-center px-5 py-3 bg-indigo-600 text-white rounded-xl text-base font-bold hover:bg-indigo-500 transition-colors duration-300"
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

