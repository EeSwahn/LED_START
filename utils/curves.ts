/**
 * All functions accept t (time) between 0 and 1
 * and return a brightness value between 0 and 1.
 */

// Simple Linear: y = x
export const linear = (t: number): number => {
  return Math.max(0, Math.min(1, t));
};

// S-Curve (Sigmoid-like using Cubic Bezier ease-in-out logic)
// Creates a smooth start and smooth end.
export const sCurve = (t: number): number => {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
};

// Logarithmic (Mathematical Log)
// Starts fast, then slows down.
// Using formula: y = log10(9x + 1) which passes through (0,0) and (1,1)
export const logarithmic = (t: number): number => {
  const clamped = Math.max(0, Math.min(1, t));
  return Math.log10(9 * clamped + 1);
};

// Data generator for charts
export const generateCurveData = () => {
  const data = [];
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    data.push({
      t: t,
      linear: linear(t),
      sCurve: sCurve(t),
      logarithmic: logarithmic(t),
    });
  }
  return data;
};