import { useEffect, useRef, useState } from 'react';
import HomeSection from './HomeSection';
import ProjectsSection from './ProjectsSection';
import ExperienceSection from './ExperienceSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';
import { HamburgerMenu, Terminal } from './PortfolioChrome';
import '../styles/HeroSection.css';

export default function HeroSection({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (event: MouseEvent) => { const rect = hero.getBoundingClientRect(); const dx = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2); const dy = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2); iconRefs.current.forEach((element, index) => { if (element) element.style.transform = `translate(${dx * (0.5 + (index % 3) * 0.45) * 16}px, ${dy * (0.5 + (index % 3) * 0.45) * 9}px)`; }); };
    const onLeave = () => iconRefs.current.forEach(element => { if (element) element.style.transform = ''; });
    hero.addEventListener('mousemove', onMove); hero.addEventListener('mouseleave', onLeave);
    return () => { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave); };
  }, []);

  return <div className="page-wrap" data-theme={theme}>
    <HamburgerMenu theme={theme} toggleTheme={toggleTheme} />
    <HomeSection theme={theme} toggleTheme={toggleTheme} heroRef={heroRef} iconRefs={iconRefs} terminal={<Terminal />} />
    <ProjectsSection shellRef={projectsShellRef} trackRef={projectTrackRef} offset={projectOffset} filter={projectFilter} setFilter={setProjectFilter} setComplete={setProjectComplete} />
    <ExperienceSection />
    <SkillsSection projectComplete={projectComplete} />
    <ContactSection />
    <footer className="footer"><span className="foot-logo">Z·O</span><span className="foot-copy">© 2025 Zakaria Oumghar · Built with React</span><span className="foot-loc">Marrakesh, Morocco</span></footer>
  </div>;
}
