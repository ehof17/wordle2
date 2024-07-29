import React, { useEffect, useRef } from 'react';

const MouseFollower = () => {
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const root = document.documentElement;
      root.style.setProperty('--mouse-x', `${e.clientX}px`);
      root.style.setProperty('--mouse-y', `${e.clientY + window.scrollY}px`);

      const target = e.target as HTMLElement;
      const behavior = target.getAttribute('data-hover-behavior');
      const circleSize = target.getAttribute('data-circle-size') || '14px';
      root.style.setProperty('--circle-size', circleSize);

      if (followerRef.current) {
        followerRef.current.className = `mouse-follow ${behavior || ''}`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={followerRef} className="mouse-follow"></div>;
};

export default MouseFollower;