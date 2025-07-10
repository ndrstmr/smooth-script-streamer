// Robust progress calculation that doesn't jump on pause/play
export const calculateProgress = (
  currentPosition: number,
  maxScrollDistance: number
): number => {
  if (maxScrollDistance <= 0) return 0;
  
  // Simple linear calculation based on scroll position
  // This ensures the progress only changes when currentPosition changes
  const progress = (currentPosition / maxScrollDistance) * 100;
  return Math.min(100, Math.max(0, progress));
};