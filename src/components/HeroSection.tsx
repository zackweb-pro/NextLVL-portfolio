import { useEffect, useRef, useState } from 'react';
import HomeSection from './HomeSection';
import ProjectsSection from './ProjectsSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import CertificationsSection from './CertificationsSection';
import ContactSection from './ContactSection';
import { HamburgerMenu } from './PortfolioChrome';
import '../styles/HeroSection.css';

export default function HeroSection({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const projectsShellRef = useRef<HTMLDivElement | null>(null);
  const projectTrackRef = useRef<HTMLDivElement | null>(null);
  const [projectFilter, setProjectFilter] = useState('All work');
  const [projectComplete, setProjectComplete] = useState(false);
  const [projectOffset, setProjectOffset] = useState(0);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) { revealItems.forEach(item => item.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [projectFilter]);

  useEffect(() => {
    let frame = 0;
    const updateRail = () => {
      const shell = projectsShellRef.current;
      const track = projectTrackRef.current;
      if (!shell || !track) return;
      if (window.matchMedia('(max-width: 768px)').matches) {
        setProjectOffset(0);
        setProjectComplete(true);
        return;
      }
      const bounds = shell.getBoundingClientRect();
      const section = track.parentElement;
      const styles = section ? getComputedStyle(section) : null;
      const padding = styles ? parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight) : 96;
      const visibleWidth = Math.max(1, shell.clientWidth - padding);
      const lastCard = track.lastElementChild as HTMLElement | null;
      const trackRect = track.getBoundingClientRect();
      const lastCardRect = lastCard?.getBoundingClientRect();
      const lastCardEnd = lastCardRect ? lastCardRect.right - trackRect.left : track.scrollWidth;
      const maxOffset = Math.max(0, lastCardEnd - visibleWidth + 524);
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(maxOffset, 1)));
      setProjectOffset(progress * maxOffset);
      setProjectComplete(progress >= 0.999);
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updateRail); };
    updateRail(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [projectFilter]);

  return <div className="page-wrap" data-theme={theme}>
    <a className="persistent-logo" href="#home" aria-label="Go to home"><img src="/assets/zackweb-logo.png" alt="ZACKWEB" /></a>
    <HamburgerMenu theme={theme} toggleTheme={toggleTheme} />
    <HomeSection heroRef={heroRef} />
    <ProjectsSection shellRef={projectsShellRef} trackRef={projectTrackRef} offset={projectOffset} filter={projectFilter} setFilter={setProjectFilter} setComplete={setProjectComplete} />
    <ExperienceSection />
    <EducationSection />
    <CertificationsSection projectComplete={projectComplete} />
    <ContactSection />
    {/* <footer className="footer"><span className="foot-logo">Z·O</span><span className="foot-copy">© 2025 Zakaria Oumghar · Built with React</span><span className="foot-loc">Marrakesh, Morocco</span></footer> */}
  </div>;
}
