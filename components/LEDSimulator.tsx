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
}) => {
  // Clamp brightness for safety
  const intensity = Math.max(0, Math.min(1, brightness));
  
  // Calculate alpha values for glow effects
  // We keep a tiny bit of visibility (0.05) so the panel is visible when off
  const coreAlpha = 0.1 + (intensity * 0.9); 
  
  // Dynamic styles for the light source
  const lightStyle = {
    backgroundColor: colorHex,
    opacity: coreAlpha,
    boxShadow: `0 0 ${intensity * 100}px ${intensity * 30}px ${colorHex}`,
    filter: `brightness(${1 + intensity * 0.5})`
  };

  const percentage = Math.round(intensity * 100);

  return (
    <div className="flex flex-col items-center bg-slate-900 rounded-2xl p-1 border border-slate-800 shadow-2xl w-full h-full min-h-[400px]">
      
      {/* LED Physical Housing */}
      <div className="relative w-full flex-grow bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
        
        {/* Background Texture (Technical Grid) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
               backgroundSize: '20px 20px' 
             }}>
        </div>

        {/* The Rectangular LED COB Panel */}
        <div className="relative w-2/3 aspect-[4/3] bg-slate-800 border-4 border-slate-700/50 rounded flex items-center justify-center shadow-inner">
           {/* The actual emitting surface */}
           <div 
            className="w-full h-full transition-all duration-75"
            style={lightStyle}
           >
             {/* Micro-dot texture for realism */}
             <div className="w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
           </div>
        </div>
        
        {/* Value Display Overlay */}
        <div className="absolute bottom-4 right-4 font-mono text-xs text-slate-500 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded backdrop-blur">
          <span className="text-slate-400 mr-2">PWM_DUTY:</span>
          <span style={{ color: percentage > 0 ? colorHex : 'inherit' }} className="font-bold">
            {percentage.toString().padStart(3, '0')}%
          </span>
        </div>

        {/* Label Overlay */}
         <div className="absolute top-4 left-4 font-mono text-sm text-slate-300 font-bold tracking-wider">
          {label}
        </div>
      </div>

      {/* Simple Progress Bar below */}
      <div className="w-full px-6 py-4">
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
            className="h-full transition-all duration-75 ease-linear shadow-[0_0_10px_currentColor]"
            style={{ width: `${percentage}%`, backgroundColor: colorHex, color: colorHex }}
            />
        </div>
      </div>
    </div>
  );
};