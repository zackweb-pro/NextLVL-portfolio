import type { RefObject } from 'react';
import { ArrowUpRight } from 'lucide-react';
import '../styles/HeroSection.css';

type HomeSectionProps = { heroRef: RefObject<HTMLElement | null> };

const tech = [
  { src: '/assets/java-logo.png', label: 'Java', cat: 'Backend' },
  { src: '/assets/spring-logo.png', label: 'Spring Boot', cat: 'Framework' },
  { src: '/assets/react-logo.png', label: 'React', cat: 'Frontend' },
  { src: '/assets/Flutter_logo.webp', label: 'Flutter', cat: 'Mobile' },
  { src: '/assets/postgres-logo.png', label: 'PostgreSQL', cat: 'Database' },
  { src: '/assets/Docker_logo.webp', label: 'Docker', cat: 'DevOps' },
];

export default function HomeSection({ heroRef }: HomeSectionProps) {
  return (
    <section className="hero reference-hero stack-hero" id="home" ref={heroRef}>
      <nav className="hero-top-nav" aria-label="Primary navigation">
        <a className="is-active" href="#home" aria-current="page">Home</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#education">Education</a>
        <a href="#certifications">Certifications</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="reference-grid" aria-hidden="true" />

      <div className="hero-layout">
        <div className="hero-left">
          <div className="reference-copy">
            <div className="reference-kicker">
              <span className="kicker-pulse" /> Delivery software engineer
            </div>
            <h1>
              Building digital<br />
              <em>experiences</em><br />
              that make you<br />
              go woooow!
            </h1>
            <p>
              Specialized in high-performance web systems, resilient APIs,<br className="desktop-break" />
              and crafted user interfaces that leave a lasting impression.
            </p>
            <div className="reference-actions">
              <a className="reference-primary" href="#projects">
                View work <ArrowUpRight size={15} />
              </a>
              <a className="reference-secondary" href="#contact">
                Let's talk <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <div className="tech-dock-wrapper">
            <div className="tech-dock-label">Tech stack &amp; core tooling</div>
            <div className="tech-dock">
              {tech.map(({ src, label, cat }) => (
                <div className="dock-item" key={label}>
                  <div className="dock-icon-wrap">
                    <img src={src} alt={label} />
                  </div>
                  <div className="dock-tooltip">
                    <strong>{label}</strong>
                    <span>{cat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="portrait-stage">
            <div className="portrait-dot-field" aria-hidden="true" />
            <div className="portrait-orbit" aria-hidden="true" />

            <div className="portrait-note" aria-hidden="true">
              <span>ENSIAS</span>
              <em>Graduate</em>
              <small>2026</small>
            </div>

            <figure className="portrait-photo-card">
              <div className="portrait-image-shell">
                <img
                  src="/assets/graduated-me.jpeg"
                  alt="Zakaria Oumghar wearing his graduation gown"
                  className="portrait-img"
                />
              </div>
              <figcaption className="portrait-nameplate">
                <span>Zakaria Oumghar</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
