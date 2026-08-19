import type { RefObject } from 'react';
import { ArrowUpRight, Cloud, Code2, Database, PanelsTopLeft, Server, Smartphone, Sparkles, Terminal } from 'lucide-react';
import '../styles/HeroSection.css';

type HomeSectionProps = { heroRef: RefObject<HTMLElement | null> };

const tech = [
  { src: '/assets/java-logo.png', label: 'Java', cat: 'Backend' },
  { src: '/assets/spring-logo.png', label: 'Spring Boot', cat: 'Framework' },
  { src: '/assets/react-logo.png', label: 'React', cat: 'Frontend' },
  { src: null, label: 'Flutter', cat: 'Mobile' },
  { src: '/assets/postgres-logo.png', label: 'PostgreSQL', cat: 'Database' },
  { src: null, label: 'Docker', cat: 'DevOps' },
];

const buildCapsules = [
  { icon: PanelsTopLeft, name: 'Web Apps', tag: 'Next / React' },
  { icon: Server, name: 'APIs', tag: 'REST / Microservices' },
  { icon: Smartphone, name: 'Mobile', tag: 'Cross-platform' },
  { icon: Database, name: 'Data', tag: 'SQL / Redis' },
  { icon: Cloud, name: 'DevOps', tag: 'CI/CD & Cloud' },
];

export default function HomeSection({ heroRef }: HomeSectionProps) {
  return (
    <section className="hero reference-hero stack-hero" id="home" ref={heroRef}>
      {/* Background grid & ambient illumination */}
      <div className="reference-grid" aria-hidden="true" />
      <div className="portrait-glow" aria-hidden="true" />

      {/* Main Copy */}
      <div className="reference-copy">
        <div className="reference-kicker">
          <span className="kicker-pulse" /> DELIVERY SOFTWARE ENGINEER
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
            VIEW WORK <ArrowUpRight size={17} />
          </a>
          <a className="reference-secondary" href="#contact">
            LET'S TALK <ArrowUpRight size={17} />
          </a>
        </div>
      </div>

      {/* Portrait Stage with Rounded Architectural Frame & Integrated Floating Widgets */}
      <div className="portrait-stage">
        {/* Rounded Glass Frame containing the portrait */}
        <div className="portrait-rounded-frame">
          <div className="portrait-frame-glass-bg" />
          <div className="portrait-frame-inner">
            <img src="/assets/Hero_pic_epic.png" alt="Zakaria Oumghar" className="portrait-img" />
          </div>
          <div className="portrait-frame-border" />
          <div className="portrait-frame-dashed-ring" />
          <div className="portrait-corner-plus top-left">+</div>
          <div className="portrait-corner-plus top-right">+</div>
          <div className="portrait-stamp">ZAKARIA OUMGHAR — ENSIAS ALUMNI 2026</div>
        </div>

        {/* Floating Micro-Widget 1: Left Code Architecture Capsule */}
        <aside className="widget-capsule code-widget">
          <div className="widget-header">
            <div className="widget-icon-box">
              <Terminal size={15} />
            </div>
            <div className="widget-title">
              <strong>Architecture</strong>
              <span>Clean Code & Scalability</span>
            </div>
          </div>
          <div className="widget-code-snippet">
            <code><span className="code-kw">const</span> <span className="code-fn">craft</span> = <span className="code-str">"robust"</span>;</code>
          </div>
          <div className="widget-tags">
            <span className="w-tag">#CleanCode</span>
            <span className="w-tag">#SOLID</span>
          </div>
        </aside>

        {/* Floating Micro-Widget 2: Right Capabilities Widget */}
        <aside className="widget-capsule build-widget">
          <div className="widget-header">
            <Sparkles size={15} className="sparkle-gold" />
            <div className="widget-title">
              <strong>Capabilities</strong>
              <span className="status-online"><i /> Available for Hire</span>
            </div>
          </div>
          <div className="widget-build-pills">
            {buildCapsules.map(({ icon: Icon, name, tag }) => (
              <div className="build-pill-item" key={name}>
                <div className="bpi-icon"><Icon size={13} strokeWidth={1.8} /></div>
                <div className="bpi-copy">
                  <strong>{name}</strong>
                  <small>{tag}</small>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* <div className="visual-index">01 <span>/</span> DIGITAL CRAFT</div> */}

      {/* Bottom Floating Tech Dock */}
      <div className="tech-dock-wrapper">
        <div className="tech-dock-label">TECH STACK & CORE TOOLING</div>
        <div className="tech-dock">
          {tech.map(({ src, label, cat }) => (
            <div className="dock-item" key={label}>
              <div className="dock-icon-wrap">
                {src ? (
                  <img src={src} alt={label} />
                ) : (
                  <b className="dock-fallback">{label[0]}</b>
                )}
              </div>
              <div className="dock-tooltip">
                <strong>{label}</strong>
                <span>{cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
