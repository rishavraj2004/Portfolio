import React from 'react';
import './Projects.css';

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      {/* Subtle ambient accent glow */}
      <div className="projects-glow" aria-hidden="true"></div>

      <div className="projects-container">
        <div className="projects-header">
          {/* Dashed Bounding Box with 8 Transform Handles */}
          <div className="projects-bounding-box">
            {/* Control handles */}
            <span className="box-handle handle-tl" aria-hidden="true"></span>
            <span className="box-handle handle-tc" aria-hidden="true"></span>
            <span className="box-handle handle-tr" aria-hidden="true"></span>
            <span className="box-handle handle-ml" aria-hidden="true"></span>
            <span className="box-handle handle-mr" aria-hidden="true"></span>
            <span className="box-handle handle-bl" aria-hidden="true"></span>
            <span className="box-handle handle-bc" aria-hidden="true"></span>
            <span className="box-handle handle-br" aria-hidden="true"></span>

            {/* Inner Title Wrapper to lock script badge precisely to "Projects" */}
            <div className="projects-title-wrapper">
              <span className="projects-script-badge" aria-hidden="true">
                What i build
              </span>
              <h2 className="projects-main-title">Projects</h2>
            </div>
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
