import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Parse numeric part and suffix
  const numericMatch = value.match(/[\d.]+/);
  const number = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const prefix = value.substring(0, value.indexOf(numericMatch ? numericMatch[0] : ''));
  const suffix = value.substring(
    value.indexOf(numericMatch ? numericMatch[0] : '') +
      (numericMatch ? numericMatch[0].length : 0),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animate only once
        }
      },
      { threshold: 0.1 },
    );

    if (countRef.current) observer.observe(countRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (easeOutExpo) for smooth finish
      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };

      const currentCount = Math.floor(easeOutExpo(percentage) * number);
      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(number);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, number, duration]);

  return (
    <span ref={countRef} className='tabular-nums'>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};
