import React from 'react';
import './About.css';

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Left Column: Text & Content */}
        <div className="about-text-content">
          <h2 className="about-greeting">Hello!</h2>

          <div className="about-title-row">
            <h3 className="about-name-title">I am Rishav Raj</h3>
            
            {/* Hand-drawn "About Me" annotation with arrow */}
            <div className="about-badge-annotation" aria-hidden="true">
              <span className="about-script-text">About Me</span>
              <svg 
                className="about-doodle-arrow" 
                width="32" 
                height="46" 
                viewBox="0 0 32 46" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M16 2 C18 8, 26 12, 23 18 C20 24, 11 23, 14 30 C16 35, 17 40, 17 42" 
                  stroke="#1c1d22" 
                  strokeWidth="1.9" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M10 35 L17 42.5 L24 35.5" 
                  stroke="#1c1d22" 
                  strokeWidth="1.9" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <p className="about-bio">
            I'm a passionate and motivated Computer Science student with a strong interest in backend development, AI engineering, and problem-solving. I enjoy building practical projects, exploring emerging technologies, and turning innovative ideas into real-world solutions. With a strong foundation in data structures and algorithms, web development, and AI-powered applications, I'm always eager to take on new challenges that push my technical skills and creativity.
          </p>
        </div>

        {/* Right Column: Sketch Portrait */}
        <div className="about-image-column">
          <div className="about-portrait-frame">
            <img 
              src="/about-portrait.png" 
              alt="Rishav Raj portrait illustration" 
              className="about-portrait-img unselectable"
              draggable="false"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
