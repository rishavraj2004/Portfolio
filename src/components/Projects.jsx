import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const mm = gsap.matchMedia();

      // Desktop & Tablets (>= 992px): Horizontal freeze-and-stack scroll
      mm.add('(min-width: 992px)', () => {
        const slides = gsap.utils.toArray('.projects-slide');
        const totalSlides = slides.length;

        // Position slides absolutely on desktop with ascending z-index
        slides.forEach((slide, i) => {
          gsap.set(slide, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            xPercent: i === 0 ? 0 : 100,
            zIndex: i + 1,
            transformOrigin: 'left center',
            willChange: 'transform, filter',
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${window.innerWidth * (totalSlides - 1) * 1.35}`,
            snap: {
              snapTo: 1 / (totalSlides - 1),
              duration: { min: 0.25, max: 0.5 },
              ease: 'power1.inOut',
            },
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < totalSlides; i++) {
          const prevSlide = slides[i - 1];
          const currSlide = slides[i];
          const startTime = i - 1;

          if (i === 1) {
            // Slide 0 (Intro) transitions out to the left while Slide 1 (Project 1) enters
            tl.to(prevSlide, {
              xPercent: -100,
              ease: 'none',
              duration: 1,
            }, startTime);

            tl.to(currSlide, {
              xPercent: 0,
              ease: 'none',
              duration: 1,
            }, startTime);
          } else {
            // Second or subsequent project:
            // Freeze previous project in place and scale down / dim slightly for stacking card effect
            tl.to(prevSlide, {
              scale: 0.94,
              x: '-3.5vw',
              filter: 'brightness(0.72)',
              ease: 'none',
              duration: 1,
            }, startTime);

            // Next project scrolls directly ON TOP of the frozen project
            tl.to(currSlide, {
              xPercent: 0,
              ease: 'none',
              duration: 1,
            }, startTime);
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="projects-section">
      <div ref={trackRef} className="projects-horizontal-track">
        {/* ==============================================================
            SLIDE 1: PROJECTS INTRO PANEL
            ============================================================== */}
        <div className="projects-slide projects-intro-slide">
          <div className="projects-glow" aria-hidden="true" />
          <div className="projects-intro-content">
            <div className="projects-title-wrapper">
              <span className="projects-script-badge" aria-hidden="true">
                What i build
              </span>
              <h2 className="projects-main-title">Projects</h2>
            </div>

            <p className="projects-subtitle">
              Turning sleepless nights into<br />
              commits worth showing off.
            </p>

            {/* Subtle horizontal scroll indicator */}
            <div 
              className="projects-scroll-hint" 
              aria-label="Scroll horizontally to explore projects"
              onClick={() => {
                window.scrollBy({ top: window.innerHeight * 0.95, behavior: 'smooth' });
              }}
            >
              <span>EXPLORE PROJECTS</span>
              <svg 
                className="scroll-hint-arrow" 
                width="20" 
                height="12" 
                viewBox="0 0 20 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M1 6H18M18 6L13 1M18 6L13 11" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ==============================================================
            SLIDE 2: PROJECT 01 - LEETCODE GUARD
            ============================================================== */}
        <div className="projects-slide projects-card-slide">
          <div className="project-card">
            {/* Left Column: Project Copy & Features */}
            <div className="project-card-info">
              {/* Brand Title with Overlapping Script */}
              <div className="project-title-wrapper">
                <h3 className="project-brand-title">Leetcode</h3>
                <span className="project-script-accent" aria-hidden="true">Guard</span>
              </div>

              {/* Taglines */}
              <div className="project-taglines">
                <span className="project-tag-green">Protect Your Streak</span>
                <span className="project-tag-sub">SaaS that matters</span>
              </div>

              {/* Bio / Description */}
              <p className="project-description">
                LeetCode Guard helps developers maintain their daily LeetCode streaks by tracking their problem-solving activity and sending automated Telegram reminders when they haven't solved a problem. It helps users stay consistent with coding practice and avoid losing their streaks due to forgetfulness or busy schedules.
              </p>

              {/* Key Features Block with Bullet Points */}
              <div className="project-features-block">
                <h4 className="project-features-title">Key Features</h4>
                <ul className="project-features-list">
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>Streak Tracking:</strong> Monitors users’ LeetCode problem-solving activity to help them maintain their daily coding streaks.</span>
                  </li>
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>Automated Reminders:</strong> Sends Telegram notifications when users haven't solved a problem, helping them avoid breaking their streaks.</span>
                  </li>
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>LeetCode API Integration:</strong> Uses the LeetCode GraphQL API to retrieve users’ problem-solving statistics and track progress.</span>
                  </li>
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>Admin Dashboard:</strong> Provides secure, JWT-protected admin access to manage users, trigger jobs, and monitor scheduled job execution logs.</span>
                  </li>
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>Tech Stack & Deployment:</strong> Built using Node.js, Express.js, MongoDB, React, and the Telegram Bot API, with the frontend deployed on Netlify and the backend on Render.</span>
                  </li>
                </ul>
              </div>

              {/* Action Link / Live Demo Button */}
              <div className="project-actions">
                <a
                  href="https://leetcode-guard.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-cta-btn"
                  id="leetcode-guard-cta"
                  aria-label="Try LeetCode Guard live application (opens in new tab)"
                >
                  <span>Try Now</span>
                  <svg 
                    className="project-cta-icon" 
                    width="15" 
                    height="15" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: High-Res Laptop Showcase on Wooden Stand */}
            <div className="project-card-media">
              <div className="project-mockup-frame">
                <img 
                  src="/project-leetcode.png" 
                  alt="LeetCode Guard application running on laptop device" 
                  className="project-mockup-img"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==============================================================
            SLIDE 3: PROJECT 02 - TRUST NOTE
            ============================================================== */}
        <div className="projects-slide projects-card-slide">
          <div className="project-card">
            {/* Left Column: Project Copy & Features */}
            <div className="project-card-info">
              {/* Brand Title with Overlapping Script */}
              <div className="project-title-wrapper">
                <h3 className="project-brand-title">Trust</h3>
                <span className="project-script-accent" aria-hidden="true">Note</span>
              </div>

              {/* Taglines */}
              <div className="project-taglines">
                <span className="project-tag-green">Secure, Share, and Trust</span>
                <span className="project-tag-sub">Zero-Knowledge Note Sharing</span>
              </div>

              {/* Bio / Description */}
              <p className="project-description">
                Trust Note is a secure note-sharing platform that allows users to share sensitive text, credentials, and configuration snippets through password-protected note IDs or secret links without requiring recipients to sign up. It also enables registered users to store encrypted notes and .env text in their personal accounts, making it easier to share and manage sensitive information securely.
              </p>

              {/* Key Features Block with Bullet Points */}
              <div className="project-features-block">
                <h4 className="project-features-title">Key Features</h4>
                <ul className="project-features-list">
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>Secure Note Sharing:</strong> Allows users to create and share sensitive text through unique Note IDs and passwords without requiring registration.</span>
                  </li>
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>Password Protection:</strong> Uses SHA-256 hashing to protect note passwords instead of storing them as plain text.</span>
                  </li>
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>Easy Retrieval:</strong> Enables recipients to retrieve and view shared notes through a dedicated interface.</span>
                  </li>
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>User-Friendly Interface:</strong> Features a responsive design, copy-to-clipboard functionality, and client-side input validation.</span>
                  </li>
                  <li className="feature-bullet-item">
                    <span className="feature-bullet-dot" aria-hidden="true" />
                    <span><strong>Tech Stack & Deployment:</strong> Built using web technologies and Firebase Firestore for data storage, with the frontend deployed on Netlify.</span>
                  </li>
                </ul>
              </div>

              {/* Action Link / Live Demo Button */}
              <div className="project-actions">
                <a
                  href="https://trust-note.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-cta-btn"
                  id="trust-note-cta"
                  aria-label="Try Trust Note live application (opens in new tab)"
                >
                  <span>Try Now</span>
                  <svg 
                    className="project-cta-icon" 
                    width="15" 
                    height="15" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: High-Res Laptop Showcase on Wooden Stand */}
            <div className="project-card-media">
              <div className="project-mockup-frame">
                <img 
                  src="/project-trustnote.png" 
                  alt="Trust Note application running on laptop device" 
                  className="project-mockup-img"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
