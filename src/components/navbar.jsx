import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const GlowingButton = ({ children, variant = 'primary', className = '', to, ...props }) => {
  const baseClasses = "px-6 py-2.5 rounded-full font-medium transition-all duration-300 relative overflow-hidden group inline-flex items-center justify-center";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25",
    secondary: "border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
  };

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </>
  );

  // If "to" is provided, render a <Link>
  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
        {content}
      </Link>
    );
  }

  // Otherwise render a <button>
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {content}
    </button>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Pricing', href: '#pricing' }
  ];

  const AnimatedLogo = () => (
    <div className="flex items-center space-x-3 group cursor-pointer">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-110">
          <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-100" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          FutureForge
        </span>
      </div>
    </div>
  );

  const NavLink = ({ item, mobile = false }) => (
    <a
      href={item.href}
      className={`
        ${mobile 
          ? 'block py-3 px-4 text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200' 
          : 'relative text-white/80 hover:text-white font-medium transition-all duration-200 group'
        }
      `}
      onClick={() => mobile && setIsMenuOpen(false)}
    >
      {item.name}
      {!mobile && (
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
      )}
    </a>
  );

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-purple-900/5 backdrop-blur-lg border-b border-white/10 shadow-2xl' 
          : 'bg-transparent backdrop-blur-lg'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <AnimatedLogo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((item, index) => (
                <NavLink key={index} item={item} />
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <GlowingButton variant="secondary" to='/login'>
                Sign In
              </GlowingButton>
              <GlowingButton variant="primary" to='/signup'>
                Get Started
              </GlowingButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`} 
                />
                <X 
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="bg-gray-900/98 backdrop-blur-lg border-t border-white/10">
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((item, index) => (
                <NavLink key={index} item={item} mobile />
              ))}
              
              <div className="pt-4 border-t border-white/10 space-y-3">
                <GlowingButton 
                  variant="secondary" 
                  className="w-full justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </GlowingButton>
                <GlowingButton 
                  variant="primary" 
                  className="w-full justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </GlowingButton>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;