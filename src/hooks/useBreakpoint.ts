import { useState, useEffect } from 'react';

const getBreakpoint = (width: number) => {
  if (width < 600) return 'mobile';
  if (width < 900) return 'tablet';
  return 'desktop';
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};