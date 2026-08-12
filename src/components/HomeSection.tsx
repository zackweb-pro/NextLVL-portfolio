import type { RefObject, ReactNode } from 'react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { FaGithub, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import heroImg from '../assets/hero.png';
import zackwebLog from '../assets/zackweb-logo.png';
import NameTypography from './NameTypography';
import '../styles/HeroSection.css';

const TECH = [
  { id: 'react', img: '/assets/react-logo.png', label: 'React.js', cls: 'ti-react' },
  { id: 'node', img: '/assets/node-logo.png', label: 'Node.js', cls: 'ti-node' },
  { id: 'spring', img: '/assets/spring-logo.png', label: 'Spring Boot', cls: 'ti-spring' },
  { id: 'java', img: '/assets/java-logo.png', label: 'Java', cls: 'ti-java' },
  { id: 'postgres', img: '/assets/postgres-logo.png', label: 'PostgreSQL', cls: 'ti-pg' },
  { id: 'js', img: '/assets/javascript-logo.png', label: 'JavaScript', cls: 'ti-js' },
];

type HomeSectionProps = {
  theme: string;
  toggleTheme: () => void;
  heroRef: RefObject<HTMLElement | null>;
  iconRefs: RefObject<(HTMLDivElement | null)[]>;
  terminal: ReactNode;
};

export default function HomeSection({ theme, toggleTheme, heroRef, iconRefs, terminal }: HomeSectionProps) {
  return (
    <section className="hero stack-hero" id="home" ref={heroRef}>
      <div className="hero-photo-bg">
        <img src={heroImg} alt="Zakaria Oumghar" className="hero-bg-img" />
        <div className="photo-fade-left" /><div className="photo-fade-right" /><div className="photo-fade-bottom" />
      </div>
      <header className="nav">
        <span className="nav-logo"><img src={zackwebLog} alt="ZACKWEB" style={{ width: '100px' }} /></span>
        <div className="nav-right" style={{ marginRight: '60px' }}>
          <button className="theme-btn" onClick={toggleTheme} aria-label="toggle theme">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <a href="#projects" className="nav-pill">→ View Projects</a>
        </div>
      </header>
      {TECH.map(({ id, img, label, cls }, index) => (
        <div key={id} className={`tech-icon ${cls}`} ref={element => { iconRefs.current[index] = element; }}>
          <div className="ti-box"><img src={img} alt={label} className="ti-img" /></div>
          <span className="ti-label">{label}</span>
        </div>
      ))}
      <div className="text-block">
        <div className="tb-badge">CODING...</div>
        <div className="tb-inner">
          <h1 className="tb-title">Building<span className="tb-highlight"> DIGITAL EXPERIENCES </span>that matter</h1>
          <p className="tb-desc">Full-stack developer crafting elegant solutions.<br />Currently open to work and freelancing.</p>
        </div>
        <div className="tb-ctas">
          <a href="#projects" className="tb-btn tb-primary">View My Work <ArrowRight size={16} strokeWidth={2.5} /></a>
          <a href="#contact" className="tb-btn tb-secondary">Let's Talk</a>
        </div>
      </div>
      {terminal}
      <div className="hero-socials">
        <a href="#" className="hs-link" aria-label="GitHub"><FaGithub size={20} /></a>
        <a href="#" className="hs-link" aria-label="Instagram"><FaInstagram size={20} /></a>
        <a href="#" className="hs-link" aria-label="X"><FaXTwitter size={20} /></a>
      </div>
      <NameTypography />
    </section>
  );
}
