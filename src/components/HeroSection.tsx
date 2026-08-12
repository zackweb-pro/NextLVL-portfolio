import { useState, useEffect, useRef } from 'react';
import {
  Sun, Moon, Mail, FileText, ChevronRight, ArrowRight
} from 'lucide-react';
import { FaGithub, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import heroImg from '../assets/hero.png';
import '../styles/HeroSection.css';
import zackwebLog from '../assets/zackweb-logo.png';
import NameTypography from './NameTypography';

/* ─── Tech Stack Images ─────────────────────────────────────── */
// NOTE: Replace these paths with actual tech logo images in /public/assets
const TECH = [
  { id: 'react',    img: '/assets/react-logo.png',      label: 'React.js',    cls: 'ti-react'  },
  { id: 'node',     img: '/assets/node-logo.png',       label: 'Node.js',     cls: 'ti-node'   },
  { id: 'spring',   img: '/assets/spring-logo.png',     label: 'Spring Boot', cls: 'ti-spring' },
  { id: 'java',     img: '/assets/java-logo.png',       label: 'Java',        cls: 'ti-java'   },
  { id: 'postgres', img: '/assets/postgres-logo.png',   label: 'PostgreSQL',  cls: 'ti-pg'     },
  { id: 'js',       img: '/assets/javascript-logo.png', label: 'JavaScript',  cls: 'ti-js'     },
];

/* ─── Skills with proficiency levels ──────────────────────────── */
const SKILLS = [
  { name: 'React.js',    img: '/assets/react-logo.png',      pct: 88 },
  { name: 'Node.js',     img: '/assets/node-logo.png',       pct: 82 },
  { name: 'Spring Boot', img: '/assets/spring-logo.png',     pct: 79 },
  { name: 'Java',        img: '/assets/java-logo.png',       pct: 84 },
  { name: 'PostgreSQL',  img: '/assets/postgres-logo.png',   pct: 76 },
  { name: 'JavaScript',  img: '/assets/javascript-logo.png', pct: 90 },
];

/* ─── Functional Terminal ─────────────────────────────────── */
const COMMANDS = {
  help: () => [
    '  Available commands:',
    '  about     — who is Zakaria',
    '  skills    — tech stack',
    '  projects  — shipped work',
    '  contact   — get in touch',
    '  clear     — clear terminal',
    '  ls        — list files',
  ],
  about: () => [
    '  Name    : Zakaria Oumghar',
    '  Role    : Software Engineering Student',
    '  Based   : Marrakesh, Morocco',
    '  Status  : Open to internships 2025',
  ],
  skills: () => [
    '  Frontend : React.js · JavaScript · CSS',
    '  Backend  : Node.js · Spring Boot · Java',
    '  Database : PostgreSQL',
    '  Tools    : Git · REST APIs · Docker',
  ],
  projects: () => [
    '  [1] E-Commerce Platform  → React · Node · PG',
    '  [2] Task Manager API     → Spring · Java · PG',
    '  [3] Portfolio Site       → React · CSS',
  ],
  contact: () => [
    '  Email    : zakaria@example.com',
    '  GitHub   : github.com/zakaria-oumghar',
    '  LinkedIn : linkedin.com/in/zakaria-oumghar',
  ],
  ls: () => [
    '  total 48',
    '  drwxr-xr-x  5 zakaria dev  4096 Apr 03  about/',
    '  -rw-r--r--  1 zakaria dev   128 Apr 03  name.txt',
    '  -rw-r--r--  1 zakaria dev   256 Apr 03  role.txt',
    '  -rw-r--r--  1 zakaria dev   512 Apr 03  skills.json',
    '  -rw-r--r--  1 zakaria dev   128 Apr 03  \u001b[35mupcoming-blogs.json\u001b[0m',
  ],
  whoami: () => ['  zakaria'],
  pwd:    () => ['  /home/zakaria'],
  date:   () => [`  ${new Date().toDateString()}`],
  uname:  () => ['  zackweb-sh 1.0.0 · macmini'],
};

function Terminal() {
  const [history, setHistory] = useState([
    { type: 'meta', text: 'Last login: Fri April 01 12:15:40AM at berrechid' },
    { type: 'hint', text: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIdx, setCmdIdx]   = useState(-1);
  const bodyRef  = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [history]);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const newH = [...history, { type: 'input', text: cmd }];

    if (!cmd) { setHistory(newH); return; }

    if (cmd === 'clear') { setHistory([]); setInput(''); return; }

    const fn = COMMANDS[cmd];
    const output = fn
      ? fn().map(t => ({ type: 'output', text: t }))
      : [{ type: 'error', text: `  command not found: ${cmd}. Try "help".` }];

    setHistory([...newH, ...output]);
    setCmdHistory(prev => [raw, ...prev]);
    setCmdIdx(-1);
    setInput('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { run(input); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const ni = Math.min(cmdIdx + 1, cmdHistory.length - 1);
      setCmdIdx(ni);
      setInput(cmdHistory[ni] || '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const ni = Math.max(cmdIdx - 1, -1);
      setCmdIdx(ni);
      setInput(ni === -1 ? '' : cmdHistory[ni]);
    }
  };

  /* colour helper for ls-style pink highlight */
  const renderText = (text) => {
    if (text.includes('\u001b[35m')) {
      const parts = text.split(/\u001b\[35m|\u001b\[0m/);
      return <>{parts[0]}<span className="term-hi">{parts[1]}</span>{parts[2]}</>;
    }
    return text;
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      {/* Title bar */}
      <div className="term-bar">
        <span className="tdot red"   />
        <span className="tdot yellow"/>
        <span className="tdot green" />
        <span className="term-title">macmini — ~zackweb-sh — 120×30</span>
      </div>

      {/* Body */}
      <div className="term-body" ref={bodyRef}>
        {history.map((h, i) => (
          <div key={i} className={`tline tline-${h.type}`}>
            {h.type === 'input' && <span className="tprompt">zackweb:~$ </span>}
            <span className="ttext">{renderText(h.text)}</span>
          </div>
        ))}

        {/* Active input row */}
        <div className="tline tline-active">
          <span className="tprompt">zackweb:~$ </span>
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="terminal input"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Liquid Glass Hamburger Menu ─────────────────────────── */
function HamburgerMenu({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home',     href: '#home'     },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills',   href: '#skills'   },
    { label: 'Contact',  href: '#contact'  },
  ];

  return (
    <>
      {/* Trigger button */}
      <button
        className={`ham-btn ${open ? 'ham-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className="ham-line" />
        <span className="ham-line" />
        <span className="ham-line" />
      </button>

      {/* Backdrop */}
      {open && <div className="menu-backdrop" onClick={() => setOpen(false)} />}

      {/* Liquid glass vertical panel */}
      <nav className={`glass-menu ${open ? 'glass-open' : ''}`}>
        {/* Logo inside */}
        <div className="glass-logo">Z·O</div>

        {/* Links */}
        <ul className="glass-links">
          {links.map(({ label, href }, i) => (
            <li key={label} style={{ animationDelay: `${i * 0.07 + 0.1}s` }}>
              <a
                href={href}
                className="glass-link"
                onClick={() => setOpen(false)}
              >
                <ChevronRight size={14} className="gl-arrow" />
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="glass-divider" />

        {/* Theme toggle inside menu */}
        <button className="glass-theme" onClick={toggleTheme}>
          {theme === 'light'
            ? <><Moon size={15} /> Dark mode</>
            : <><Sun  size={15} /> Light mode</>}
        </button>

        {/* Social row */}
        <div className="glass-socials">
          <a href="#" aria-label="GitHub"><FaGithub size={18} /></a>
          <a href="#" aria-label="Instagram"><FaInstagram size={18} /></a>
          <a href="#" aria-label="X"><FaXTwitter size={18} /></a>
        </div>

        {/* Decorative index numbers */}
        <div className="glass-index">
          {['01','02','03','04'].map(n => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </nav>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export default function HeroSection({ theme, toggleTheme }) {
  const heroRef  = useRef(null);
  const iconRefs = useRef([]);
  const [projectFilter, setProjectFilter] = useState('All work');
  const [projectComplete, setProjectComplete] = useState(false);
  const projectsShellRef = useRef(null);
  const projectTrackRef = useRef(null);
  const [projectOffset, setProjectOffset] = useState(0);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(item => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [projectFilter]);

  useEffect(() => {
    let frame = 0;
    const updateProjectRail = () => {
      const shell = projectsShellRef.current;
      const track = projectTrackRef.current;
      if (!shell || !track) return;
      const bounds = shell.getBoundingClientRect();
      const section = track.parentElement;
      const sectionStyles = section ? getComputedStyle(section) : null;
      const sidePadding = sectionStyles
        ? parseFloat(sectionStyles.paddingLeft) + parseFloat(sectionStyles.paddingRight)
        : 96;
      const visibleRailWidth = Math.max(1, shell.clientWidth - sidePadding);
      // Use the real final card edge rather than the rail's trailing padding.
      // This guarantees Project 08 itself is fully inside the viewport.
      const lastCard = track.lastElementChild as HTMLElement | null;
      const trackRect = track.getBoundingClientRect();
      const lastCardRect = lastCard?.getBoundingClientRect();
      const lastCardEnd = lastCardRect
        ? lastCardRect.right - trackRect.left
        : track.scrollWidth;
      // Add the remaining end travel so the final card can fully enter the
      // viewport before the next panel takes over.
      const maxOffset = Math.max(0, lastCardEnd - visibleRailWidth + 524);
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(maxOffset, 1)));
      setProjectComplete(progress >= 0.999);
      setProjectOffset(progress * maxOffset);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProjectRail);
    };
    updateProjectRail();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [projectFilter]);

  /* Mouse parallax on tech icons */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const r  = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      iconRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = 0.5 + (i % 3) * 0.45;
        el.style.transform = `translate(${dx * d * 16}px, ${dy * d * 9}px)`;
      });
    };
    const onLeave = () => iconRefs.current.forEach(el => { if (el) el.style.transform = ''; });
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <div className="page-wrap" data-theme={theme}>
      {/* Hamburger menu at page level for proper backdrop rendering */}
      <HamburgerMenu theme={theme} toggleTheme={toggleTheme} />

      {/* ══ HERO SECTION ══════════════════════════════════ */}
      <section className="hero stack-hero" id="home" ref={heroRef}>

        {/* Full-bleed photo as background */}
        <div className="hero-photo-bg">
          <img src={heroImg} alt="Zakaria Oumghar" className="hero-bg-img" />
          {/* Side fades to blend with bg colour */}
          <div className="photo-fade-left"  />
          <div className="photo-fade-right" />
          <div className="photo-fade-bottom"/>
        </div>

        {/* ── NAV bar ── */}
        <header className="nav">
          <span className="nav-logo">
            <img src={zackwebLog} alt="ZACKWEB" style={{width: "100px"}} />
          </span>

          <div className="nav-right" style={{marginRight: "60px"}}>
            {/* Theme toggle (desktop) */}
            <button className="theme-btn" onClick={toggleTheme} aria-label="toggle theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* "View Projects" pill */}
            <a href="#projects" className="nav-pill">
              → View Projects
            </a>
          </div>
        </header>

        {/* ── Floating tech icons ── */}
        {TECH.map(({ id, img, label, cls }, i) => (
          <div
            key={id}
            className={`tech-icon ${cls}`}
            ref={el => { iconRefs.current[i] = el; }}
          >
            <div className="ti-box">
              <img src={img} alt={label} className="ti-img" />
            </div>
            <span className="ti-label">{label}</span>
          </div>
        ))}

        {/* ── Text block (bottom-left) ── */}
        <div className="text-block">
          <div className="tb-badge">CODING...</div>
          <div className="tb-inner">
            <h1 className="tb-title">
              Building
              <span className="tb-highlight"> digital experiences </span>
              that matter
            </h1>
            <p className="tb-desc">
              Full-stack developer crafting elegant solutions.<br/>
              Currently open to work and freelancing.
            </p>
          </div>
          <div className="tb-ctas">
            <a href="#projects" className="tb-btn tb-primary">
              View My Work <ArrowRight size={16} strokeWidth={2.5} />
            </a>
            <a href="#contact" className="tb-btn tb-secondary">
              Let's Talk
            </a>
          </div>
        </div>

        {/* ── Terminal (top-right) ── */}
        <Terminal />

        {/* ── Social links (bottom-left under text block) ── */}
        <div className="hero-socials">
          <a href="#" className="hs-link" aria-label="GitHub">
            <FaGithub size={20} />
          </a>
          <a href="#" className="hs-link" aria-label="Instagram">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="hs-link" aria-label="X">
            <FaXTwitter size={20} />
          </a>
        </div>

     


        {/* ── Name Typography Component (Bottom-right with fancy animation) ── */}
        <NameTypography />

      </section>

      {/* ══ PROJECTS ══════════════════════════════════════ */}
      <div className="projects-scroll-shell" id="projects" ref={projectsShellRef}>
      <section className="section stack-section projects-section">
        <div className="sec-head projects-head reveal-on-scroll">
          <div>
            <span className="sec-tag">/ Selected work · 2024—25</span>
            <h2 className="sec-title">Built by <em>Zackweb</em></h2>
          </div>
          <p className="projects-intro">A selection of digital products, experiments and systems we shaped from first sketch to final release.</p>
        </div>
        <div className="project-filters reveal-on-scroll" role="tablist" aria-label="Project filters">
          {['All work', 'Product', 'Systems', 'Experiments'].map(filter => (
            <button key={filter} className={`filter-btn ${projectFilter === filter ? 'is-active' : ''}`} type="button" onClick={() => { setProjectFilter(filter); setProjectComplete(false); }}>
              {filter} <span>{filter === 'All work' ? '08' : filter === 'Product' ? '03' : filter === 'Systems' ? '02' : '03'}</span>
            </button>
          ))}
          <a href="#contact" className="all-work-link">Start a project <ArrowRight size={15} /></a>
        </div>
        <div className="proj-grid project-rail" ref={projectTrackRef} style={{ transform: `translate3d(-${projectOffset}px, 0, 0)` }}>
          {[
            { n:'01', category:'Product', title:'OurBusWay', tag:'Platform · Full stack', type:'nova', image:'/assets/projects/ourbusway.png', stack:['Spring Boot','Spring Cloud','RabbitMQ'],
              desc:'Urban transportation digitalization platform with ticketing, subscriptions, live bus tracking, incidents and role-based dashboards.' },
            { n:'02', category:'Systems', title:'ENSIAS Department Management', tag:'Systems · Microservices', type:'atlas', image:'/assets/projects/dep_manage.png', stack:['Spring Boot','React.js','Docker'],
              desc:'A polished web application for managing ENSIAS departments, built with microservices and a more expressive interface.' },
            { n:'03', category:'Product', title:'SOMAP / Employee Records', tag:'Product · Internship', type:'nova', image:'/assets/projects/dashboardsomap.png', stack:['React.js','Node.js','MySQL'],
              desc:'Employee records and purchase-request management with dedicated administrator and responsible-user roles.' },
            { n:'04', category:'Product', title:'Internship Applications', tag:'Platform · Student', type:'nova', image:'/assets/projects/searchstage.png', stack:['React.js','Node.js','Oracle DB'],
              desc:'A platform connecting students and recruiters for internship applications, backed by Oracle DB on OCI.' },
            { n:'05', category:'Experiments', title:'ENSIAS Chatbot', tag:'Bot · Information retrieval', type:'zackweb', image:'/assets/projects/chatbot_ensias.png', stack:['Python','Flask','NeuralIntents'],
              desc:'An information-retrieval chatbot for ENSIAS built with Python, Flask and NeuralIntents.' },
            { n:'06', category:'Experiments', title:'Form Saver Pro', tag:'Extension · Utility', type:'atlas', image:'/assets/projects/FormSaver%20Pro.png', stack:['JavaScript','Chrome Extension','Local Storage'],
              desc:'A Chrome extension that keeps form inputs available after a page reload.' },
            { n:'07', category:'Systems', title:'Platform / Service Core', tag:'Systems · Backend', type:'atlas', image:'/assets/projects/plateform.png', stack:['Java','PostgreSQL','Docker'],
              desc:'A service foundation focused on dependable data, clear operations and scalable delivery.' },
            { n:'08', category:'Experiments', title:'Portfolio / Zackweb', tag:'Experiment · Identity', type:'zackweb', image:'/assets/projects/portfolio-image.jpeg', stack:['React','Motion','Brand system'],
              desc:'The evolving visual identity and portfolio system behind Zackweb and the team’s digital work.' },
          ].filter(p => projectFilter === 'All work' || p.category === projectFilter).map((p, index) => (
            <article key={p.n} className={`proj-card reveal-on-scroll delay-${index + 1}`}>
              <div className={`project-art art-${p.type}`} aria-hidden="true">
                {p.image && <img className="project-art-image" src={p.image} alt="" loading="lazy" />}
                <div className="art-browser"><i /><i /><i /><span>{p.title.split(' / ')[0].toLowerCase()}.studio</span></div>
                <div className="art-content">
                  {p.type === 'nova' && <><small>Good design, made useful.</small><strong>Find your<br/><em>everyday.</em></strong><div className="art-product" /></>}
                  {p.type === 'atlas' && <><small>MONDAY / 09:41</small><strong>Make space<br/>for progress.</strong><div className="art-chart"><b /><b /><b /><b /><b /></div></>}
                  {p.type === 'zackweb' && <><small>SELECTED PRACTICE</small><strong>Ideas into<br/><em>interfaces.</em></strong><div className="art-orbit" /></>}
                </div>
                <span className="art-index">{p.n} / 08</span>
              </div>
              <div className="pc-body">
                <div className="pc-top">
                  <span className="pc-num">{p.n}</span>
                  <span className="pc-tag">{p.tag}</span>
                </div>
                <h3 className="pc-title">{p.title}</h3>
                <p className="pc-desc">{p.desc}</p>
                <div className="pc-stack">{p.stack.map(s => <span key={s} className="pc-chip">{s}</span>)}</div>
                <button className="pc-btn" type="button">Explore case study <ArrowRight size={14}/></button>
              </div>
            </article>
          ))}
        </div>
      </section>
      </div>

      {/* ══ SKILLS ════════════════════════════════════════ */}
      <section className={`section stack-section skills-section ${projectComplete ? 'project-stage-done' : ''}`} id="skills">
        <div className="sec-head">
          <span className="sec-tag">/ Tech Stack</span>
          <h2 className="sec-title">Tools I <em>Master</em></h2>
        </div>
        <div className="skills-list">
          {SKILLS.map(({ name, img, pct }) => (
            <div key={name} className="skill-row">
              <div className="sk-icon">
                <img src={img} alt={name} className="sk-img" />
              </div>
              <div className="sk-info">
                <div className="sk-head">
                  <span className="sk-name">{name}</span>
                  <span className="sk-pct">{pct}%</span>
                </div>
                <div className="sk-track">
                  <div className="sk-fill" style={{'--w':`${pct}%`} as React.CSSProperties} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════════ */}
      <section className="section stack-section contact-sec" id="contact">
        <div className="sec-head" style={{textAlign:'center'}}>
          <span className="sec-tag" style={{justifyContent:'center'}}>/ Contact</span>
          <h2 className="sec-title">
            Let's build something<br/><em>remarkable</em> together.
          </h2>
          <p className="contact-sub">
            Actively looking for internships and collaborations.<br/>
            I reply within 24 hours.
          </p>
        </div>
        <div className="contact-ctas">
          <a href="mailto:zakaria@example.com" className="cc-primary">
            <Mail size={18}/> zakaria@example.com
          </a>
          <a href="#" className="cc-secondary">
            <FileText size={16}/> Download CV
          </a>
        </div>
        <div className="contact-links">
          {['GitHub ↗','LinkedIn ↗','X (Twitter) ↗'].map(l => (
            <a key={l} href="#" className="cl-link">{l}</a>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════ */}
      <footer className="footer">
        <span className="foot-logo">Z·O</span>
        <span className="foot-copy">© 2025 Zakaria Oumghar · Built with React</span>
        <span className="foot-loc">Marrakesh, Morocco</span>
      </footer>

    </div>
  );
}
