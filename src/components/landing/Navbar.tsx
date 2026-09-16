import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#hero' },
    { name: 'Kawasan', href: '#about' },
    { name: 'Valuasi', href: '/projects' },
    { name: 'Bantuan / Kontak', href: '#map' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 sm:px-6 lg:px-8">
      <div
        className={`
          w-full max-w-5xl rounded-full px-3 sm:px-5 py-2.5
          transition-all duration-500
          ${isScrolled
            ? 'bg-white shadow-xl shadow-black/10'
            : 'bg-black/12 shadow-lg shadow-black/5'
          }
          backdrop-blur-md border border-white/10
        `}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="/images/ipb-logo.png"
              alt="IPB Logo"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
            />
            <span className={`font-bold ${isScrolled ? 'text-slate-900' : 'text-white'} text-sm sm:text-base tracking-wide whitespace-nowrap`}>
              PKSPL IPB
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 xl:px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                    isScrolled
                      ? 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3 xl:px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                    isScrolled
                      ? 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </a>
              )
            )}
          </div>

          {/* Daftar / Masuk Button */}
          <div className="hidden lg:block flex-shrink-0">
            <Link
              to="/login"
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 border whitespace-nowrap ${
                isScrolled
                  ? 'text-white bg-blue-600 hover:bg-blue-700 border-blue-600'
                  : 'text-white bg-white/15 hover:bg-white/25 border-white/20 hover:border-white/40'
              }`}
            >
              Daftar / Masuk
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-1.5 rounded-full transition-all ${
              isScrolled
                ? 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed top-[72px] left-4 right-4 sm:left-6 sm:right-6
                     bg-black/80 backdrop-blur-md
                     rounded-2xl shadow-2xl shadow-black/20 border border-white/10
                     overflow-hidden animate-fade-in"
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-white/90
                             hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-white/90
                             hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {link.name}
                </a>
              )
            )}
            <div className="pt-2 pb-1 border-t border-white/10 mt-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                           bg-white/15 hover:bg-white/25 text-center transition-all duration-200"
              >
                Daftar / Masuk
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
