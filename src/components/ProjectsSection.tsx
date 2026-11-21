import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { PROJECTS, type Project } from '../data/projectCaseStudies';
import ProjectDetails from './ProjectDetails';

const FILTERS = ['All work', 'Web applications', 'Mobile applications', 'Extensions', 'Other'];
type ProjectsSectionProps = { filter: string; setFilter: (filter: string) => void };

export default function ProjectsSection({ filter, setFilter }: ProjectsSectionProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(() => window.location.hash.startsWith('#project/') ? window.location.hash.slice(9) : null);
  const selectedProject = PROJECTS.find(project => project.slug === selectedSlug);
  const nextProject = PROJECTS[(PROJECTS.findIndex(project => project.slug === selectedSlug) + 1) % PROJECTS.length];
  const filteredProjects = PROJECTS.filter(project => filter === 'All work' || project.categories.includes(filter));
  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3);
  const hiddenCount = filteredProjects.length - visibleProjects.length;

  useEffect(() => {
    const synchronizeProject = () => setSelectedSlug(window.location.hash.startsWith('#project/') ? window.location.hash.slice(9) : null);
    window.addEventListener('popstate', synchronizeProject);
    window.addEventListener('hashchange', synchronizeProject);
    return () => {
      window.removeEventListener('popstate', synchronizeProject);
      window.removeEventListener('hashchange', synchronizeProject);
    };
  }, []);

  const openProject = (project: Project) => {
    window.history.pushState({ ...window.history.state, projectDetails: true }, '', `#project/${project.slug}`);
    setSelectedSlug(project.slug);
  };

  const closeProject = () => {
    if (window.history.state?.projectDetails) {
      window.history.back();
    } else {
      window.history.replaceState(null, '', '#projects');
      setSelectedSlug(null);
      requestAnimationFrame(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'instant', block: 'start' }));
    }
  };

  const openNextProject = () => {
    window.history.replaceState(window.history.state, '', `#project/${nextProject.slug}`);
    setSelectedSlug(nextProject.slug);
  };

  const selectFilter = (nextFilter: string) => {
    setFilter(nextFilter);
    setShowAll(false);
    viewportRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if ((event.target as HTMLElement).closest('button, a')) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    dragState.current = { active: true, startX: event.clientX, scrollLeft: viewport.scrollLeft };
    viewport.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport || !dragState.current.active) return;
    const distance = event.clientX - dragState.current.startX;
    viewport.scrollLeft = dragState.current.scrollLeft - distance;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    if (viewportRef.current?.hasPointerCapture(event.pointerId)) {
      viewportRef.current.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const revealAllProjects = () => setShowAll(true);

  return <div className="projects-scroll-shell" id="projects">
    <section className="section stack-section projects-section">
      <div className="sec-head projects-head reveal-on-scroll"><div><span className="sec-tag">/ Selected work · 2024—26</span><h2 className="sec-title">Built by <em>Zackweb</em></h2></div><p className="projects-intro">A selection of digital products, academic & work projects.</p></div>
      <div className="project-filters reveal-on-scroll" role="tablist" aria-label="Project filters">
        {FILTERS.map(current => { const count = current === 'All work' ? PROJECTS.length : PROJECTS.filter(project => project.categories.includes(current)).length; return <button key={current} className={`filter-btn ${filter === current ? 'is-active' : ''}`} type="button" onClick={() => selectFilter(current)}>{current} <span>{String(count).padStart(2, '0')}</span></button>; })}
        <a href="https://github.com/zackweb-pro" target="_blank" rel="noreferrer" className="all-work-link">For more projects, visit my GitHub <ArrowRight size={15} /></a>
      </div>
      <div className="project-rail-meta" aria-hidden="true">
        <span>{showAll ? `${filteredProjects.length} projects` : `${visibleProjects.length} featured projects`}</span>
        <span>Drag or scroll to explore <ArrowRight size={13} /></span>
      </div>
      <div
        className={`project-viewport ${isDragging ? 'is-dragging' : ''}`}
        ref={viewportRef}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={event => event.preventDefault()}
        tabIndex={0}
        aria-label="Projects carousel. Drag horizontally or use the arrow keys to explore."
      >
        <div className="proj-grid project-rail">
          {visibleProjects.map((project, index) => <ProjectCard key={project.n} project={project} index={index} onOpen={() => openProject(project)} />)}
          {hiddenCount > 0 && <button className="projects-more-card" type="button" onClick={revealAllProjects}>
            <span>03 / {String(filteredProjects.length).padStart(2, '0')} shown</span>
            <strong>See all<br /><em>{hiddenCount} more projects</em></strong>
            <p>Open the complete project collection.</p>
            <i>Explore all <ArrowRight size={16} /></i>
          </button>}
          {visibleProjects.length === 0 && <div className="projects-empty"><span>00 / MOBILE</span><strong>Mobile work is<br /><em>coming next.</em></strong><p>No mobile applications in this collection yet.</p></div>}
        </div>
      </div>
    </section>
    {selectedProject && <ProjectDetails project={selectedProject} nextProject={nextProject} onClose={closeProject} onNext={openNextProject} />}
  </div>;
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return <article className={`proj-card reveal-on-scroll delay-${index + 1}`}>
    <div className={`project-art art-${project.type}`} aria-hidden="true"><img className="project-art-image" src={project.image} alt="" loading="lazy" /></div>
    <div className="pc-body"><div className="pc-top"><span className="pc-num">{project.n}</span><span className="pc-tag">{project.tag}</span></div><h3 className="pc-title">{project.title}</h3><p className="pc-desc">{project.desc}</p><div className="pc-stack">{project.stack.map(tag => <span key={tag} className="pc-chip">{tag}</span>)}</div><button className="project-case-open" type="button" onClick={onOpen} aria-label={`Read ${project.title} case study`}>Explore the project</button></div>
  </article>;
}
