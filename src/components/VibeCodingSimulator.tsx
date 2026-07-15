import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Flame, Terminal, Play, RotateCcw, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SimulatorMetric {
  label: string;
  legacy: string;
  agentic: string;
  icon: React.ReactNode;
}

export default function VibeCodingSimulator() {
  const [isAgenticMode, setIsAgenticMode] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<number>(0);
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'success'>('idle');
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const logScrollerRef = useRef<HTMLDivElement>(null);

  const presets = [
    {
      prompt: "Deploy Plately smart recipe Cook Mode with offline Riverpod state and scale-aware macro parsing",
      stepsLegacy: [
        "Initializing flutter directory architecture structure...",
        "Writing models/recipe.dart with 120 lines of tedious serialisation boilerplate...",
        "Resolving package dependency version conflicts in pubspec.yaml...",
        "Manually coding Riverpod state notifier class and debugging async listeners...",
        "Sighing loudly at static type resolution error on line 42...",
        "Overwriting models mapping function for the third time...",
        "Compiling APK... (Takes 8.5 minutes)",
        "Build succeeded, but macro numbers are off. Starting debugging loop..."
      ],
      stepsAgentic: [
        "Analyzing project directory schema in 250ms...",
        "Triggering Gemini 3.5 AI Engine proxy...",
        "Designing modular Riverpod notifier state classes with zero boilerplate...",
        "Writing surgical edits cleanly directly into Dart structure...",
        "Running strict linter check... 0 errors found.",
        "Compiling assets, building web/native binary...",
        "Success! Smart recipe Cook Mode deployed flawlessly in 1.4 seconds."
      ]
    },
    {
      prompt: "Build Markpad Native Svelte view/edit panels with safe native file system backup system",
      stepsLegacy: [
        "Setting up Svelte file template folders...",
        "Handling window.showOpenFilePicker compatibility checks manually...",
        "Writing custom debounce backup logic to local storage...",
        "Fixing UI flickering caused by React/Svelte state trigger loops...",
        "Manually rewriting configuration schemas in package.json...",
        "Struggling to make layout compile correctly on Windows native sandbox...",
        "Running compilation... failed (Missing import on line 12).",
        "Fixing error, rebuilding, certifying sandbox... (2 days elapsed)"
      ],
      stepsAgentic: [
        "Assessing workspace system requirements...",
        "Synthesizing high-contrast responsive Svelte view controller...",
        "Injecting automatic micro-draft backups via Local Storage bindings...",
        "Executing target lint verification... Succeeded.",
        "Bundling native scripts via esbuild CJS wrapper...",
        "Certified Microsoft Store compilation finished in 0.9 seconds!"
      ]
    }
  ];

  const metrics: SimulatorMetric[] = [
    {
      label: "Development Velocity",
      legacy: "1x (Standard manual typing)",
      agentic: "15x (AI agent speed)",
      icon: <Zap className="w-4 h-4 text-amber-400" />
    },
    {
      label: "Cognitive Load & Stress",
      legacy: "95% (High brain fatigue)",
      agentic: "5% (Creative steering)",
      icon: <Cpu className="w-4 h-4 text-violet-400" />
    },
    {
      label: "Boilerplate Written",
      legacy: "800 lines of manual code",
      agentic: "0 lines (Pure system structure)",
      icon: <Flame className="w-4 h-4 text-rose-400" />
    }
  ];

  // Log auto-scroll
  useEffect(() => {
    if (logScrollerRef.current) {
      logScrollerRef.current.scrollTop = logScrollerRef.current.scrollHeight;
    }
  }, [simulationLogs]);

  const runSimulation = () => {
    setSimulationState('running');
    setSimulationLogs([]);
    setProgress(0);

    const steps = isAgenticMode ? presets[activePreset].stepsAgentic : presets[activePreset].stepsLegacy;
    let stepIndex = 0;

    const intervalTime = isAgenticMode ? 350 : 800; // Agentic is much faster!

    const runStep = () => {
      if (stepIndex < steps.length) {
        setSimulationLogs(prev => [...prev, steps[stepIndex]]);
        setProgress(Math.round(((stepIndex + 1) / steps.length) * 100));
        stepIndex++;
        setTimeout(runStep, intervalTime);
      } else {
        setSimulationState('success');
      }
    };

    setTimeout(runStep, 200);
  };

  const resetSimulation = () => {
    setSimulationState('idle');
    setSimulationLogs([]);
    setProgress(0);
  };

  // Auto reset when mode / preset changes
  useEffect(() => {
    resetSimulation();
  }, [isAgenticMode, activePreset]);

  return (
    <section id="vibe-engine" className="py-28 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Background radial spotlight flare */}
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 text-left">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none" id="vibe-engine-title">
              The Vibe Coding Engine
            </h2>
            <p className="text-base text-slate-400 font-sans">
              I prefer agentic coding and prompting over traditional manual syntax typing because it delivers pristine production features at 15x velocity. Toggle the modes below to witness the speed gap.
            </p>
          </div>

          {/* Mode Switcher Toggle */}
          <div className="mt-8 md:mt-0 p-1 bg-slate-900 border border-slate-850 rounded-xl flex items-center space-x-1 self-start md:self-end">
            <button
              onClick={() => setIsAgenticMode(false)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                !isAgenticMode
                  ? 'bg-slate-850 text-slate-300 border border-slate-800'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Manual Coding (Legacy)
            </button>
            <button
              onClick={() => setIsAgenticMode(true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer flex items-center space-x-1.5 ${
                isAgenticMode
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                  : 'text-slate-500 hover:text-indigo-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Agentic Vibe (Modern)</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Simulator Box */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-850 rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-left space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
            
            {/* Simulation Selection & Inputs */}
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Select Preset Goal</span>
                <div className="flex items-center space-x-1.5">
                  {presets.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePreset(idx)}
                      disabled={simulationState === 'running'}
                      className={`w-6 h-6 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                        activePreset === idx
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-850'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mock Input Field */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 font-sans text-sm text-slate-300 leading-relaxed flex items-start space-x-3">
                <Sparkles className={`w-4 h-4 text-indigo-400 mt-1 flex-shrink-0 ${simulationState === 'running' && isAgenticMode ? 'animate-pulse' : ''}`} />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">System Prompt</div>
                  <div className="mt-1 font-medium">{presets[activePreset].prompt}</div>
                </div>
              </div>
            </div>

            {/* Simulated Live Console Output */}
            <div className="flex-1 min-h-[180px] bg-slate-950 border border-slate-850 rounded-xl p-4 font-mono text-xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-2 text-slate-500 text-[10px]">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>TRANSMISSION CONSOLE LOG</span>
                </div>
                <span>{isAgenticMode ? "ENGINE: AGENTIC" : "ENGINE: HUMAN TYPIST"}</span>
              </div>

              {/* Log stream */}
              <div 
                ref={logScrollerRef}
                className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[130px] scrollbar-thin scrollbar-thumb-slate-800"
              >
                {simulationLogs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-600 italic">
                    Press "Simulate" to trigger execution...
                  </div>
                ) : (
                  simulationLogs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-2 animate-in fade-in slide-in-from-bottom-1 duration-150">
                      <span className={isAgenticMode ? "text-indigo-400" : "text-amber-500"}>&gt;</span>
                      <span className={log && (log.includes('Success') || log.includes('flawlessly')) ? "text-emerald-400 font-semibold" : "text-slate-300"}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Progress bar */}
              {simulationState !== 'idle' && (
                <div className="mt-3 pt-3 border-t border-slate-900">
                  <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500">
                    <span>Task Completion</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${isAgenticMode ? "bg-indigo-500" : "bg-amber-500"}`} 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2 relative z-10">
              {simulationState === 'idle' ? (
                <button
                  onClick={runSimulation}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 cursor-pointer shadow-lg transition-all duration-300 hover:scale-[1.01] ${
                    isAgenticMode
                      ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/15'
                      : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/15'
                  }`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Simulate {isAgenticMode ? "Agentic Speed" : "Legacy Typing"}</span>
                </button>
              ) : (
                <button
                  onClick={resetSimulation}
                  disabled={simulationState === 'running'}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm bg-slate-950 border border-slate-850 hover:bg-slate-850 text-slate-300 flex items-center justify-center space-x-2 cursor-pointer transition-colors ${
                    simulationState === 'running' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Simulator</span>
                </button>
              )}
            </div>
          </div>

          {/* Metrics Comparison Box */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Top comparison stats */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 sm:p-8 flex-1 text-left flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/5 to-transparent pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Metric Tracker</span>
                <h3 className="text-xl font-extrabold text-white tracking-tight">The 15x Delivery Advantage</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  By working at the architecture level and letting AI coordinate boilerplate generation and type safety checks, I launch entire products before traditional workflows can clear dependencies.
                </p>
              </div>

              {/* Dynamic visual representation */}
              <div className="py-6 flex items-center justify-center relative">
                <div className="w-full bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col space-y-4 relative z-10">
                  {/* Human line */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                      <span>Manual Coding</span>
                      <span>1x (Baseline)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[8%]" />
                    </div>
                  </div>

                  {/* Agentic line */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-indigo-300 font-bold uppercase">
                      <span>Agentic Vibe Coding</span>
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-amber-300 fill-amber-300 animate-bounce" />
                        <span>15x Faster</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: '8%' }}
                        animate={{ width: isAgenticMode ? '100%' : '8%' }}
                        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom comparison details card */}
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 text-left relative overflow-hidden">
              <div className="space-y-4">
                {metrics.map((metric, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5 pb-4 border-b border-slate-950 last:border-0 last:pb-0">
                    <div className="p-2 bg-slate-950 rounded-lg">
                      {metric.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">{metric.label}</h4>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <div>
                          <div className="text-[10px] text-slate-500 font-bold">Manual</div>
                          <div className="text-xs text-slate-400 font-sans mt-0.5">{metric.legacy}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-indigo-400 font-bold">Agentic</div>
                          <div className="text-xs text-indigo-300 font-semibold font-sans mt-0.5">{metric.agentic}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
