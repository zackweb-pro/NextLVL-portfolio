import { useEffect, useRef, useState } from 'react';
import HomeSection from './HomeSection';
import ProjectsSection from './ProjectsSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import CertificationsSection from './CertificationsSection';
import ContactSection from './ContactSection';
import { HamburgerMenu } from './PortfolioChrome';
import ScrollRail from './ScrollRail';
import '../styles/HeroSection.css';
import '../styles/ScrollRail.css';

export default function HeroSection({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const [projectFilter, setProjectFilter] = useState('All work');

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) { revealItems.forEach(item => item.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [projectFilter]);

  return <div className="page-wrap" data-theme={theme}>
    <a className="persistent-logo" href="#home" aria-label="Go to home"><img src="/assets/zackweb-logo.png" alt="ZACKWEB" /></a>
    <HamburgerMenu theme={theme} toggleTheme={toggleTheme} />
    <ScrollRail />
    <HomeSection heroRef={heroRef} />
    <ProjectsSection filter={projectFilter} setFilter={setProjectFilter} />
    <ExperienceSection />
    <EducationSection />
    <CertificationsSection />
    <ContactSection />
    {/* <footer className="footer"><span className="foot-logo">Z·O</span><span className="foot-copy">© 2025 Zakaria Oumghar · Built with React</span><span className="foot-loc">Marrakesh, Morocco</span></footer> */}
  </div>;
}
