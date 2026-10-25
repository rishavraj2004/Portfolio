import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

/* ───────────── Physics & Timing Configuration ───────────── */
const CONFIG = {
  gravity: 2400,     // px/s² — dot fall speed
  restitution: 0.40, // energy retained per bounce on baseline (0–1)
  bounces: 2,        // number of bounces on baseline before hop
  overshoot: 0.32,   // settle overshoot, × dot diameter
  dotRatio: 0.28,    // dot diameter, × font-size (matches bold bulb orb in old version)
  dotGap: 0.08,      // stem-to-dot gap, × font-size
  swingLeft: 76,     // ° the "i" tips left (reveals R)
  swingRight: 78,    // ° the "i" tips right (reveals "shav")
  swingSpeed: 1.0,   // swing speed multiplier
  pause: 0.22,       // s pause between dot settle/stem reveal and swing
  rajDuration: 1.15, // s duration to write cursive "Raj"
};

const KERN = { R: 0, i: 0 };

const clamp = (x) => Math.min(1, Math.max(0, x));
const EASE = {
  out: (k) => 1 - (1 - k) ** 2,
  io: (k) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2),
};

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 35 });
  const [isIHovered, setIsIHovered] = useState(false);

  // Animation states
  const [ready, setReady] = useState(false);
  const [stemReady, setStemReady] = useState(false);
  const [rishavDone, setRishavDone] = useState(false);
  const [rajDone, setRajDone] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [penPos, setPenPos] = useState(null);

  // Element refs
  const left = useRef(null);
  const right = useRef(null);
  const slot = useRef(null);
  const glyph = useRef(null);
  const base = useRef(null);
  const dot = useRef(null);
  const rajPath = useRef(null);
  const rajLengthRef = useRef(0);

  // Mouse move handler for ambient lighting
  useEffect(() => {
    const handleMouseMove = (e) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x: xPercent, y: yPercent });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main reveal animation loop
  useEffect(() => {
    let raf = 0;
    let off = false;
    let gap = 0;
    let floorY = 0;
    const { gravity: g, restitution: e, bounces, overshoot, swingLeft: L, swingRight: R } = CONFIG;

    // Layout calculation from live font metrics
    const layout = () => {
      if (!glyph.current || !slot.current || !base.current) return;
      const cs = getComputedStyle(glyph.current);
      const size = parseFloat(cs.fontSize) || 120;
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.font = `${cs.fontWeight || 900} ${size}px ${cs.fontFamily}`;
      const m = ctx.measureText("ı");

      const d = size * CONFIG.dotRatio;
      gap = size * CONFIG.dotGap;
      const stemHeight = m.actualBoundingBoxAscent || (size * 0.54);
      const stemWidth = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) || m.width || (size * 0.23);

      const baseY = base.current.getBoundingClientRect().bottom - slot.current.getBoundingClientRect().top;
      const set = (k, v) => slot.current.style.setProperty(k, `${v}px`);

      set("--d", d);
      set("--gap", gap);
      set("--stem-h", stemHeight);

      // Horizontally center the dot over the stem of 'ı'
      const dotX = (glyph.current.offsetWidth || stemWidth) / 2 - d / 2;
      set("--x", dotX);

      // Resting Y: dot rests 'gap' above the stem top
      // stem top is at baseY - stemHeight, so dot top is at baseY - stemHeight - gap - d
      const restingY = baseY - stemHeight - gap - d;
      set("--y", restingY);
      set("--floor", baseY); // rotation pivot at baseline

      // Baseline relative to restingY:
      // When y = floorY, dot bottom touches baseY
      floorY = stemHeight + gap;
    };

    const wipe = (pl, pr) => {
      if (left.current) left.current.style.setProperty("--c", 100 - pl * 112);
      if (right.current) right.current.style.setProperty("--c", 100 - pr * 112);
    };

    // Swing timeline: [duration s, from°, to°, ease]
    const SEGS = [
      [0.14, 0, 5, "out"],        // small lean right (anticipation)
      [0.68, 5, -L, "io"],        // tip left → reveals R
      [0.20, -L, -L, "io"],       // hold
      [0.96, -L, R, "io"],        // sweep right → reveals "shav"
      [0.12, R, R, "io"],         // hold
    ];
    const total = SEGS.reduce((s, x) => s + x[0], 0);
    const angle = (t) => {
      if (t <= 0) return 0;
      for (const [d, a, b, ez] of SEGS) {
        if (t < d) return a + (b - a) * EASE[ez](t / d);
        t -= d;
      }
      return R * Math.exp(-6 * t) * Math.cos(9.5 * t);
    };

    const finish = () => {
      if (slot.current) slot.current.style.transform = "none";
      if (glyph.current) {
        glyph.current.style.opacity = "1";
        glyph.current.style.transform = "none";
      }
      wipe(1, 1);
      setStemReady(true);
      setRishavDone(true);
      setRajDone(true);
      setAllDone(true);
    };

    const start = async () => {
      try {
        await Promise.race([
          Promise.all([
            document.fonts.load("900 100px Poppins", "Rıshav"),
            document.fonts.load("400 100px 'Alex Brush'", "Raj"),
          ]),
          new Promise((r) => setTimeout(r, 1200)),
        ]);
      } catch {
        /* proceed with available fonts */
      }
      if (off) return;

      setStemReady(false);
      setRishavDone(false);
      setRajDone(false);
      setAllDone(false);
      setRipples([]);
      layout();
      wipe(0, 0);

      // Measure Raj handwriting path
      if (rajPath.current) {
        const len = rajPath.current.getTotalLength();
        rajLengthRef.current = len;
        rajPath.current.style.strokeDasharray = `${len}`;
        rajPath.current.style.strokeDashoffset = `${len}`;
      }

      setReady(true);
      window.addEventListener("resize", layout);

      const el = dot.current;
      if (!el) return;

      // Accessibility: reduced motion skip
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.classList.add("live");
        finish();
        return;
      }

      const r = el.getBoundingClientRect();
      const d = r.width || 35;
      const F = floorY;                       // dot impacts at the baseline
      const S = -(r.bottom + 120);            // drops from above viewport
      const v0 = Math.sqrt(2 * g * (F - S));

      let y = S, v = 0, hits = 0, squash = 0, phase = "fall", apex = 0, t = 0;
      let ts = 0, pl = 0, pr = 0;
      let last = performance.now();

      el.style.transform = `translate3d(0,${S}px,0)`;
      el.classList.add("live");

      // Initially hide stem 'ı'
      if (glyph.current) {
        glyph.current.style.opacity = "0";
        glyph.current.style.transform = "scaleY(0)";
        glyph.current.style.transformOrigin = "bottom center";
      }

      const tick = (now) => {
        if (off) return;
        const dt = Math.min((now - last) / 1000, 1 / 30);
        last = now;

        // ────────── Phase 6: Write "Raj" cursive handwriting ──────────
        if (phase === "write_raj") {
          t += dt;
          const p = Math.min(t / CONFIG.rajDuration, 1);
          const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          const len = rajLengthRef.current;

          if (rajPath.current && len > 0) {
            rajPath.current.style.strokeDashoffset = `${len * (1 - ease)}`;
            const pt = rajPath.current.getPointAtLength(ease * len);
            setPenPos({ x: (pt.x / 260) * 100, y: (pt.y / 140) * 100 });
          }

          if (p >= 1) {
            setPenPos(null);
            finish();
            return;
          }
          raf = requestAnimationFrame(tick);
          return;
        }

        // ────────── Phase 5: "Next All" — swing left & right to reveal letters ──────────
        if (phase === "swing") {
          ts += dt * CONFIG.swingSpeed;
          const a = angle(ts);
          pl = Math.max(pl, clamp(-a / L));
          pr = Math.max(pr, clamp((a - 5) / (R - 5)));
          slot.current.style.transform = `rotate(${a}deg)`;
          wipe(pl, pr);

          if (ts > total + 1.15) {
            slot.current.style.transform = "none";
            wipe(1, 1);
            setRishavDone(true);
            phase = "write_raj";
            t = 0;
          }
          raf = requestAnimationFrame(tick);
          return;
        }

        // ────────── Phase 4: Brief pause with fully revealed 'i' ──────────
        if (phase === "swing_pause") {
          t += dt;
          if (t >= CONFIG.pause) {
            phase = "swing";
            ts = 0;
          }
          raf = requestAnimationFrame(tick);
          return;
        }

        // ────────── Phase 3: Dot settle & overshoot above the stem ──────────
        let trail = 0;
        if (phase === "settle") {
          t += dt;
          const k = Math.min(t / 0.24, 1);
          y = apex * (1 - k) ** 3;
          if (k === 1) {
            el.style.transform = "none";
            el.style.setProperty("--trail", "0px");
            phase = "swing_pause";
            t = 0;
            raf = requestAnimationFrame(tick);
            return;
          }
        } else {
          // Physics step for fall and hop
          v += g * dt;
          y += v * dt;

          // ────────── Phase 2: Hop up from floor + Reveal stem of 'i' ──────────
          if (phase === "hop") {
            const hopProgress = clamp(1 - (y / F));
            if (glyph.current) {
              glyph.current.style.opacity = `${Math.min(1, hopProgress * 1.5)}`;
              glyph.current.style.transform = `scaleY(${Math.max(0.001, hopProgress)})`;
            }

            if (v >= 0) {
              phase = "settle";
              apex = y;
              t = 0;
              v = 0;
              if (glyph.current) {
                glyph.current.style.opacity = "1";
                glyph.current.style.transform = "none";
              }
              setStemReady(true);
            }
          } else if (phase === "fall" && y >= F) {
            // ────────── Phase 1: Dot Bounces on the baseline floor ──────────
            const speed = v;
            const p = speed / v0;
            y = F;
            hits++;
            squash = Math.min(0.40, 0.40 * p);
            setRipples((rs) => [...rs, p]);

            if (hits <= bounces) {
              v = -speed * e;
            } else {
              // Final rebound launches dot up to resting height (y = 0)
              v = -Math.sqrt(2 * g * (F + overshoot * d));
              squash = Math.max(squash, 0.22);
              phase = "hop";
            }
          }

          if (phase === "fall" && v > 0) {
            trail = Math.min(v * 0.045, 120);
          }
        }

        squash *= Math.exp(-dt * 16);
        const stretch = Math.min(Math.abs(v) / 5000, 0.28);
        const sy = (1 + stretch) * (1 - squash);
        const sx = (1 + squash * 0.9) / (1 + stretch);
        el.style.transform = `translate3d(0,${y}px,0) scale(${sx},${sy})`;
        el.style.setProperty("--trail", `${trail}px`);

        raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    start();

    return () => {
      off = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
    };
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
        {/* Big Name Typography with Physics Reveal Animation */}
        <div className="hero-name-container">
          <h1 
            className={`hero-first-name${ready ? ' ready' : ''}${allDone ? ' all-done' : ''}`} 
            aria-label="Rishav"
          >
            {/* Wiping mask for 'R' */}
            <span 
              ref={left} 
              className="hero-wipe hero-wipe-left" 
              style={{ marginRight: `${KERN.R}em` }} 
              aria-hidden="true"
            >
              <span className="letter letter-r">R</span>
            </span>

            {/* Rotating Slot for 'i' */}
            <span 
              ref={slot} 
              className={`hero-slot ${isIHovered ? 'i-hovered' : ''}`} 
              style={{ marginRight: `${KERN.i}em` }}
              aria-hidden="true"
              onMouseEnter={() => allDone && setIsIHovered(true)}
              onMouseLeave={() => allDone && setIsIHovered(false)}
            >
              {/* Stem of the letter 'i' (revealed after dot bounces) */}
              <span ref={glyph} className="hero-glyph">
                <span className="letter-i-stem">ı</span>
              </span>

              {/* Baseline alignment probe */}
              <i ref={base} className="hero-base" />

              {/* Dot of the letter 'i' (lights turned off) */}
              <span ref={dot} className="hero-dot" />

              {/* Impact shockwave ripples on the floor */}
              {ripples.map((p, n) => (
                <span key={n} className="hero-ripple" style={{ '--p': p }} />
              ))}
            </span>

            {/* Wiping mask for 'shav' */}
            <span 
              ref={right} 
              className="hero-wipe hero-wipe-right" 
              aria-hidden="true"
            >
              <span className="letter letter-s">s</span>
              <span className="letter letter-h">h</span>
              <span className="letter letter-a">a</span>
              <span className="letter letter-v">v</span>
            </span>
          </h1>

          {/* Overlapping cursive script: "Raj" — written smoothly after Rishav reveal */}
          <div 
            className={`hero-last-name-script ${rishavDone ? 'visible' : ''} ${rajDone ? 'written' : ''}`}
            aria-label="Raj"
          >
            <svg 
              className="raj-svg" 
              viewBox="0 0 260 140" 
              aria-hidden="true"
            >
              <defs>
                <mask id="raj-mask">
                  <path 
                    ref={rajPath}
                    d="M 28,45 C 24,65 24,95 30,118 M 26,55 C 38,32 74,28 90,44 C 102,56 98,74 82,82 C 68,88 50,88 38,86 M 60,84 C 74,92 90,108 104,120 M 106,105 C 118,88 136,84 148,92 C 158,100 154,118 138,120 C 124,122 116,108 128,94 C 138,84 152,90 152,118 M 156,100 C 168,86 182,88 184,100 C 186,118 178,140 160,146 C 146,152 142,138 156,124 C 168,112 182,100 194,92 M 184,65 L 184,66"
                    fill="none"
                    stroke="white"
                    strokeWidth="42"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </mask>
              </defs>
              <text 
                x="20" 
                y="112" 
                className="raj-svg-text" 
                mask={rajDone ? undefined : "url(#raj-mask)"}
              >
                Raj
              </text>
            </svg>

            {/* Glowing handwriting pen tip during the cursive writing animation */}
            {penPos && !rajDone && (
              <span 
                className="raj-pen-glow" 
                style={{ left: `${penPos.x}%`, top: `${penPos.y}%` }} 
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        {/* Action Button: rendered after all animations complete */}
        <div className={`hero-action-container ${allDone ? 'visible' : ''}`}>
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

      {/* Scroll Down Indicator: rendered after all animations complete */}
      <a 
        href="#about" 
        className={`hero-scroll-indicator ${allDone ? 'visible' : ''}`}
        id="scroll-down-btn"
        aria-label="Scroll down"
        onClick={(e) => {
          e.preventDefault();
          const nextSec = document.getElementById('about');
          if (nextSec) {
            nextSec.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
          }
        }}
      >
        <span className="scroll-text">SCROLL</span>
        <svg 
          className="scroll-chevron" 
          width="16" 
          height="10" 
          viewBox="0 0 16 10" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path 
            d="M2 2L8 8L14 2" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </a>
    </section>
  );
}
