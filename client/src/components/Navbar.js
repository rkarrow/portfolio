import React, { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-purple-500 to-white-600 backdrop-blur-md shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70 drop-shadow-lg">
                Portfolio
              </div>
              <div className="text-white/60 text-xs font-semibold tracking-widest">CREATIVE SHOWCASE</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => scrollToSection('home')}
              className="px-4 py-2 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-4 py-2 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="px-4 py-2 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="px-4 py-2 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm hover:shadow-lg"
            >
              Contact
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <a
              href="#contact"
              className="px-6 py-2 bg-white text-primary-600 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get In Touch
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="block w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg font-medium transition-all duration-300"
            >
              Contact
            </button>
            <div className="pt-2 border-t border-white/20">
              <a
                href="#contact"
                className="block w-full px-4 py-3 bg-white text-primary-600 rounded-lg font-bold text-center hover:shadow-lg transition-all duration-300"
              >
                Get In Touch
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slideInFromTop 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
