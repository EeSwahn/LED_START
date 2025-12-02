import React from 'react';

interface LEDSimulatorProps {
  brightness: number; // 0 to 1
  label: string;
  colorHex?: string;
  description: string;
}

export const LEDSimulator: React.FC<LEDSimulatorProps> = ({ 
  brightness, 
  label, 
  colorHex = '#38bdf8', // Default Sky Blue
  description 
}) => {
  // Clamp brightness for safety
  const intensity = Math.max(0, Math.min(1, brightness));
  
  // Calculate alpha values for glow effects
  const coreAlpha = 0.2 + (intensity * 0.8); // Always visible slightly
  const glowOpacity = intensity;
  
  // Dynamic styles
  const lightStyle = {
    backgroundColor: colorHex,
    opacity: coreAlpha,
    boxShadow: `0 0 ${intensity * 60}px ${intensity * 10}px ${colorHex}`,
  };

  const percentage = Math.round(intensity * 100);

  return (
    <div className="flex flex-col items-center bg-slate-800 rounded-xl p-6 border border-slate-700 w-full h-full shadow-lg transition-colors hover:border-slate-600">
      <h3 className="text-xl font-bold mb-2 text-slate-100">{label}</h3>
      <p className="text-xs text-slate-400 mb-6 text-center h-10">{description}</p>
      
      {/* LED Housing */}
      <div className="relative w-full h-32 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden mb-6">
        {/* The Light Source */}
        <div 
          className="w-3/4 h-1/2 rounded transition-all duration-75"
          style={lightStyle}
        />
        
        {/* Grid Overlay for realism */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
        
        {/* Value Display */}
        <div className="absolute bottom-2 right-2 font-mono text-xs text-slate-500 bg-slate-900/80 px-1 rounded">
          PWM: {percentage}%
        </div>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
        <div 
          className="h-full transition-all duration-75 ease-linear"
          style={{ width: `${percentage}%`, backgroundColor: colorHex }}
        />
      </div>
      <div className="flex justify-between w-full text-xs text-slate-400 font-mono">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
};