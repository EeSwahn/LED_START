import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, RotateCcw, Zap } from 'lucide-react';
import { LEDSimulator } from './components/LEDSimulator';
import { BrightnessChart } from './components/BrightnessChart';
import { linear, sCurve, logarithmic, generateCurveData } from './utils/curves';

const DURATION_MS = 2000; // 2 seconds for the full ramp

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  
  // Memoize chart data to prevent recalculation on every render
  const chartData = useMemo(() => generateCurveData(), []);

  const animate = (time: number) => {
    if (startTimeRef.current === undefined) {
      startTimeRef.current = time;
    }
    
    const elapsed = time - startTimeRef.current;
    const newProgress = Math.min(elapsed / DURATION_MS, 1);
    
    setProgress(newProgress);

    if (newProgress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setIsPlaying(false);
    }
  };

  const handleStart = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setProgress(0);
    startTimeRef.current = undefined;
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setIsPlaying(false);
    setProgress(0);
    startTimeRef.current = undefined;
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Calculate current brightness values based on progress
  const valLinear = linear(progress);
  const valSCurve = sCurve(progress);
  const valLog = logarithmic(progress);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full mb-10 flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Zap className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              LED Soft-Start Simulator
            </h1>
            <p className="text-slate-500 text-sm">Comparing mathematical fading functions</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleStart}
            disabled={isPlaying || progress === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${
              isPlaying || progress === 1
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
            }`}
          >
            <Play size={18} fill="currentColor" />
            {progress === 1 ? 'Complete' : isPlaying ? 'Running...' : 'Ignite'}
          </button>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 flex-grow">
        
        {/* Column 1: Linear */}
        <div className="flex flex-col gap-4">
          <LEDSimulator 
            brightness={valLinear} 
            label="Linear Ramp" 
            colorHex="#ef4444" // Red
            description="Brightness increases steadily. y = x"
          />
          <BrightnessChart 
            data={chartData} 
            currentTime={progress} 
            dataKey="linear" 
            color="#ef4444" 
          />
          <div className="bg-slate-900/50 p-4 rounded-lg text-xs font-mono text-slate-500 border border-slate-800">
            <p className="mb-1 text-slate-300 font-semibold">Characteristics:</p>
            Appears to brighten abruptly at the start because the human eye is more sensitive to changes at low light levels.
          </div>
        </div>

        {/* Column 2: S-Curve */}
        <div className="flex flex-col gap-4">
          <LEDSimulator 
            brightness={valSCurve} 
            label="S-Curve (Sigmoid)" 
            colorHex="#10b981" // Green
            description="Slow start, fast middle, slow finish. Ease-in-out."
          />
          <BrightnessChart 
            data={chartData} 
            currentTime={progress} 
            dataKey="sCurve" 
            color="#10b981" 
          />
          <div className="bg-slate-900/50 p-4 rounded-lg text-xs font-mono text-slate-500 border border-slate-800">
            <p className="mb-1 text-slate-300 font-semibold">Characteristics:</p>
            Organic and smooth feel. Eliminates the abrupt "pop" on start and the sudden stop at max brightness.
          </div>
        </div>

        {/* Column 3: Logarithmic */}
        <div className="flex flex-col gap-4">
          <LEDSimulator 
            brightness={valLog} 
            label="Logarithmic" 
            colorHex="#3b82f6" // Blue
            description="Starts fast, then plateaus. y = log10(9x + 1)"
          />
          <BrightnessChart 
            data={chartData} 
            currentTime={progress} 
            dataKey="logarithmic" 
            color="#3b82f6" 
          />
          <div className="bg-slate-900/50 p-4 rounded-lg text-xs font-mono text-slate-500 border border-slate-800">
            <p className="mb-1 text-slate-300 font-semibold">Characteristics:</p>
            Often used to compensate for human vision (Gamma Correction). The mathematical curve rises sharply, but to the eye, it might look more linear than the Linear ramp.
          </div>
        </div>

      </main>

      <footer className="max-w-6xl mx-auto w-full mt-12 pt-6 border-t border-slate-800 text-center text-slate-600 text-sm">
        <p>Simulation duration: {(DURATION_MS / 1000).toFixed(1)} seconds</p>
      </footer>
    </div>
  );
};

export default App;