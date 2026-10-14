import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar" aria-label="Main Navigation">
        <a href="#home" className="navbar-logo" onClick={() => setActiveTab('Home')}>
          Portfolio
        </a>

        {/* Desktop Links */}
        <ul className="navbar-links">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`navbar-link ${activeTab === item.label ? 'active' : ''}`}
                onClick={() => setActiveTab(item.label)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Toggle */}
        <button
          className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={`mobile-nav-link ${activeTab === item.label ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.label);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
