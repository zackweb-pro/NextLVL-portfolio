import { useEffect, useRef, type CSSProperties } from 'react';
import { Code2, Globe, Layers3, X } from 'lucide-react';
import type { Project } from '../data/projectCaseStudies';
import ProjectArchitecture from './ProjectArchitecture';
import '../styles/ProjectDetails.css';

type ProjectDetailsProps = { project: Project; nextProject: Project; onClose: () => void; onNext: () => void };

export default function ProjectDetails({ project, nextProject, onClose, onNext }: ProjectDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const primaryLink = project.sources.find(source => source.kind === 'Chrome Web Store' && source.href) ?? project.sources.find(source => source.kind === 'Repository' && source.href);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    const previousTitle = document.title;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    document.title = `${project.title} — Zakaria Oumghar`;
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [project]);

  const goToSection = (id: string) => {
    const scroll = scrollRef.current;
    const section = scroll?.querySelector(`#${id}`);
    if (!scroll || !section) return;
    const heading = section.querySelector('.case-section-heading') ?? section;
    const headerHeight = scroll.querySelector('.case-topbar')?.getBoundingClientRect().height ?? 76;
    const top = heading.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop - headerHeight - 24;
    scroll.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  return (
    <dialog className="project-details-dialog" ref={dialogRef} data-project={project.slug} aria-labelledby="case-study-title" onCancel={event => { event.preventDefault(); onClose(); }} style={{ '--case-accent': project.accent } as CSSProperties}>
      <div className="case-study-scroll" ref={scrollRef}>
        <header className="case-topbar">
          <button className="case-back" type="button" onClick={onClose}>All work</button>
          <span className="case-wordmark">ZACKWEB<span> / Selected work</span></span>
          <button className="case-close" type="button" onClick={onClose} aria-label="Close project details"><X size={20} /></button>
        </header>
        <main className="case-study">
          <section className="case-intro">
            <div className="case-eyebrow"><span>{project.tag}</span><span>{project.context}</span></div>
            <h1 id="case-study-title">{project.headline.split('\n').map((line, index) => <span key={line} className={index ? 'case-title-soft' : ''}>{line}</span>)}</h1>
            <div className="case-intro-bottom"><p>{project.desc}</p>{primaryLink && <a className="case-primary-link" href={primaryLink.href} target="_blank" rel="noreferrer">{primaryLink.kind === 'Chrome Web Store' ? <Globe size={17} /> : <Code2 size={17} />}{primaryLink.kind === 'Chrome Web Store' ? 'View published extension' : 'Explore the source'}</a>}</div>
          </section>

          <figure className="case-product-figure"><div className="case-product-frame"><img src={project.image} alt={`${project.title} application interface`} /></div><figcaption><span>{project.title}</span><span>Product interface</span></figcaption></figure>

          <nav className="case-section-nav" aria-label="Case study sections">
            <button type="button" onClick={() => goToSection('case-overview')}>The project</button>
            <button type="button" onClick={() => goToSection('case-architecture')}>Architecture</button>
            <button type="button" onClick={() => goToSection('case-decisions')}>Engineering notes</button>
          </nav>

          <section className="case-overview case-section" id="case-overview">
            <div className="case-section-heading"><span className="case-label">The project</span><h2>Beyond the interface.</h2></div>
            <div className="case-overview-grid"><article><span className="case-label">The challenge</span><p>{project.challenge}</p></article><article><span className="case-label">The deliverable</span><p>{project.delivery}</p></article></div>
            <div className="case-contribution"><div><Code2 size={21} /><h3>My contribution</h3></div><p>{project.contribution}</p></div>
            <div className="case-capabilities">{project.capabilities.map(item => <article key={item.title}><span className="case-capability-mark" aria-hidden="true" /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
          </section>

          <section className="case-section" id="case-architecture">
            <div className="case-section-heading"><span className="case-label"><Layers3 size={16} /> System architecture</span><h2>{project.architecture.title}</h2><p>A closer look at the components, boundaries, and connections behind the experience.</p></div>
            <ProjectArchitecture key={project.slug} project={project} />
          </section>

          <section className="case-section" id="case-decisions">
            <div className="case-section-heading"><span className="case-label">Engineering notes</span><h2>The details do the work.</h2></div>
            <div className="case-decision-list">{project.decisions.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
            <div className="case-stack"><span className="case-label">The working stack</span><div>{project.stack.map(item => <span key={item}>{item}</span>)}</div></div>
          </section>

          <footer className="case-footer"><div><span className="case-label">Keep exploring</span><button type="button" onClick={onNext}>{nextProject.title}<span>View next project</span></button></div><button className="case-return" type="button" onClick={onClose}>Back to all work</button></footer>
        </main>
      </div>
    </dialog>
  );
}
