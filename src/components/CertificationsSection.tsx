import StickySection from './StickySection';
import { useEffect, useRef } from 'react';

const CERTIFICATIONS = [
  { title: 'Responsive Web Design', issuer: 'freeCodeCamp', image: '/assets/certifications/responsive_web_design_freecodecamp_300hr.png' },
  { title: 'Data Analytics', issuer: 'IBM SkillsBuild', image: '/assets/certifications/IBMDesign20260813-20-29uiqn-1.png' },
  { title: 'Artificial Intelligence Analyst', issuer: 'IBM SkillsBuild', image: '/assets/certifications/IBMDesign20260813-20-92v8e9-1.png' },
  { title: 'React (Basic)', issuer: 'HackerRank', image: '/assets/certifications/react_basic certificate-1.png' },
  { title: 'JavaScript (Intermediate)', issuer: 'HackerRank', image: '/assets/certifications/javascript_intermediate certificate-1.png' },
  { title: 'JavaScript & jQuery', issuer: 'Eduonix', image: '/assets/certifications/javascript_jquery_eduonix.jpg' },
  { title: 'Microservices & IoT', issuer: 'Orange', image: '/assets/certifications/microservices_iot_orange.png' },
  { title: 'Python (Basic)', issuer: 'HackerRank', image: '/assets/certifications/python_basic_hackerrank.png' },
  { title: 'SQL (Intermediate)', issuer: 'HackerRank', image: '/assets/certifications/sql_intermediate certificate-1.png' },
];

export default function CertificationsSection({ projectComplete }: { projectComplete: boolean }) {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: 0.12 });
    grid.querySelectorAll('.certification-card').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return <StickySection id="certifications" className={`section stack-section certifications-section ${projectComplete ? 'project-stage-done' : ''}`}>
    <div className="sec-head"><span className="sec-tag">/ Certifications</span><h2 className="sec-title">Proof of <em>practice</em></h2><p className="certifications-intro">My passion for technology started in 2020 and continues through every project, skill and certification.</p></div>
    <div className="certifications-grid" ref={gridRef}>
      {CERTIFICATIONS.map(certification => <article className="certification-card reveal-on-scroll" key={certification.title}>
        <div className="certification-image-wrap"><img src={certification.image} alt={`${certification.title} certification`} loading="lazy" /></div>
        <div className="certification-copy"><h3>{certification.title}</h3><span>{certification.issuer}</span></div>
      </article>)}
    </div>
    <p className="certifications-footer">For more certifications, visit <a href="https://www.linkedin.com/in/zakaria-oumghar-gl" target="_blank" rel="noreferrer">my LinkedIn ↗</a></p>
  </StickySection>;
}
