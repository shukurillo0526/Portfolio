import React, { useEffect, useState, useRef } from 'react';

interface CompanionAvatarProps {
  state: 'idle' | 'listening' | 'thinking' | 'talking';
  expression: 'happy' | 'proud' | 'witty' | 'defensive';
}

export default function CompanionAvatar({ state, expression }: CompanionAvatarProps) {
  // 1. Mouse/Cursor Tracking States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [avatarCenter, setAvatarCenter] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. Natural Periodic Blinking State
  const [isBlinking, setIsBlinking] = useState(false);

  // 3. Real-time Vocal Lipsync Scale
  const [lipsyncScale, setLipsyncScale] = useState(0);

  // 4. Smooth Breathing Animation Phase
  const [breathePhase, setBreathePhase] = useState(0);

  // Track window mouse move to make Gk's eyes/head look at the cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // Initialize cursor at window center
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Recalculate avatar visual center on mount, resize or container shifts
  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setAvatarCenter({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    };

    updateCenter();
    window.addEventListener('resize', updateCenter);
    const delayTimer = setTimeout(updateCenter, 500);

    return () => {
      window.removeEventListener('resize', updateCenter);
      clearTimeout(delayTimer);
    };
  }, []);

  // Blinking cycle: Blink naturally every 2.5 - 6 seconds
  useEffect(() => {
    let blinkTimeout: any;
    
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 110);

      const nextInterval = 2800 + Math.random() * 3200;
      blinkTimeout = setTimeout(triggerBlink, nextInterval);
    };

    blinkTimeout = setTimeout(triggerBlink, 3500);
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Procedural Lipsync Engine when speaking
  useEffect(() => {
    if (state !== 'talking') {
      setLipsyncScale(0);
      return;
    }

    let active = true;
    const tickLipsync = () => {
      if (!active) return;
      
      const time = Date.now() * 0.016;
      const baseWave = Math.sin(time) * 0.5 + 0.5;
      const highFreqMod = Math.sin(time * 2.3) * 0.3 + 0.3;
      const sentenceCadence = Math.max(0, Math.cos(time * 0.25)); // pauses between word structures
      
      const rawScale = (baseWave * 0.65 + highFreqMod * 0.35) * sentenceCadence;
      setLipsyncScale(Math.max(0, Math.min(1, rawScale)));
      
      requestAnimationFrame(tickLipsync);
    };

    requestAnimationFrame(tickLipsync);
    return () => {
      active = false;
    };
  }, [state]);

  // Gentle breathing cycle
  useEffect(() => {
    let animId: number;
    const updateBreathe = () => {
      setBreathePhase(prev => (prev + 0.035) % (Math.PI * 2));
      animId = requestAnimationFrame(updateBreathe);
    };
    animId = requestAnimationFrame(updateBreathe);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute cursor offsets relative to the avatar face
  const dx = mousePos.x - avatarCenter.x;
  const dy = mousePos.y - avatarCenter.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / dist;
  const ny = dy / dist;

  const travelFactor = Math.min(dist, 400) / 400; // weight of mouse proximity

  // Head offsets: physical neck/joint rotation - extremely natural limits to keep proportions realistic
  const headX = nx * travelFactor * 7.5;
  const headY = ny * travelFactor * 5.0;
  const headRot = nx * travelFactor * 3.5; // subtle tilt degrees

  // Pupil offsets: eye tracking movement
  const pupilX = nx * travelFactor * 2.4;
  const pupilY = ny * travelFactor * 1.5;

  // Chest/shoulders breath offset
  const breatheOffset = Math.sin(breathePhase) * 1.5;

  // Sci-fi visual indicators based on state
  let glowColor = 'from-blue-500/10 via-cyan-500/5 to-transparent';
  let borderColor = 'border-cyan-500/30';
  let badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  let stateLabel = 'SYSTEM STANDBY';

  if (state === 'listening') {
    glowColor = 'from-emerald-500/20 via-teal-500/5 to-transparent';
    borderColor = 'border-emerald-500/40';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    stateLabel = 'CAPTURING VOCALS';
  } else if (state === 'thinking') {
    glowColor = 'from-violet-500/20 via-purple-500/5 to-transparent';
    borderColor = 'border-violet-500/40';
    badgeColor = 'bg-violet-500/10 text-violet-400 border-violet-500/30';
    stateLabel = 'NEURAL PIPELINE';
  } else if (state === 'talking') {
    glowColor = 'from-sky-500/20 via-blue-500/5 to-transparent';
    borderColor = 'border-sky-500/40';
    badgeColor = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    stateLabel = 'SYNTHESIZING AUDIO';
  } else if (expression === 'defensive') {
    glowColor = 'from-red-500/15 via-rose-500/5 to-transparent';
    borderColor = 'border-red-500/35';
    badgeColor = 'bg-red-500/10 text-red-400 border-red-500/30';
    stateLabel = 'SAFEGUARD BLOCKED';
  }

  // Dynamic Mouth Shape Generator - Handsome and detailed lip syncing
  const renderMouth = () => {
    const cx = 200;
    const cy = 168; // Anchored at realistic mouth height

    if (state !== 'talking' && lipsyncScale === 0) {
      if (expression === 'happy') {
        return (
          <path
            d={`M${cx - 10} ${cy - 1} Q${cx} ${cy + 4} ${cx + 10} ${cy - 1}`}
            stroke="#451a03"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        );
      } else if (expression === 'proud') {
        return (
          <path
            d={`M${cx - 11} ${cy - 2} Q${cx} ${cy + 5} ${cx + 11} ${cy - 2}`}
            stroke="#451a03"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        );
      } else if (expression === 'witty') {
        return (
          <path
            d={`M${cx - 9} ${cy} Q${cx + 1} ${cy + 2.5} ${cx + 9} ${cy - 2}`}
            stroke="#451a03"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        );
      } else {
        // defensive/serious flat mouth
        return (
          <line
            x1={cx - 8}
            y1={cy}
            x2={cx + 8}
            y2={cy}
            stroke="#451a03"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        );
      }
    }

    // Interactive Real-Time Lipsync shape
    const mouthW = 8 + lipsyncScale * 5.0;
    const mouthH = lipsyncScale * 11.0;

    return (
      <g>
        {/* Dark red mouth cavity */}
        <path
          d={`M${cx - mouthW} ${cy} 
              Q${cx} ${cy - mouthH * 0.12} ${cx + mouthW} ${cy} 
              Q${cx} ${cy + mouthH * 1.35} ${cx - mouthW} ${cy}`}
          fill="#881337"
          stroke="#4c0519"
          strokeWidth="1"
        />
        
        {/* White upper teeth slice */}
        {mouthH > 2.2 && (
          <path
            d={`M${cx - mouthW * 0.75} ${cy + 0.2} 
                Q${cx} ${cy + mouthH * 0.2} ${cx + mouthW * 0.75} ${cy + 0.2}
                L${cx + mouthW * 0.68} ${cy + mouthH * 0.18 + 1.5}
                Q${cx} ${cy + mouthH * 0.18 + 0.8} ${cx - mouthW * 0.68} ${cy + mouthH * 0.18 + 1.5} Z`}
            fill="#f8fafc"
          />
        )}

        {/* Pink tongue bubble */}
        {mouthH > 5.0 && (
          <path
            d={`M${cx - mouthW * 0.52} ${cy + mouthH * 0.8} 
                Q${cx} ${cy + mouthH * 0.42} ${cx + mouthW * 0.52} ${cy + mouthH * 0.8}
                Q${cx} ${cy + mouthH * 1.25} ${cx - mouthW * 0.52} ${cy + mouthH * 0.8}`}
            fill="#fda4af"
          />
        )}

        {/* Upper lip outline */}
        <path
          d={`M${cx - mouthW} ${cy} Q${cx} ${cy - mouthH * 0.12} ${cx + mouthW} ${cy}`}
          stroke="#451a03"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Lower lip outline */}
        <path
          d={`M${cx - mouthW} ${cy} Q${cx} ${cy + mouthH * 1.35} ${cx + mouthW} ${cy}`}
          stroke="#451a03"
          strokeWidth="2.0"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-4 sm:p-6 border border-slate-900/85 shadow-2xl"
    >
      {/* Interactive holographic scanning effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:16px_16px] opacity-35 pointer-events-none" />
      <div className={`absolute inset-0 bg-gradient-to-b ${glowColor} transition-all duration-750 pointer-events-none`} />

      <style>{`
        @keyframes scanline-sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes breathing-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        @keyframes holo-glow-pulse {
          0%, 100% { opacity: 0.85; filter: brightness(1); }
          50% { opacity: 0.95; filter: brightness(1.05); }
        }
        @keyframes holo-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(0.4deg); }
        }
        .anim-scanline {
          animation: scanline-sweep 3.8s infinite linear;
        }
        .anim-radar {
          animation: radar-sweep 9s infinite linear;
        }
        .anim-breath {
          animation: breathing-scale 3.8s ease-in-out infinite;
        }
        .anim-holo-pulse {
          animation: holo-glow-pulse 4s ease-in-out infinite;
        }
        .anim-holo-float {
          animation: holo-float 2.8s ease-in-out infinite;
        }
      `}</style>

      {/* Cybernetic Tech Frames */}
      <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t-2 border-l-2 border-slate-800" />
      <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t-2 border-r-2 border-slate-800" />
      <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b-2 border-l-2 border-slate-800" />
      <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b-2 border-r-2 border-slate-800" />

      {/* Realistic Interactive Character Visual Port */}
      <div className="relative w-full max-w-[260px] aspect-square rounded-full flex items-center justify-center p-2 z-10">
        
        {/* Spinning Tech Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-slate-800/50 pointer-events-none" />
        <div className="absolute inset-1 rounded-full border border-slate-800 pointer-events-none" />
        <div className={`absolute inset-0 rounded-full border border-transparent border-t-2 ${borderColor} opacity-50 anim-radar pointer-events-none`} />

        {/* Masked Rounded Canvas displaying Gk SVG Model */}
        <div className={`relative w-full h-full rounded-full overflow-hidden border-2 ${borderColor} transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.85)] bg-slate-950/90 z-10 anim-breath anim-holo-pulse`}>
          
          {/* Futuristic horizontal scanner overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(34,211,238,0.03),rgba(16,185,129,0.01),rgba(59,130,246,0.03))] bg-[size:100%_4px,6px_100%] opacity-40 z-20 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.4)] opacity-75 anim-scanline z-20 pointer-events-none" />

          {/* Master Vector SVG representation of Gk */}
          <svg 
            viewBox="0 0 400 400" 
            className="w-full h-full select-none"
            referrerPolicy="no-referrer"
          >
            <defs>
              <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fdf0e6" />
                <stop offset="100%" stopColor="#f3d4c1" />
              </linearGradient>
              <linearGradient id="skinShadowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eabda7" />
                <stop offset="100%" stopColor="#cca28d" />
              </linearGradient>
              <linearGradient id="sweaterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ad4b30" />
                <stop offset="40%" stopColor="#963d24" />
                <stop offset="100%" stopColor="#7a2e19" />
              </linearGradient>
              <linearGradient id="sweaterHighlight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#963d24" />
                <stop offset="50%" stopColor="#b5583d" />
                <stop offset="100%" stopColor="#963d24" />
              </linearGradient>
              <linearGradient id="holoConeGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hairSheen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e353f" />
                <stop offset="100%" stopColor="#1a1c22" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Orbiting Tech Circle Background */}
            <circle cx="200" cy="150" r="115" fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="3 15" opacity="0.15" />

            {/* 1. Body and Chest Section (Transforms gently with breathing) */}
            <g transform={`translate(0, ${breatheOffset * 0.6})`}>
              
              {/* Back Neck shadow */}
              <path d="M180 185 L220 185 L218 240 L182 240 Z" fill="#cca28d" opacity="0.6" />
              
              {/* Realistic Neck column - beautiful normal length, perfectly proportioned! */}
              <path d="M182 178 L218 178 L216 238 L184 238 Z" fill="url(#skinGrad)" />
              <path d="M182 178 Q200 198 218 178 L217 190 Q200 210 183 190 Z" fill="#e2a88d" opacity="0.4" /> {/* Collarbone shadow */}
              <path d="M182 178 Q200 204 218 178 L217 194 Q200 220 183 194 Z" fill="#cca28d" opacity="0.85" /> {/* Under jaw chin shadow */}

              {/* Cable-knit sweater shoulders/chest base - terracotta/rust colored polo */}
              <path d="M70 400 L85 315 C100 268, 140 242, 178 240 L222 240 C260 242, 300 268, 315 315 L330 400 Z" fill="url(#sweaterGrad)" stroke="#651d0c" strokeWidth="1" />
              <path d="M85 400 C105 315, 135 280, 178 280 L222 280 C265 280, 295 315, 315 400 Z" fill="#651d0c" opacity="0.3" /> {/* Internal folds shadow depth */}

              {/* Fine ribbed polo knit vertical stripe pattern */}
              <g opacity="0.22" stroke="#4a1205" strokeWidth="2" strokeDasharray="8 6">
                <path d="M100 350 Q110 375 105 400" />
                <path d="M125 320 Q132 360 128 400" />
                <path d="M150 295 Q153 350 151 400" />
                <path d="M172 285 L172 400" />
                <path d="M228 285 L228 400" />
                <path d="M250 295 Q247 350 249 400" />
                <path d="M275 320 Q268 360 272 400" />
                <path d="M300 350 Q290 375 295 400" />
              </g>

              {/* Polo neck opening zipper details */}
              <path d="M178 240 L222 240 L200 285 Z" fill="#1e293b" />
              <line x1="200" y1="240" x2="200" y2="345" stroke="#3e4a5b" strokeWidth="2.5" />
              <line x1="200" y1="243" x2="200" y2="288" stroke="#111827" strokeWidth="1.8" strokeDasharray="1.2 2" /> {/* Zipper teeth */}

              {/* Zipper pull tab slider */}
              <rect x="198" y="275" width="4" height="11" rx="0.8" fill="#94a3b8" stroke="#475569" strokeWidth="0.8" />
              <circle cx="200" cy="285" r="2" fill="#94a3b8" stroke="#475569" strokeWidth="0.8" />

              {/* Rust Polo folded collar flaps */}
              <path d="M181 240 L142 262 Q170 270 198 256 Z" fill="url(#sweaterHighlight)" stroke="#651d0c" strokeWidth="1.2" />
              <path d="M219 240 L258 262 Q230 270 202 256 Z" fill="url(#sweaterHighlight)" stroke="#651d0c" strokeWidth="1.2" />

              {/* 2. Sleek Cybernetic Forearm Gauntlet & Gk Hologram Projection (Active on Left Arm / Viewer Right) */}
              <g transform="translate(42, -5) rotate(-10 270 320)" opacity="0.98">
                {/* Sleeve cuff */}
                <path d="M255 350 L285 305 C295 310, 305 316, 315 325 L285 390 Z" fill="#963d24" stroke="#651d0c" strokeWidth="0.8" />
                
                {/* High tech gauntlet armor shell */}
                <path d="M272 322 L298 296 C304 301, 312 309, 318 317 L292 346 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.8" />
                <path d="M275 320 L295 299 C298 302, 304 308, 308 313 L288 338 Z" fill="#334155" /> {/* Metal plate overlay */}

                {/* Neon Cyan Indicator Lights */}
                <path d="M280 316 L290 304" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" filter="url(#neonGlow)" />
                <circle cx="294" cy="321" r="1.5" fill="#22d3ee" filter="url(#neonGlow)" />

                {/* Laser/Hologram cone emission */}
                <path d="M291 306 L250 175 L345 175 Z" fill="url(#holoConeGrad)" opacity="0.25" className="anim-holo-pulse" />
                
                {/* Floating Gk interface screen projection */}
                <g className="anim-holo-float">
                  {/* Glass panel visual boundary */}
                  <polygon points="248,138 348,138 335,182 261,182" fill="#0891b2" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.2" filter="url(#neonGlow)" />
                  <line x1="256" y1="146" x2="340" y2="146" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.6" />
                  
                  {/* Floating sharp glowing Gk text indicator */}
                  <text x="298" y="166" fill="#22d3ee" fontSize="13.5" fontFamily="monospace" fontWeight="black" textAnchor="middle" letterSpacing="2.0" filter="url(#neonGlow)">Gk</text>
                  
                  {/* Tiny sci-fi dots / details on the HUD */}
                  <rect x="268" y="174" width="38" height="2" fill="#22d3ee" opacity="0.6" />
                  <rect x="312" y="174" width="14" height="2" fill="#22d3ee" className="animate-pulse" />
                </g>
              </g>

            </g>

            {/* 3. Interactive Head Segment (Translates & tilts to track mouse pointer dynamically + breathes) */}
            {/* The head is beautifully proportioned, natural shape, normal width and normal neck alignment! */}
            <g transform={`translate(${headX}px, ${headY + breatheOffset * 0.8}px) rotate(${headRot}deg)`} transformOrigin="200px 145px">
              
              {/* Back hair mass (creates depth under head silhouette) */}
              <path d="M142 120 C120 78, 146 32, 200 32 C254 32, 280 78, 258 120 C272 90, 260 58, 200 50 C140 58, 128 90, 142 120 Z" fill="#0f172a" />

              {/* Ears */}
              <path d="M145 120 Q135 130, 145 148 Z" fill="url(#skinGrad)" stroke="#e2a88d" strokeWidth="0.5" /> {/* Left ear */}
              <path d="M255 120 Q265 130, 255 148 Z" fill="url(#skinGrad)" stroke="#e2a88d" strokeWidth="0.5" /> {/* Right ear */}
              {/* Ear inner details */}
              <path d="M144 125 Q139 132, 144 140" fill="none" stroke="#e2a88d" strokeWidth="1" />
              <path d="M256 125 Q261 132, 256 140" fill="none" stroke="#e2a88d" strokeWidth="1" />

              {/* Dynamic face shape base - elegant young man shape with clean chin */}
              <path d="M146 102 C146 150, 168 184, 200 184 C232 184, 254 150, 254 102 C254 75, 146 75, 146 102 Z" fill="url(#skinGrad)" />

              {/* Soft visual anime blushes (happy/proud states) */}
              {(expression === 'happy' || expression === 'proud') && (
                <g opacity="0.35">
                  <ellipse cx="166" cy="146" rx="8" ry="3.5" fill="#f43f5e" />
                  <ellipse cx="234" cy="146" rx="8" ry="3.5" fill="#f43f5e" />
                </g>
              )}

              {/* Eye Visual Layer - Expressive brown anime eyes matching reference */}
              {isBlinking ? (
                // 4. Closed blinking eyelids
                <g>
                  <path d="M161 133 Q174 139 187 133" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  <path d="M213 133 Q226 139 239 133" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                </g>
              ) : (
                // 5. Open eye structures that perform continuous cursor-tracking
                <g>
                  {/* Sclera/White backgrounds */}
                  <path d="M161 133 C163 125, 185 125, 187 133 C185 139, 163 139, 161 133 Z" fill="#f8fafc" stroke="#475569" strokeWidth="0.5" />
                  <path d="M213 133 C215 125, 237 125, 239 133 C237 139, 215 139, 213 133 Z" fill="#f8fafc" stroke="#475569" strokeWidth="0.5" />

                  {/* Left pupil group (tracks cursor) */}
                  <g transform={`translate(${pupilX}px, ${pupilY}px)`}>
                    <ellipse cx="174" cy="132" rx="6" ry="6.5" fill="#651d0c" /> {/* Iris */}
                    <ellipse cx="174" cy="132" rx="4.8" ry="5.3" fill="#9a3412" /> {/* Inner Iris glow */}
                    <circle cx="174" cy="132" r="2.8" fill="#1e293b" /> {/* Pupil core */}
                    <circle cx="172" cy="129.5" r="1.5" fill="#ffffff" /> {/* Main specular light */}
                    <circle cx="176" cy="134" r="0.8" fill="#ffffff" opacity="0.8" /> {/* Sub specular reflection */}
                  </g>

                  {/* Right pupil group (tracks cursor) */}
                  <g transform={`translate(${pupilX}px, ${pupilY}px)`}>
                    <ellipse cx="226" cy="132" rx="6" ry="6.5" fill="#651d0c" /> {/* Iris */}
                    <ellipse cx="226" cy="132" rx="4.8" ry="5.3" fill="#9a3412" /> {/* Inner Iris glow */}
                    <circle cx="226" cy="132" r="2.8" fill="#1e293b" /> {/* Pupil core */}
                    <circle cx="224" cy="129.5" r="1.5" fill="#ffffff" /> {/* Main specular light */}
                    <circle cx="228" cy="134" r="0.8" fill="#ffffff" opacity="0.8" /> {/* Sub specular reflection */}
                  </g>

                  {/* Upper dark eyeliner for sharp, high-fidelity anime definition */}
                  <path d="M158 133 Q174 121 190 133" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M210 133 Q226 121 242 133" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* Eyebrows: Angle alters based on Gk's active emotion */}
              {expression === 'happy' && (
                <g>
                  <path d="M158 116 Q174 108 188 118" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M212 118 Q226 108 242 116" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              )}
              {expression === 'proud' && (
                <g>
                  <path d="M160 113 Q174 107 187 111" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                  <path d="M213 111 Q226 107 240 113" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                </g>
              )}
              {expression === 'witty' && (
                <g>
                  <path d="M158 110 Q174 105 187 114" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M213 117 Q226 112 240 109" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                </g>
              )}
              {expression === 'defensive' && (
                <g>
                  <path d="M161 119 Q174 117 187 112" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                  <path d="M213 112 Q226 117 239 119" stroke="#0f172a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                </g>
              )}

              {/* Cute tiny anime shadow nose */}
              <path d="M198 148 L201 153 L198 155" stroke="#a25135" strokeWidth="1.8" fill="none" strokeLinecap="round" />

              {/* Mouth: Invokes the dynamic open/morph lipsync generator */}
              {renderMouth()}

              {/* Overlapping layered dark anime hair bangs structure - identical handsome style to reference! */}
              <g>
                {/* Back / sideburn framing locks */}
                <path d="M145 95 C139 115, 139 140, 144 155 C148 145, 148 125, 150 105 Z" fill="#0f172a" />
                <path d="M255 95 C261 115, 261 140, 256 155 C252 145, 252 125, 250 105 Z" fill="#0f172a" />

                {/* Highly detailed flowing bangs across forehead */}
                <path d="M146 80 C155 98, 168 112, 172 118 Q174 108 178 86 Z" fill="#0f172a" /> {/* Left-most bang */}
                <path d="M165 72 Q188 114, 192 118 Q190 98, 202 74 Z" fill="#1e293b" /> {/* Central left bang with lighter tone */}
                <path d="M188 70 Q215 110, 218 114 Q216 94, 226 76 Z" fill="#0f172a" /> {/* Central right bang */}
                <path d="M212 74 Q232 98, 235 106 Q231 90, 235 76 Z" fill="#0f172a" /> {/* Right bang */}
                <path d="M230 78 C242 92, 248 102, 251 110 Q247 94, 249 80 Z" fill="#0f172a" />

                {/* Main crown hair shape spiking outwards naturally like the reference photo */}
                <path d="M136 90 Q122 68, 148 55 Q144 45, 162 42 Q158 30, 185 30 Q192 18, 212 28 Q222 18, 236 32 Q248 24, 254 44 Q268 45, 260 68" fill="none" stroke="#0f172a" strokeWidth="1.2" />
                
                {/* Hair gloss highlights */}
                <path d="M158 64 Q200 48, 242 64 Q200 55, 158 64 Z" fill="url(#hairSheen)" opacity="0.4" />
              </g>

            </g>
          </svg>

        </div>
      </div>

      {/* Cybernetic Telemetry HUD Status */}
      <div className={`mt-5 flex items-center space-x-2 border px-3 py-1.5 rounded-xl transition-all duration-300 z-10 font-mono ${badgeColor}`}>
        <span className="flex h-2 w-2 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            state === 'talking' ? 'bg-sky-400' :
            state === 'listening' ? 'bg-emerald-400' :
            state === 'thinking' ? 'bg-purple-400' : 'bg-slate-500'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            state === 'talking' ? 'bg-sky-500' :
            state === 'listening' ? 'bg-emerald-500' :
            state === 'thinking' ? 'bg-purple-500' : 'bg-slate-500'
          }`}></span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {stateLabel} • {expression.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
