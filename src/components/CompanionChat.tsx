import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  RefreshCw,
  Volume2,
  VolumeX,
  Mic,
  Loader2,
  AlertTriangle,
  Cpu,
  MessageSquare,
  Bot,
  Maximize2,
  Minimize2
} from 'lucide-react';
import CompanionAvatar from './CompanionAvatar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  expression?: string;
  toneLabel?: string;
}

export default function CompanionChat() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'hologram' | 'logs'>('hologram');

  // Movable and Mascot State Controllers
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMascotMode, setIsMascotMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    setDragOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Draggable Event Listener Setup
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      handleDragEnd();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      handleDragEnd();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging]);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs to bottom
  useEffect(() => {
    if (activeTab === 'logs' && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);
  
  // Audio Speech States
  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(true);
  const [isSttSupported, setIsSttSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [showIframeNotice, setShowIframeNotice] = useState<boolean>(window.self !== window.top);

  // Manual input fallback state
  const [manualTextInput, setManualTextInput] = useState<string>('');

  // User States: 'idle' | 'speaking' | 'listening'
  const [userState, setUserState] = useState<'idle' | 'speaking' | 'listening'>('idle');

  // Character Animated States: 'idle' | 'listening' | 'thinking' | 'talking'
  const [characterState, setCharacterState] = useState<'idle' | 'listening' | 'thinking' | 'talking'>('idle');
  
  // Expressions: 'happy' | 'proud' | 'witty' | 'defensive'
  const [characterExpression, setCharacterExpression] = useState<'happy' | 'proud' | 'witty' | 'defensive'>('happy');
  const [activeTone, setActiveTone] = useState<string>('Gk Neural Core');
  
  // Real-time voice captions for high-tech HUD immersion
  const [lastUserSpeech, setLastUserSpeech] = useState<string>('');
  const [lastAISpeech, setLastAISpeech] = useState<string>('');

  // Audio Frequency Visualization States
  const [barHeights, setBarHeights] = useState<number[]>(new Array(16).fill(4));

  // Refs for State Control
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const transcriptRef = useRef<string>('');
  const isOpenRef = useRef<boolean>(false);
  const characterStateRef = useRef<'idle' | 'listening' | 'thinking' | 'talking'>('idle');
  const userStateRef = useRef<'idle' | 'speaking' | 'listening'>('idle');
  const silenceTimerRef = useRef<any>(null);
  const visualizerFrameRef = useRef<number | null>(null);
  const speechSafetyTimerRef = useRef<any>(null);
  const speechResumeIntervalRef = useRef<any>(null);

  // Web Audio API continuous analyser and mic stream nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const aiSynthOscRef = useRef<OscillatorNode | null>(null);
  const aiSynthGainRef = useRef<GainNode | null>(null);

  // Dynamic VAD State Variables for high-fidelity telemetry display
  const [vadThreshold, setVadThreshold] = useState<number>(15);
  const [currentEnergy, setCurrentEnergy] = useState<number>(0);
  const [noiseFloor, setNoiseFloor] = useState<number>(8);
  const [vadState, setVadState] = useState<'SILENT' | 'SPEAKING'>('SILENT');

  // Voice Activity Detection (VAD) refs for dynamic thresholding and ambient noise isolation
  const noiseFloorRef = useRef<number>(10);
  const silentFramesCountRef = useRef<number>(0);
  const speakingFramesCountRef = useRef<number>(0);
  const lastTelemetryUpdateRef = useRef<number>(0);

  // Initialize Core Audio Context & Analyser Node
  const initAudioEngine = () => {
    if (audioCtxRef.current && analyserRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Perfect frequency bands (32 bins total, we'll map 16 of them)
      analyserRef.current = analyser;
    } catch (e) {
      console.warn("Failed to initialize core Web Audio API engine:", e);
    }
  };

  // Connect microphone stream directly to the Analyser node in real-time
  const initMicAnalyser = async () => {
    initAudioEngine();
    if (!audioCtxRef.current || !analyserRef.current) return;
    if (micStreamRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const source = ctx.createMediaStreamAudioSource(stream);
      source.connect(analyserRef.current);
      micSourceRef.current = source;
      
      console.log("Real-time microphone stream connected to Web Audio Analyser.");
    } catch (err) {
      console.warn("Failed to access microphone stream for real-time visualization:", err);
    }
  };

  // Clean up mic streams and release the browser mic indicator
  const cleanupMicAnalyser = () => {
    if (micSourceRef.current) {
      try { micSourceRef.current.disconnect(); } catch (e) {}
      micSourceRef.current = null;
    }
    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      micStreamRef.current = null;
    }
  };

  // Web Audio API Sound Effects Engine
  const playSoundEffect = (type: 'connect' | 'listening' | 'success' | 'click') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'connect') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15);
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1567.98, ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 0.3);
      } else if (type === 'listening') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      }
    } catch (e) {
      console.warn('Web Audio API is blocked or not supported by browser', e);
    }
  };

  // Synchronize state values into refs to prevent stale closure lockups in SpeechRecognition callbacks
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    characterStateRef.current = characterState;
  }, [characterState]);

  useEffect(() => {
    userStateRef.current = userState;
  }, [userState]);

  // Check Web Speech API Support and setup recognition instance
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSttSupported(true);
      const rec = new SpeechRecognition();
      
      // Standard non-continuous mode is highly optimized across browsers.
      // We couple it with a reliable silence timer to detect user pauses.
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setCharacterState('listening');
        setUserState('idle'); // mic is open, waiting for user speech
        setSttError(null);
      };

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += piece;
          } else {
            interimTranscript += piece;
          }
        }

        const activeText = (finalTranscript || interimTranscript).trim();
        if (activeText) {
          setLastUserSpeech(activeText);
          transcriptRef.current = activeText;
          setUserState('speaking');
          setCharacterState('listening');

          // Reset custom fallback silence timer. If no new speech is heard for 1.2s,
          // we assume the user finished and stop recognition to submit cleanly.
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            if (transcriptRef.current.trim() && isListeningRef.current) {
              stopListeningAndSubmit();
            }
          }, 1200);
        }
      };

      rec.onerror = (event: any) => {
        // Suppress expected non-fatal errors during silence/abort transitions
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }
        console.warn('STT Error Event:', event.error);
        if (event.error === 'not-allowed') {
          setSttError('Microphone access blocked. Click the microphone icon in your browser address bar to allow.');
          isListeningRef.current = false;
          setIsListening(false);
          setCharacterState('idle');
          setUserState('idle');
        } else if (event.error === 'service-not-allowed') {
          setSttError('Speech recognition service blocked by browser policy.');
          isListeningRef.current = false;
          setIsListening(false);
          setCharacterState('idle');
          setUserState('idle');
        } else {
          console.warn('Speech recognition transient warning:', event.error);
        }
      };

      rec.onend = () => {
        setIsListening(false);

        // If the browser terminated recognition natively and we have captured speech, submit it!
        const text = transcriptRef.current.trim();
        if (text && isListeningRef.current) {
          transcriptRef.current = '';
          isListeningRef.current = false;
          handleVoiceInput(text);
          return;
        }

        // Restart hands-free mic if user is still inside the panel and we are supposed to be listening
        if (isListeningRef.current && isOpenRef.current && characterStateRef.current === 'listening') {
          setTimeout(() => {
            if (isListeningRef.current && isOpenRef.current && characterStateRef.current === 'listening') {
              try {
                rec.start();
              } catch (e) {
                // Ignore if busy
              }
            }
          }, 300);
        } else if (characterStateRef.current === 'listening') {
          setCharacterState('idle');
          setUserState('idle');
        }
      };

      recognitionRef.current = rec;
    }

    // Warm up available voices on mount and listen to changes
    if (window.speechSynthesis) {
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      window.speechSynthesis.getVoices();
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }

    return () => {
      cleanupMicAnalyser();
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (speechSafetyTimerRef.current) {
        clearTimeout(speechSafetyTimerRef.current);
      }
      if (speechResumeIntervalRef.current) {
        clearInterval(speechResumeIntervalRef.current);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Start or stop a virtual AI speech oscillator connected to the Analyser node to represent AI speaking frequencies
  useEffect(() => {
    if (characterState === 'talking') {
      if (audioCtxRef.current && analyserRef.current) {
        try {
          const ctx = audioCtxRef.current;
          
          // Reset any existing oscillator
          if (aiSynthOscRef.current) {
            try { aiSynthOscRef.current.stop(); } catch (e) {}
            try { aiSynthOscRef.current.disconnect(); } catch (e) {}
            aiSynthOscRef.current = null;
          }
          if (aiSynthGainRef.current) {
            try { aiSynthGainRef.current.disconnect(); } catch (e) {}
            aiSynthGainRef.current = null;
          }

          if (ctx.state === 'suspended') {
            ctx.resume();
          }

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(120, ctx.currentTime); // male speech pitch

          // Connect to analyser ONLY. Do not connect to ctx.destination to keep it completely inaudible to user
          osc.connect(gain);
          gain.connect(analyserRef.current);

          gain.gain.setValueAtTime(0.5, ctx.currentTime);
          osc.start();

          aiSynthOscRef.current = osc;
          aiSynthGainRef.current = gain;
        } catch (e) {
          console.warn("Failed to spin up AI speaking visualizer synth:", e);
        }
      }
    } else {
      // Clean up when not talking
      if (aiSynthOscRef.current) {
        try { aiSynthOscRef.current.stop(); } catch (e) {}
        try { aiSynthOscRef.current.disconnect(); } catch (e) {}
        aiSynthOscRef.current = null;
      }
      if (aiSynthGainRef.current) {
        try { aiSynthGainRef.current.disconnect(); } catch (e) {}
        aiSynthGainRef.current = null;
      }
    }
  }, [characterState]);

  // Voice-to-Voice Hands-free state machine controllers
  const startListening = () => {
    if (!isSttSupported || !recognitionRef.current || !isOpenRef.current) return;

    // Trigger Web Audio mic analysis
    initMicAnalyser();

    // Clear active speech synthesis before tuning mic stream
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    isListeningRef.current = true;
    transcriptRef.current = '';
    setCharacterState('listening');
    setUserState('idle'); // standby, waiting for user to talk
    setIsListening(true);
    playSoundEffect('listening');

    // Reset VAD state and counters for accurate dynamic pause tracking
    silentFramesCountRef.current = 0;
    speakingFramesCountRef.current = 0;
    setVadState('SILENT');

    try {
      recognitionRef.current.start();
    } catch (e) {
      // safe to ignore if already active
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    isListeningRef.current = false;
    setIsListening(false);
    setUserState('idle');
    cleanupMicAnalyser(); // Stop mic analysis and release indicators
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {
      // safe to ignore
    }
  };

  const stopListeningAndSubmit = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const text = transcriptRef.current.trim();
    transcriptRef.current = '';

    isListeningRef.current = false;
    setIsListening(false);

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {
      // safe to ignore
    }

    if (text) {
      handleVoiceInput(text);
    } else {
      setCharacterState('idle');
      setUserState('idle');
    }
  };

  const submitSpokenText = (text: string) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (!text.trim()) return;

    // Set listening flags to false to prevent onend loop restarts
    isListeningRef.current = false;
    setIsListening(false);

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {
      // Safe to ignore
    }

    handleVoiceInput(text.trim());
  };

  // Synchronous, direct click handler to bypass browser speechSynthesis autoplay blocks!
  const handleToggleOpen = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    isOpenRef.current = nextOpen; // Update ref immediately!

    if (nextOpen) {
      initAudioEngine(); // Initialize core Web Audio context and Analyser
      playSoundEffect('connect');
      // 1. Play introductory vocal greeting immediately inside the synchronous click handler!
      const welcomeGreetings = [
        "Greetings! I am Sheikh AI, Shukurillokh's voice companion. Speak to me hands-free, let's talk about Plately and his software engineering journey!",
        "Vocal connection established! I am ready to discuss Shukurillokh's portfolio, SKKU, and our startup Plately. Speak anytime!"
      ];
      const randomGreeting = welcomeGreetings[Math.floor(Math.random() * welcomeGreetings.length)];
      setLastAISpeech(randomGreeting);
      setUserState('listening');
      setCharacterState('talking');
      
      // Call speakText directly!
      speakText(randomGreeting);
    } else {
      // Teardown everything instantly on close
      stopListening();
      cleanupMicAnalyser(); // Explicitly release the browser microphone indicators
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setCharacterState('idle');
      setUserState('idle');
      setLastUserSpeech('');
      setLastAISpeech('');
    }
  };

  // Soundwave frequency visualizer tick loop (Procedural simulation driven cleanly by state machines)
  useEffect(() => {
    let visualizerActive = true;

    const renderTick = () => {
      if (!visualizerActive) return;

      // 1. If we have a running AnalyserNode, map its output directly to frequency bars!
      if (analyserRef.current && (userState === 'speaking' || characterState === 'talking' || characterState === 'listening')) {
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Calculate average volume/energy across the vocal frequency range
        const total = dataArray.reduce((acc, val) => acc + val, 0);
        const averageVolume = total / bufferLength;

        // Dynamic Voice Activity Detection (VAD) algorithm for isolating ambient room noise
        if (characterState === 'listening') {
          // Dynamic noise floor adaptation: slowly tracks the room's background noise
          if (averageVolume < noiseFloorRef.current) {
            // Pull the noise floor down quickly if the current room is quieter
            noiseFloorRef.current = noiseFloorRef.current * 0.9 + averageVolume * 0.1;
          } else {
            // Slowly let the noise floor creep up to adapt to constant ambient sound sources (e.g., fan, AC)
            noiseFloorRef.current = noiseFloorRef.current * 0.995 + averageVolume * 0.005;
          }
          
          // Noise floor bound checking (always between 3 and 70)
          noiseFloorRef.current = Math.max(3, Math.min(70, noiseFloorRef.current));
          
          // Define a dynamic speech threshold based on the adaptive ambient noise floor.
          // Higher ambient noise automatically increases the threshold to prevent false triggers!
          const dynamicThreshold = Math.max(12, noiseFloorRef.current * 1.45 + 6);
          
          if (averageVolume > dynamicThreshold) {
            speakingFramesCountRef.current += 1;
            silentFramesCountRef.current = 0;
            
            // If we hear continuous speech for at least 4 frames (about 65ms):
            if (speakingFramesCountRef.current >= 4) {
              if (userState !== 'speaking') {
                setUserState('speaking');
              }
              // Reset silence timer on active speaking to avoid premature timeouts
              if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
              }
            }
          } else {
            silentFramesCountRef.current += 1;
            speakingFramesCountRef.current = 0;
            
            // If silent for more than 48 consecutive frames (about 800ms):
            if (silentFramesCountRef.current >= 48) {
              // Ensure we stop and submit only if we actually captured a non-empty transcript!
              if (transcriptRef.current.trim() && isListeningRef.current) {
                stopListeningAndSubmit();
              } else if (userState === 'speaking') {
                setUserState('idle');
              }
            }
          }

          // Throttle state updates for UI telemetry displays to avoid high-frequency React render cycles
          const now = Date.now();
          if (now - lastTelemetryUpdateRef.current > 120) {
            setVadThreshold(Math.round(dynamicThreshold));
            setCurrentEnergy(Math.round(averageVolume));
            setNoiseFloor(Math.round(noiseFloorRef.current));
            setVadState(averageVolume > dynamicThreshold ? 'SPEAKING' : 'SILENT');
            lastTelemetryUpdateRef.current = now;
          }
        }

        // Modulate AI speech simulator in real-time to generate organic-looking wave outputs
        if (characterState === 'talking' && aiSynthGainRef.current && audioCtxRef.current) {
          const ctx = audioCtxRef.current;
          const time = ctx.currentTime;
          // Words / sentence flow modulation (low-freq envelope)
          const wordCadence = Math.max(0.05, Math.sin(time * 3.5) * Math.cos(time * 1.8) + 0.35);
          // High-frequency jitter for phoneme articulation
          const phonemeJitter = Math.sin(time * 24) * 0.35 + 0.55;
          const currentGain = wordCadence > 0.15 ? Math.min(0.8, wordCadence * phonemeJitter) : 0.05;
          
          aiSynthGainRef.current.gain.setValueAtTime(currentGain, ctx.currentTime);

          if (aiSynthOscRef.current) {
            // Modulate pitch slightly for dynamic male vocal cadence
            const pitchJitter = 115 + Math.sin(time * 6) * 12 + (Math.random() - 0.5) * 8;
            aiSynthOscRef.current.frequency.setValueAtTime(pitchJitter, ctx.currentTime);
          }
        }

        // Map analyser frequencies to 16 bars
        const nextHeights = Array.from({ length: 16 }).map((_, i) => {
          // Sample a frequency bin focused on the vocal spectrum range
          const binIndex = Math.floor((i / 16) * bufferLength * 0.75);
          const rawValue = dataArray[binIndex] || 0;

          // Scale byte value 0-255 directly to a visually polished height scale (4px to 32px)
          const scaleFactor = 28;
          let scaledHeight = 4 + (rawValue / 255) * scaleFactor;

          // Introduce a tiny baseline organic ripple to keep elements lively if input is silent
          const baseline = Math.sin(Date.now() * 0.004 + i * 0.3) * 1.5 + 1.5;
          return Math.min(32, Math.max(4, scaledHeight + baseline));
        });

        setBarHeights(nextHeights);
      } else {
        // Fallback or idle UI updates
        const now = Date.now();
        if (now - lastTelemetryUpdateRef.current > 300) {
          setVadThreshold(15);
          setCurrentEnergy(userState === 'speaking' ? 22 : 2);
          setNoiseFloor(8);
          setVadState(userState === 'speaking' ? 'SPEAKING' : 'SILENT');
          lastTelemetryUpdateRef.current = now;
        }

        // 2. Fall back to standard math-based procedural simulation if Web Audio mic permission isn't active
        if (userState === 'speaking') {
          // LIVELY USER SPEAKING WAVES: responsive, energetic green frequency lines
          const timeOffset = Date.now() * 0.024;
          const nextHeights = Array.from({ length: 16 }).map((_, i) => {
            const waveValue = Math.sin(timeOffset + i * 0.6) * Math.cos(timeOffset * 0.5 + i * 0.3);
            const raw = Math.abs(waveValue) * 22 + Math.random() * 6;
            return Math.min(32, Math.max(4, 5 + raw));
          });
          setBarHeights(nextHeights);
        } else if (characterState === 'talking') {
          // ORGANIC TALKING WAVES: Lively blue voice frequency simulation matching vocal cadence
          const timeOffset = Date.now() * 0.022;
          const nextHeights = Array.from({ length: 16 }).map((_, i) => {
            const waveValue = Math.sin(timeOffset + i * 0.7) * Math.cos(timeOffset * 0.4 + i * 0.25);
            const microJitter = Math.random() * 0.5;
            const scaledHeight = 6 + Math.abs(waveValue + microJitter) * 24;
            return Math.min(32, Math.max(4, scaledHeight));
          });
          setBarHeights(nextHeights);
        } else if (characterState === 'thinking') {
          // SMOOTH NEON THINKING PULSE: Slow, meditative cyan computing waves
          const timeOffset = Date.now() * 0.008;
          const nextHeights = Array.from({ length: 16 }).map((_, i) => {
            const waveValue = Math.sin(timeOffset + i * 0.3);
            const scaledHeight = 5 + Math.abs(waveValue) * 8;
            return Math.min(32, Math.max(4, scaledHeight));
          });
          setBarHeights(nextHeights);
        } else if (characterState === 'listening') {
          // IDLE BREATHING MICRO-WAVES: Soft green micro pulses showing microphone is listening
          const timeOffset = Date.now() * 0.005;
          const nextHeights = Array.from({ length: 16 }).map((_, i) => {
            const subtleBreathe = Math.sin(timeOffset + i * 0.4) * 2.5 + Math.random() * 1.5;
            return Math.max(4, 4 + subtleBreathe);
          });
          setBarHeights(nextHeights);
        } else {
          // MINIMAL FLATLINE: Subtle idleness state
          const timeOffset = Date.now() * 0.003;
          const nextHeights = Array.from({ length: 16 }).map((_, i) => {
            const subtleBreathe = Math.sin(timeOffset + i * 0.2) * 1.5;
            return Math.max(4, 4 + subtleBreathe);
          });
          setBarHeights(nextHeights);
        }
      }

      visualizerFrameRef.current = requestAnimationFrame(renderTick);
    };

    visualizerFrameRef.current = requestAnimationFrame(renderTick);

    return () => {
      visualizerActive = false;
      if (visualizerFrameRef.current) {
        cancelAnimationFrame(visualizerFrameRef.current);
      }
    };
  }, [characterState, userState]);

  // TTS Speaking Engine with mouth flap sync and hands-free automatic restart
  const speakText = (text: string) => {
    if (!isTtsEnabled || !window.speechSynthesis) {
      // If voice response is muted, go straight back to listening mode
      setCharacterState('idle');
      setUserState('idle');
      if (isOpenRef.current) {
        startListening();
      }
      return;
    }

    try {
      // Clear any existing safety timers and resume intervals to prevent overlapping triggers
      if (speechSafetyTimerRef.current) {
        clearTimeout(speechSafetyTimerRef.current);
        speechSafetyTimerRef.current = null;
      }
      if (speechResumeIntervalRef.current) {
        clearInterval(speechResumeIntervalRef.current);
        speechResumeIntervalRef.current = null;
      }

      // Cancel current speech synthesis instantly to ensure freshness
      window.speechSynthesis.cancel();

      // Clean text of markdown wrappers for speech synthesis natural flow
      const cleanSpeechText = text
        .replace(/\*\*([^*]+)\*\"/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/https?:\/\/\S+/g, 'link');

      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      utterance.lang = 'en-US'; // Forces the speech synthesizer engine to prioritize English rules

      // Auto-detect high-fidelity English voices
      const availableVoices = window.speechSynthesis.getVoices();
      const premiumVoice = availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                           availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
                           availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Microsoft')) ||
                           availableVoices.find(v => v.lang.startsWith('en')) ||
                           availableVoices[0];

      if (premiumVoice) {
        utterance.voice = premiumVoice;
      }

      utterance.pitch = 1.05; // Balanced engaging male pitch
      utterance.rate = 1.05;  // Natural conversational rate
      utterance.volume = 1.0; // Ensure full audibility!

      // Safety auto-recovery timer: in case browser speechSynthesis gets stuck or fails to fire onend/onerror
      const estimatedDuration = Math.max(3500, (cleanSpeechText.length * 90) + 2000);
      speechSafetyTimerRef.current = setTimeout(() => {
        if (characterStateRef.current === 'talking') {
          console.warn('Speech synthesis safety recovery triggered - speech end timed out');
          window.speechSynthesis.cancel();
          setCharacterState('idle');
          setUserState('idle');
          if (isOpenRef.current) {
            startListening();
          }
        }
      }, estimatedDuration);

      // Periodically trigger resume to prevent Chrome speech freezing on longer texts
      speechResumeIntervalRef.current = setInterval(() => {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, 3000);

      utterance.onstart = () => {
        setCharacterState('talking');
        setUserState('listening'); // User is quiet, listening to character speak
      };

      utterance.onend = () => {
        if (speechSafetyTimerRef.current) {
          clearTimeout(speechSafetyTimerRef.current);
          speechSafetyTimerRef.current = null;
        }
        if (speechResumeIntervalRef.current) {
          clearInterval(speechResumeIntervalRef.current);
          speechResumeIntervalRef.current = null;
        }
        setCharacterState('idle');
        setUserState('idle');
        // Resumes hands-free listening as soon as character stops speaking!
        if (isOpenRef.current) {
          startListening();
        }
      };

      utterance.onerror = (e: any) => {
        if (speechSafetyTimerRef.current) {
          clearTimeout(speechSafetyTimerRef.current);
          speechSafetyTimerRef.current = null;
        }
        if (speechResumeIntervalRef.current) {
          clearInterval(speechResumeIntervalRef.current);
          speechResumeIntervalRef.current = null;
        }
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }
        console.warn('Speech synthesis error event:', e.error || e);
        if (e.error === 'not-allowed') {
          setSttError("Audio output blocked: Browser iframe sandboxing limits SpeechSynthesis inside previews. Please click 'Open in new tab' at the top-right of your screen for Sheikh's actual speech!");
        }
        setCharacterState('idle');
        setUserState('idle');
        if (isOpenRef.current) {
          startListening();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis critical error:', err);
      if (speechSafetyTimerRef.current) {
        clearTimeout(speechSafetyTimerRef.current);
        speechSafetyTimerRef.current = null;
      }
      if (speechResumeIntervalRef.current) {
        clearInterval(speechResumeIntervalRef.current);
        speechResumeIntervalRef.current = null;
      }
      setCharacterState('idle');
      setUserState('idle');
      if (isOpenRef.current) {
        startListening();
      }
    }
  };

  // Process voice input and request response from Gemini backend
  const handleVoiceInput = async (spokenText: string) => {
    if (!spokenText.trim()) return;

    // Interrupt any active voice synthesis instantly
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setCharacterState('thinking');
    setUserState('idle');
    setLastAISpeech('Accessing neural directory database...');

    try {
      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.slice(-6),
            { role: 'user', content: spokenText }
          ]
        }),
      });

      const data = await response.json();

      if (response.ok && data.text) {
        const expression = (data.expression || 'happy') as any;
        const tone = data.toneLabel || 'Gk Neural Core';

        setCharacterExpression(expression);
        setActiveTone(tone);

        // Keep local conversation history clean
        const updatedHistory: Message[] = [
          ...messages,
          { role: 'user', content: spokenText },
          { role: 'assistant', content: data.text, expression, toneLabel: tone }
        ];
        setMessages(updatedHistory.slice(-10));

        setLastAISpeech(data.text);

        // Speak the reply out loud!
        playSoundEffect('success');
        speakText(data.text);
      } else {
        throw new Error(data.error || 'Interface response failed');
      }
    } catch (err) {
      console.error('Connection Static:', err);
      const errorResponse = "Dynamic signal static detected. Recalibrating vocal matrix.";
      setCharacterExpression('defensive');
      setActiveTone('Static Interference');
      setLastAISpeech(errorResponse);
      speakText(errorResponse);
    }
  };

  // Handles text typed fallback input submission
  const handleManualTextSubmit = () => {
    const text = manualTextInput.trim();
    if (!text || characterState === 'thinking') return;

    setManualTextInput('');
    
    // Stop microphone if currently listening
    stopListening();

    setLastUserSpeech(text);
    handleVoiceInput(text);
  };

  const handleResetSystem = () => {
    if (window.confirm('Reset voice companion neural matrix?')) {
      stopListening();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setMessages([]);
      setLastUserSpeech('');
      setLastAISpeech('Voice companion recalibrated. Matrix refreshed.');
      setCharacterExpression('happy');
      setActiveTone('Gk Neural Core');
      setCharacterState('idle');
      setUserState('idle');
      speakText("Voice companion recalibrated. Matrix refreshed.");
    }
  };

  return (
    <>
      {/* Immersive Floating Holographic Vocal Trigger */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <button
          id="voice-companion-trigger"
          onClick={handleToggleOpen}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl border ${
            isOpen 
              ? 'bg-slate-900 border-slate-800 text-slate-300' 
              : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white hover:scale-105 border-cyan-500 shadow-cyan-500/20'
          }`}
          aria-label="Toggle Sheikh Voice Companion"
        >
          {isOpen ? (
            <X className="w-6 h-6 animate-spin-once" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Mic className="w-6 h-6 animate-pulse" />
              {/* Outer pulsing beacon ring */}
              <span className="absolute -inset-2 rounded-full border border-cyan-500/40 animate-ping opacity-60" />
            </div>
          )}
        </button>
      </div>

      {/* Full Voice-to-Voice Console Panel / Mascot Overlay */}
      <AnimatePresence>
        {isOpen && (
          isMascotMode ? (
            /* COMPACT FLOATING DRAGGABLE MASCOT OVERLAY */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
              className="fixed z-50 bottom-24 right-6 w-[180px] h-[210px] flex flex-col items-center select-none"
              id="voice-companion-mascot"
            >
              {/* Drag handle area of mascot */}
              <div 
                onMouseDown={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button')) return;
                  handleDragStart(e.clientX, e.clientY);
                }}
                onTouchStart={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button')) return;
                  if (e.touches[0]) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                }}
                className="relative w-[130px] h-[130px] rounded-full cursor-grab active:cursor-grabbing hover:scale-105 transition-transform duration-200"
                title="Drag Gk anywhere! Double-click to open Console"
                onDoubleClick={() => {
                  playSoundEffect('click');
                  setIsMascotMode(false);
                }}
              >
                <CompanionAvatar state={characterState} expression={characterExpression} />
                
                {/* Overlay status indicator badge */}
                <div className="absolute -top-1 -right-1 bg-cyan-500 text-[8px] font-mono font-bold text-slate-950 px-1.5 py-0.5 rounded-full shadow-lg border border-cyan-300 animate-pulse">
                  GK ACTIVE
                </div>
              </div>

              {/* Dynamic Speech bubble caption overlay when he speaks */}
              <AnimatePresence>
                {lastAISpeech && characterState === 'talking' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-[145px] right-[-20px] w-[220px] bg-slate-950/95 border border-cyan-500/40 text-slate-250 p-3 rounded-2xl shadow-[0_4px_22px_rgba(0,0,0,0.7)] text-[10px] font-mono backdrop-blur-md relative"
                  >
                    <div className="line-clamp-4 leading-relaxed">
                      "{lastAISpeech}"
                    </div>
                    {/* Bubble pointer arrow */}
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-cyan-500/40" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Compact HUD interface controls */}
              <div className="mt-2.5 flex items-center space-x-1.5 bg-slate-950/90 border border-slate-900/80 px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm">
                <button
                  onClick={() => {
                    playSoundEffect('click');
                    if (isListening) {
                      stopListening();
                    } else {
                      startListening();
                    }
                  }}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    isListening ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
                  }`}
                  title={isListening ? "Mute Gk Mic" : "Open Gk Mic"}
                >
                  <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse' : ''}`} />
                </button>

                <button
                  onClick={() => {
                    playSoundEffect('click');
                    setIsMascotMode(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-full transition-colors cursor-pointer"
                  title="Open Full Voice Console"
                >
                  <Bot className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
                  title={isTtsEnabled ? "Mute Voice" : "Unmute Voice"}
                >
                  {isTtsEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-full transition-colors cursor-pointer"
                  title="Close Gk"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* FULL TERMINAL CONSOLE VIEW (Draggable by dragging the header!) */
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={isFullscreen ? {} : { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
              className={`fixed z-50 bg-slate-950 border border-slate-900/80 shadow-2xl flex flex-col text-left transition-all duration-300 overflow-hidden ${
                isFullscreen 
                  ? 'inset-0 w-full h-full max-w-full max-h-full rounded-none' 
                  : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full h-full sm:w-[410px] sm:h-[760px] max-w-full sm:max-w-[calc(100vw-32px)] max-h-full sm:max-h-[calc(100vh-48px)] rounded-none sm:rounded-2xl'
              }`}
              id="voice-companion-panel"
            >
              {/* Custom Background Starfield Matrix Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

              {/* Header: High-Tech Telemetry & Controls (DRAG HANDLE!) */}
              <div 
                onMouseDown={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button') || target.closest('input')) return;
                  handleDragStart(e.clientX, e.clientY);
                }}
                onTouchStart={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button') || target.closest('input')) return;
                  if (e.touches[0]) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                }}
                className="p-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-900/60 flex items-center justify-between relative z-10 shrink-0 cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <span className="flex h-3.5 w-3.5 relative items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                      <span>Sheikh Voice Companion</span>
                      <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-[8px] uppercase tracking-wider text-cyan-300 font-mono font-bold rounded">HOLO STREAM</span>
                    </h3>
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 mt-0.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Active Matrix:</span>
                      <span className="text-cyan-400 uppercase font-bold">{activeTone}</span>
                    </div>
                  </div>
                </div>

                {/* Utility Panel */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      playSoundEffect('click');
                      setIsMascotMode(true);
                    }}
                    className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                    title="Switch to Compact Mascot Mode"
                  >
                    <Bot className="w-4 h-4 text-cyan-500 animate-pulse" />
                  </button>

                  <button
                    onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      isTtsEnabled ? 'text-cyan-400 hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-900'
                    }`}
                    title={isTtsEnabled ? "Mute Voice Response" : "Unmute Voice Response"}
                  >
                    {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleResetSystem}
                    className="p-2 text-slate-500 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                    title="Recalibrate Voice Matrix"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 text-slate-500 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer hidden sm:block"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-500 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* HIGH-TECH TAB SWITCHER */}
              <div className="grid grid-cols-2 border-b border-slate-900/60 bg-slate-950/40 relative z-10 text-[10px] sm:text-xs font-mono shrink-0">
                <button
                  onClick={() => { playSoundEffect('click'); setActiveTab('hologram'); }}
                  className={`py-2.5 text-center font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                    activeTab === 'hologram' 
                      ? 'border-b-2 border-cyan-500 text-cyan-400 bg-slate-900/10 font-black' 
                      : 'text-slate-500 hover:text-slate-350 bg-transparent'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>HOLOGRAM VIEW</span>
                </button>
                <button
                  onClick={() => { playSoundEffect('click'); setActiveTab('logs'); }}
                  className={`py-2.5 text-center font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                    activeTab === 'logs' 
                      ? 'border-b-2 border-cyan-500 text-cyan-400 bg-slate-900/10 font-black' 
                      : 'text-slate-500 hover:text-slate-350 bg-transparent'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>CHAT TRANSMISSION LOGS</span>
                </button>
              </div>

              {/* Error banners */}
              {sttError && (
                <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-between text-[11px] text-red-400 font-mono relative z-10 shrink-0">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{sttError}</span>
                  </div>
                  <button 
                    onClick={() => setSttError(null)}
                    className="text-slate-400 hover:text-white font-bold ml-2 underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Iframe sandbox notice */}
              {showIframeNotice && (
                <div className="bg-cyan-500/10 border-b border-cyan-500/20 px-4 py-2 flex items-center justify-between text-[10px] text-cyan-300 font-mono relative z-10 shrink-0">
                  <div className="flex items-start space-x-2 leading-tight">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400 mt-0.5 animate-pulse" />
                    <span>
                      <strong className="text-cyan-400">Audio Notice:</strong> Browsers block embedded voice synthesis in iframe previews by default. Click <strong className="text-white animate-pulse">Open in new tab</strong> in the top-right of the screen for the complete vocal companion experience!
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowIframeNotice(false)}
                    className="text-slate-500 hover:text-white font-bold ml-2 underline cursor-pointer shrink-0"
                  >
                    Got-it
                  </button>
                </div>
              )}

              {/* Main Content Area: Tab switching logic */}
              {activeTab === 'hologram' ? (
                /* Center Area: Fully Animated Full-Size Avatar Character Projection with Adaptive Scroll */
                <div className="flex-1 w-full bg-slate-950/80 flex flex-col overflow-y-auto scrollbar-thin relative min-h-0">
                  <div className={`w-full h-[240px] sm:h-[320px] shrink-0 relative bg-slate-950/40 overflow-hidden border-b border-slate-900/60 transition-all duration-300 ${
                    characterState === 'talking' ? 'ring-1 ring-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : ''
                  }`}>
                    <style>{`
                      @keyframes mouth-wave-left {
                        0%, 100% { transform: scaleY(0.3) translateX(-50%); }
                        50% { transform: scaleY(1.3) translateX(-50%); }
                      }
                      @keyframes mouth-wave-right {
                        0%, 100% { transform: scaleY(0.3) translateX(50%); }
                        50% { transform: scaleY(1.3) translateX(50%); }
                      }
                      @keyframes speak-pulse-ring {
                        0% { transform: scale(0.5); opacity: 0.8; }
                        100% { transform: scale(1.6); opacity: 0; }
                      }
                      @keyframes speak-vocal-line {
                        0%, 100% { height: 4px; }
                        50% { height: 16px; }
                      }
                      .anim-wave-l {
                        animation: mouth-wave-left 0.28s infinite ease-in-out;
                      }
                      .anim-wave-r {
                        animation: mouth-wave-right 0.28s infinite ease-in-out;
                      }
                      .anim-speak-ring-1 {
                        animation: speak-pulse-ring 1.2s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
                      }
                      .anim-speak-ring-2 {
                        animation: speak-pulse-ring 1.2s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        animation-delay: 0.6s;
                      }
                    `}</style>
                    
                    <CompanionAvatar state={characterState} expression={characterExpression} />
                    
                    {/* CSS-based Speaking Status Mouth Movement Simulation Overlay */}
                    {characterState === 'talking' && (
                      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                        {/* Concentric soundwaves radiating from the avatar's mouth region (around the center of the viewport) */}
                        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full border border-cyan-500/40 anim-speak-ring-1 absolute" />
                          <div className="w-16 h-16 rounded-full border border-cyan-400/20 anim-speak-ring-2 absolute" />
                          <div className="w-6 h-6 rounded-full bg-cyan-500/10 blur-[2px] absolute animate-ping" />
                        </div>

                        {/* Left-side audio-reactive mouth movement simulation column */}
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col space-y-1 opacity-80">
                          <span className="text-[7px] font-mono text-cyan-400 tracking-widest uppercase">L-VAD</span>
                          <div className="flex items-end space-x-1 h-8 items-center">
                            <span className="w-[3px] bg-cyan-500/80 rounded-full animate-[speak-vocal-line_0.25s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0.05s' }} />
                            <span className="w-[3px] bg-cyan-400 rounded-full animate-[speak-vocal-line_0.35s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0.15s' }} />
                            <span className="w-[3px] bg-cyan-300 rounded-full animate-[speak-vocal-line_0.2s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0.1s' }} />
                          </div>
                        </div>

                        {/* Right-side audio-reactive mouth movement simulation column */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col space-y-1 items-end opacity-80">
                          <span className="text-[7px] font-mono text-cyan-400 tracking-widest uppercase">R-VAD</span>
                          <div className="flex items-end space-x-1 h-8 items-center">
                            <span className="w-[3px] bg-cyan-300 rounded-full animate-[speak-vocal-line_0.22s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0.08s' }} />
                            <span className="w-[3px] bg-cyan-400 rounded-full animate-[speak-vocal-line_0.32s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0.12s' }} />
                            <span className="w-[3px] bg-cyan-500/80 rounded-full animate-[speak-vocal-line_0.27s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0.03s' }} />
                          </div>
                        </div>

                        {/* Lower telemetry status bar indicating active voice synchronization */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-950/90 border border-cyan-500/30 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center space-x-2 backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span className="text-[8px] font-mono text-cyan-300 tracking-wider font-bold">SPEECH TRANSCEIVER SYNCED</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Real-time split telemetry HUD for User and Companion */}
                  <div className="grid grid-cols-2 gap-3 px-5 py-3 bg-slate-950/95 border-t border-slate-900/60 relative z-10 text-xs font-mono shrink-0">
                    {/* User Telemetry */}
                    <div className="border border-slate-900 bg-slate-950/40 p-2.5 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${userState === 'speaking' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">User State</span>
                        </div>
                        <div className="text-slate-300">
                          <span className={`text-[11px] font-bold ${userState === 'speaking' ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {userState === 'speaking' ? '● SPEAKING' : userState === 'listening' ? '◆ LISTENING' : '■ STANDBY'}
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] text-slate-500 italic truncate max-w-full">
                          {userState === 'speaking' ? `"${lastUserSpeech || 'Capturing voice...'}"` : 'Mic ready & listening.'}
                        </div>
                      </div>
                      
                      {/* High-fidelity adaptive VAD diagnostics stream */}
                      <div className="mt-2 pt-1.5 border-t border-slate-900/60 flex items-center justify-between text-[8px] font-mono text-slate-400 leading-none shrink-0">
                        <span>VAD: <strong className={vadState === 'SPEAKING' ? 'text-emerald-400' : 'text-slate-500'}>{vadState}</strong></span>
                        <span>SND: <strong className="text-slate-300">{currentEnergy}</strong>/<span className="text-slate-500">{vadThreshold}</span></span>
                        <span>NOISE: <strong className="text-slate-300">{noiseFloor}</strong></span>
                      </div>
                    </div>

                    {/* Companion Telemetry */}
                    <div className="border border-slate-900 bg-slate-950/40 p-2.5 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          characterState === 'talking' ? 'bg-blue-500 animate-pulse' :
                          characterState === 'thinking' ? 'bg-cyan-500 animate-pulse' :
                          characterState === 'listening' ? 'bg-emerald-500' : 'bg-slate-700'
                        }`} />
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Sheikh Avatar</span>
                      </div>
                      <div className="text-slate-300">
                        <span className={`text-[11px] font-bold ${
                          characterState === 'talking' ? 'text-blue-400' :
                          characterState === 'thinking' ? 'text-cyan-400' :
                          characterState === 'listening' ? 'text-emerald-400' : 'text-slate-400'
                        }`}>
                          {characterState === 'talking' ? '■ TALKING' :
                           characterState === 'thinking' ? '▲ THINKING' :
                           characterState === 'listening' ? '● LISTENING' : '◆ IDLE'}
                        </span>
                      </div>
                      <div className="mt-1.5 text-[10px] text-slate-500 italic truncate max-w-full">
                        {characterState === 'talking' ? `"${lastAISpeech || 'Speaking response...'}"` :
                         characterState === 'thinking' ? 'Invoking neural nodes...' :
                         characterState === 'listening' ? 'VAD listening for speech...' : 'Standing by.'}
                      </div>
                    </div>
                  </div>

                  {/* Real-time Dynamic Holographic Caption Subtitles */}
                  <div className="px-6 py-4 bg-slate-950 border-t border-slate-900/60 relative z-10 flex flex-col space-y-2 shrink-0">
                    {lastUserSpeech && (
                      <div className="flex items-start space-x-2 text-[11px] text-slate-400 font-mono">
                        <span className="text-cyan-500 font-bold shrink-0">[HEARD]:</span>
                        <p className="italic text-emerald-400">"{lastUserSpeech}"</p>
                      </div>
                    )}
                    <div className="flex items-start justify-between space-x-2 text-[11px] text-slate-300 font-mono leading-relaxed">
                      <div className="flex items-start space-x-2">
                        <span className="text-cyan-400 font-bold shrink-0">[SPEAKING]:</span>
                        <p className="line-clamp-3">
                          {characterState === 'thinking' ? (
                            <span className="text-cyan-500 animate-pulse">Consulting Shukurillokh's neural profile database...</span>
                          ) : lastAISpeech ? (
                            `"${lastAISpeech}"`
                          ) : (
                            <span className="text-slate-500 animate-pulse">Calibrating voice-to-voice carriers...</span>
                          )}
                        </p>
                      </div>
                      {lastAISpeech && characterState !== 'thinking' && (
                        <button
                          onClick={() => {
                            playSoundEffect('click');
                            speakText(lastAISpeech);
                          }}
                          className="text-slate-500 hover:text-cyan-400 p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer self-start shrink-0"
                          title="Replay Voice response (Manual Audio override)"
                        >
                          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Beautiful Scrollable Terminal Log View of the whole conversation */
                <div className="flex-1 w-full bg-slate-950/40 p-4 overflow-y-auto scrollbar-thin flex flex-col space-y-3 min-h-0">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs p-6">
                      <Cpu className="w-8 h-8 text-cyan-500 mb-3 animate-pulse" />
                      <p>No transmission logs recorded yet.</p>
                      <p className="text-[10px] text-slate-600 mt-1">Say something or type a query below to log transmissions.</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex flex-col space-y-1 p-3 rounded-xl border font-mono text-xs max-w-[85%] ${
                          msg.role === 'user' 
                            ? 'bg-slate-900/40 border-slate-900 self-end text-right' 
                            : 'bg-cyan-500/5 border-cyan-500/10 self-start text-left'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 text-[9px] text-slate-500 uppercase tracking-widest">
                          <span>{msg.role === 'user' ? 'USER' : 'SHEIKH AI'}</span>
                          {msg.toneLabel && (
                            <span className="text-[8px] px-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded font-bold">
                              {msg.toneLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-200 mt-1 leading-relaxed break-words">{msg.content}</p>
                      </div>
                    ))
                  )}
                  <div ref={logsEndRef} />
                </div>
              )}

              {/* HIGH-FIDELITY DYNAMICAL SOUNDWAVE HUD (Driven directly by states!) */}
              <div className="h-14 w-full border-t border-slate-900 bg-slate-950 flex flex-col items-center justify-center px-8 py-1.5 relative z-10 overflow-hidden shrink-0">
                <div className="flex items-end justify-center space-x-1.5 h-6">
                  {barHeights.map((height, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: height * 0.7 }}
                      transition={{
                        type: 'spring',
                        damping: 15,
                        stiffness: 300,
                        mass: 0.5
                      }}
                      className={`w-1 rounded-full ${
                        userState === 'speaking' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                        characterState === 'thinking' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' :
                        characterState === 'talking' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                        characterState === 'listening' ? 'bg-emerald-500/40' :
                        'bg-slate-800'
                      }`}
                      style={{ height: `${height * 0.7}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Manual Terminal text input fallback in case mic is blocked or user prefers typing */}
              <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-900/60 relative z-10 flex items-center space-x-2 shrink-0">
                <input
                  type="text"
                  value={manualTextInput}
                  onChange={(e) => setManualTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && manualTextInput.trim()) {
                      handleManualTextSubmit();
                    }
                  }}
                  placeholder={characterState === 'thinking' ? "Sheikh is compiling..." : "Or type a message to Sheikh..."}
                  disabled={characterState === 'thinking'}
                  className="flex-1 bg-slate-900/40 border border-slate-900 text-[11px] text-slate-200 placeholder-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500/40 font-mono transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleManualTextSubmit}
                  disabled={!manualTextInput.trim() || characterState === 'thinking'}
                  className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] uppercase tracking-wider font-mono px-3 py-1.5 rounded-lg hover:bg-cyan-500/25 disabled:opacity-30 disabled:hover:bg-cyan-500/10 transition-colors cursor-pointer font-bold shrink-0"
                >
                  Send
                </button>
              </div>

              {/* Footer Control Deck: Sleek Combined Telemetry Status */}
              <div className="py-3 px-4 bg-slate-950 border-t border-slate-900/80 relative z-10 flex flex-col items-center justify-center shrink-0">
                {/* Clear Human-Readable Connection Status Bar */}
                <div className="text-center">
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
                    {characterState === 'listening' && userState === 'speaking' ? (
                      <span className="text-emerald-400 animate-pulse">● USER IS SPEAKING NOW</span>
                    ) : characterState === 'listening' ? (
                      <span className="text-emerald-400 animate-pulse">● HANDS-FREE MIC IS OPEN</span>
                    ) : characterState === 'thinking' ? (
                      <span className="text-cyan-400 animate-pulse">▲ COMPILING INTELLIGENCE ENGINE</span>
                    ) : characterState === 'talking' ? (
                      <span className="text-blue-400 animate-pulse">■ VOICE TRANSMISSION ACTIVE</span>
                    ) : (
                      <span className="text-slate-500">◆ VOICE MODULE READY</span>
                    )}
                  </span>
                  <p className="text-[8px] sm:text-[9px] text-slate-600 font-mono mt-1">
                    {characterState === 'listening' ? (
                      "Hands-free mode active • Simply speak out loud, I will detect when you stop"
                    ) : characterState === 'talking' ? (
                      "Voice carrier wave broadcasting • Tap trigger in corner to close"
                    ) : (
                      "Direct vocal gateway enabled • Connected via Gemini 3.5 Core"
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </>
  );
}
