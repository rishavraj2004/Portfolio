import React, { useState, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 35 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x: xPercent, y: yPercent });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      id="home" 
      className="hero-section"
      style={{
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      }}
    >
      <div className="hero-content-wrapper">
        {/* Role Subtitle */}
        <div className="hero-subtitle">
          <span className="subtitle-web">Web</span>{' '}
          <span className="subtitle-developer">Developer</span>
        </div>

        {/* Big Name Typography with Glowing Bulb dot on 'i' */}
        <div className="hero-name-container">
          {/* Background spotlight and illuminated noise behind the letters */}
          <div className="hero-bulb-backdrop" aria-hidden="true">
            <div className="spotlight-glow" />
            <div className="spotlight-noise" />
          </div>

          <h1 className="hero-first-name" aria-label="Rishav">
            <span className="letter letter-r">R</span>
            <span className="letter letter-i">
              {/* Radial bloom immediately surrounding the bulb */}
              <span className="bulb-bloom" aria-hidden="true" />
              {/* Intense radiant bulb sphere */}
              <span className="bulb-orb" aria-hidden="true" />
              {/* Stem of the letter i */}
              <span className="letter-i-stem">ı</span>
            </span>
            <span className="letter letter-s">s</span>
            <span className="letter letter-h">h</span>
            <span className="letter letter-a">a</span>
            <span className="letter letter-v">v</span>
          </h1>

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
