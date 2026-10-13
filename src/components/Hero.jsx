import React, { useState, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 35 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse percentage across window for interactive light reflection
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x: xPercent, y: yPercent });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleResumeClick = () => {
    // Open resume or trigger download
    window.open('#resume', '_blank');
  };

  return (
    <section 
      id="home" 
      className="hero-section"
      style={{
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      }}
    >
      {/* Dynamic ambient cursor illumination */}
      <div className="hero-light-glow" aria-hidden="true" />

      <div className="hero-content-wrapper">
        {/* Role Subtitle */}
        <div className="hero-subtitle">
          <span className="subtitle-web">Web</span>{' '}
          <span className="subtitle-developer">Developer</span>
        </div>

        {/* Big Name Typography */}
        <div className="hero-name-container">
          <h1 className="hero-first-name">Rishav</h1>
          <span className="hero-last-name-script">Raj</span>
        </div>

        {/* Action Button */}
        <div className="hero-action-container">
          <a 
            href="#resume" 
            className="hero-resume-btn"
            id="resume-btn"
            onClick={(e) => {
              e.preventDefault();
              alert("Resume link clicked! You can attach your CV/PDF file here anytime.");
            }}
          >
            <span>Resume</span>
          </a>
        </div>
      </div>
    </section>
  );
}
