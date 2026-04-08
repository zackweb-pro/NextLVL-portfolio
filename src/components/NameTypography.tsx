import { useEffect, useRef } from 'react';
import '../styles/NameTypography.css';

export default function NameTypography() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrolled = window.scrollY;
      containerRef.current.style.transform = `translateY(${scrolled * 0.1}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="name-container" ref={containerRef}>
      <div className="name-first">ZAKARIA</div>
      <div className="name-last">OUMGHAR</div>
      <div className="name-sub">CREATIVE DEVELOPER</div>
    </div>
  );
}