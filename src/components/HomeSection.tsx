import type { RefObject } from 'react';
import { ArrowRight } from 'lucide-react';
import heroImg from '../assets/hero.png';
import zackwebLog from '../assets/zackweb-logo.png';
import '../styles/HeroSection.css';

type HomeSectionProps = { heroRef: RefObject<HTMLElement | null> };

export default function HomeSection({ heroRef }: HomeSectionProps) {
  return <section className="hero stack-hero clean-hero" id="home" ref={heroRef}>
    <div className="hero-photo-bg"><div className="clean-hero-title">ZAKARIA <span>OUMGHAR</span></div><img src={heroImg} alt="Zakaria Oumghar" className="hero-bg-img" /><div className="photo-fade-left" /><div className="photo-fade-right" /><div className="photo-fade-bottom" /></div>
    <header className="nav clean-hero-nav">
      <span className="nav-logo"><img src={zackwebLog} alt="ZACKWEB" /></span>
    </header>
    <div className="text-block clean-hero-copy">
      <div className="tb-badge">DELIVERY SOFTWARE ENGINEER</div>
      <h1 className="tb-title">Building <span className="tb-highlight">digital experiences</span><br />that matter.</h1>
      <p className="tb-desc">Full-stack developer crafting elegant, reliable solutions for the web and beyond.</p>
      <div className="tb-ctas"><a href="#projects" className="tb-btn tb-primary">View My Work <ArrowRight size={16} /></a><a href="#contact" className="tb-btn tb-secondary">Let’s collaborate <ArrowRight size={15} /></a></div>
    </div>
    <div className="clean-hero-role">DELIVERY SOFTWARE ENGINEER <span>·</span> ENSIAS</div>
  </section>;
}
