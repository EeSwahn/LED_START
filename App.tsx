import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, RotateCcw, Zap, MousePointerClick } from 'lucide-react';
import { LEDSimulator } from './components/LEDSimulator';
import { BrightnessChart } from './components/BrightnessChart';
import { linear, sCurve, logarithmic, generateCurveData } from './utils/curves';

const DURATION_MS = 2000; // 2 seconds

type CurveType = 'linear' | 'sCurve' | 'logarithmic';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CurveType>('linear');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  
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

  const changeTab = (tab: CurveType) => {
    handleReset();
    setActiveTab(tab);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Calculate specific values based on active tab
  const getCurrentBrightness = () => {
    switch (activeTab) {
      case 'linear': return linear(progress);
      case 'sCurve': return sCurve(progress);
      case 'logarithmic': return logarithmic(progress);
      default: return 0;
    }
  };

  const currentBrightness = getCurrentBrightness();

  const renderTabButton = (id: CurveType, label: string, colorClass: string) => (
    <button
      onClick={() => changeTab(id)}
      className={`relative px-6 py-3 text-sm font-medium transition-all duration-200 flex-1 md:flex-none rounded-t-lg md:rounded-lg border-b-2 md:border-2 ${
        activeTab === id
          ? `border-${colorClass}-500 text-${colorClass}-400 bg-slate-800/80`
          : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
      }`}
    >
      {label}
      {activeTab === id && (
        <span className={`absolute -bottom-[2px] left-0 w-full h-[2px] bg-${colorClass}-500 md:hidden`} />
      )}
    </button>
  );

  const getActiveConfig = () => {
    switch(activeTab) {
      case 'linear':
        return {
          label: 'Linear Ramp (线性启动)',
          color: '#ef4444',
          descEN: 'Brightness increases steadily (y = x). Appears to start abruptly because human eyes are sensitive to low light.',
          descCN: '亮度稳定增加 (y = x)。由于人眼对弱光敏感，视觉上会感觉启动非常突然。'
        };
      case 'sCurve':
        return {
          label: 'S-Curve (S型曲线)',
          color: '#10b981',
          descEN: 'Ease-in-out. Starts slowly, accelerates, then decelerates. Provides the most organic "premium" feel.',
          descCN: '缓入缓出。起步缓慢，中间加速，最后减速。提供最自然的“高级感”视觉体验。'
        };
      case 'logarithmic':
        return {
          label: 'Logarithmic (对数启动)',
          color: '#3b82f6',
          descEN: 'Inverse of Gamma Correction. Compensates for human vision to make the dimming appear perfectly linear to the eye.',
          descCN: '伽马校正的逆过程。补偿人眼的非线性感知，使调光过程在视觉上看起来是均匀线性的。'
        };
    }
  };

  const config = getActiveConfig();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col font-sans">
      
      {/* Header */}
      <header className="max-w-5xl mx-auto w-full mb-8 flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Zap className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              LED Soft-Start Simulator
            </h1>
            <p className="text-slate-500 text-sm">LED 启动曲线模拟器</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleStart}
            disabled={isPlaying || progress === 1}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-bold transition-all transform active:scale-95 ${
              isPlaying || progress === 1
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_25px_rgba(79,70,229,0.5)]'
            }`}
          >
            <Play size={20} fill="currentColor" />
            {progress === 1 ? 'Done' : isPlaying ? 'Running...' : 'Start / 启动'}
          </button>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 active:scale-95"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="max-w-5xl mx-auto w-full mb-8 flex flex-row gap-2 justify-center border-b border-slate-800 md:border-none overflow-x-auto">
        {renderTabButton('linear', 'Linear / 线性', 'red')}
        {renderTabButton('sCurve', 'S-Curve / S型', 'emerald')}
        {renderTabButton('logarithmic', 'Log / 对数', 'blue')}
      </nav>

      {/* Main Display Area */}
      <main className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left Panel: LED Visualization */}
        <div className="flex flex-col h-full">
           <LEDSimulator 
              brightness={currentBrightness} 
              label={config.label} 
              colorHex={config.color} 
              description="" // Description moved outside
            />
        </div>

        {/* Right Panel: Chart & Info */}
        <div className="flex flex-col gap-6">
          {/* Info Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
             <div className="flex items-start gap-3 mb-3">
                <MousePointerClick className="w-5 h-5 mt-1 text-slate-400" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Description</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">{config.descEN}</p>
                  <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-2 mt-2">{config.descCN}</p>
                </div>
             </div>
          </div>

          {/* Chart */}
          <div className="flex-grow min-h-[250px] bg-slate-900/30 border border-slate-800 rounded-2xl p-4 flex flex-col">
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-4 ml-2">Output Voltage Curve</h4>
            <div className="flex-grow">
              <BrightnessChart 
                data={chartData} 
                currentTime={progress} 
                activeKey={activeTab} 
                activeColor={config.color} 
              />
            </div>
          </div>
        </div>

      </main>

      <footer className="max-w-5xl mx-auto w-full mt-12 pt-6 border-t border-slate-800 text-center text-slate-600 text-xs">
        <p>Simulation Time: {(DURATION_MS / 1000).toFixed(1)}s</p>
      </footer>
    </div>
  );
};

export default App;