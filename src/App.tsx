import { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import LoadingScreen from './components/LoadingScreen';
import './styles/global.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('zo-theme') || 'light');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('zo-theme', next);
  };

  return (
    <div className="app">
      {!showContent && <LoadingScreen onComplete={() => setShowContent(true)} />}
      {showContent && <HeroSection theme={theme} toggleTheme={toggleTheme} />}
    </div>
  );
}

export default App;
