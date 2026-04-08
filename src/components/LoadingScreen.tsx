import { useState, useEffect, useRef } from 'react';
import '../styles/LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING...');
  const [isExiting, setIsExiting] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const containerRef = useRef(null);

  const text = "ZACKWEB";
  const messages = [
    { at: 20, text: 'LOADING MODULES...' },
    { at: 45, text: 'COMPILING ASSETS...' },
    { at: 70, text: 'OPTIMIZING...' },
    { at: 95, text: 'READY' }
  ];

  useEffect(() => {
    // Progress animation
    const duration = 3500;
    const interval = 30;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const newProgress = Math.min((current / steps) * 100, 100);
      setProgress(newProgress);

      // Update status messages
      const msg = messages.find(m => newProgress >= m.at && newProgress < m.at + 20);
      if (msg) setStatus(msg.text);

      if (current >= steps) {
        clearInterval(timer);
        setShowGlitch(true);
        setTimeout(() => setIsExiting(true), 500);
        setTimeout(() => onComplete?.(), 1300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className={`loader-container ${isExiting ? 'exit-active' : ''}`}
    >
      {/* Animated Grid Background */}
      <div className="grid-bg" />
      
      {/* Scanline Overlay */}
      <div className="scanlines" />
      
      {/* Binary Rain Effect */}
      <div className="binary-rain">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="binary-column"
            style={{
              left: `${i * 3.5}%`,
              animationDuration: `${Math.random() * 10 + 8}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {Array.from({ length: 30 }).map((_, j) => (
              <span key={j}>{Math.random() > 0.5 ? '1' : '0'}</span>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="type-container">
        <div className="main-text">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="char"
              data-char={char}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {char}
            </span>
          ))}
          <span className="cursor" style={{ animationDelay: `${text.length * 0.12}s` }} />
        </div>

        <div className="progress-wrapper">
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={`progress-text ${progress > 0 ? 'visible' : ''}`}>
            {status}
          </div>
        </div>
      </div>

      {/* Glitch Effect Layer */}
      {showGlitch && (
        <div className="glitch-layer">
          <div className="glitch-text" style={{ animationDelay: '0s' }}>ZACKWEB</div>
          <div className="glitch-text" style={{ animationDelay: '0.05s' }}>ZACKWEB</div>
          <div className="glitch-text" style={{ animationDelay: '0.1s' }}>ZACKWEB</div>
        </div>
      )}

      {/* Exit Overlay */}
      <div className="exit-overlay" />
    </div>
  );
};

export default LoadingScreen;