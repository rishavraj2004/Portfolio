import React from 'react';
import './Projects.css';

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      {/* Subtle ambient accent glow */}
      <div className="projects-glow" aria-hidden="true"></div>

      <div className="projects-container">
        <div className="projects-header">
          {/* Centered title wrapper with script annotation */}
          <div className="projects-title-wrapper">
            <span className="projects-script-badge" aria-hidden="true">
              What i build
            </span>
            <h2 className="projects-main-title">Projects</h2>
          </div>

          {/* 2-line centered subtitle */}
          <p className="projects-subtitle">
            Turning sleepless nights into<br />
            commits worth showing off.
          </p>
        </div>
      </div>
    </section>
  );
}
