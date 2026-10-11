import { useRef, useState, type PointerEvent } from 'react';
import { ArrowRight } from 'lucide-react';

type Project = { n: string; categories: string[]; title: string; tag: string; type: string; image?: string; stack: string[]; desc: string };

const PROJECTS: Project[] = [
  { n: '01', categories: ['Web applications', 'Mobile applications'], title: 'Inforisk / Financial Intelligence', tag: 'Web application · Mobile platform', type: 'atlas', image: '/assets/projects/inforisk.png', stack: ['Java', 'Spring Boot', 'Flutter', 'PostgreSQL', 'Docker'], desc: 'A web and mobile financial information platform for individuals and businesses, covering account, subscription and credit report management. It includes PP/PM report views, payment flows, report sharing, access control, requests, alerts, disputes and document downloads.' },
  { n: '02', categories: ['Web applications'], title: 'OurBusWay', tag: 'Web application · Full stack', type: 'nova', image: '/assets/projects/ourbusway.png', stack: ['Spring Boot', 'Spring Cloud', 'RabbitMQ'], desc: 'Urban transportation digitalization platform with ticketing, subscriptions, live bus tracking, incidents and role-based dashboards.' },
  { n: '03', categories: ['Web applications'], title: 'PipelineX', tag: 'Web application · SecureDevOps', type: 'atlas', image: '/assets/projects/PFA_3A.png', stack: ['DevOps', 'Security', 'GitHub', 'Docker'], desc: 'A SecureDevOps platform that automates DevOps workflows while integrating security from the earliest stages. Projects submitted through GitHub or ZIP are validated, queued and executed through isolated pipeline stages for testing and security analysis, producing centralized reports at the end of the workflow.' },
  { n: '04', categories: ['Web applications'], title: 'ServiQ', tag: 'Web application · UGP · Stage 2A', type: 'nova', image: '/assets/projects/STAGE_2A.png', stack: ['Spring Boot', 'React', 'TypeScript', 'Docker'], desc: 'A modern service-management platform for UGP that centralizes requests, project tracking and feedback. It combines secure role-based access, real-time monitoring and analytics dashboards to improve communication, operational efficiency and decision-making.' },
  { n: '05', categories: ['Web applications'], title: 'ENSIAS Department Management', tag: 'Web application · Microservices', type: 'atlas', image: '/assets/projects/dep_manage.png', stack: ['Spring Boot', 'React.js', 'Docker'], desc: 'A polished web application for managing ENSIAS departments, built with microservices and a more expressive interface.' },
  { n: '06', categories: ['Web applications'], title: 'Stage 1A / Employee Records', tag: 'Web application · Somap & Service', type: 'nova', image: '/assets/projects/dashboardsomap.png', stack: ['React.js', 'Node.js', 'MySQL'], desc: 'A full-stack employee and purchase-request management platform developed during Stage 1A at Somap & Service, with role-based access, approvals and administrative dashboards.' },
  { n: '07', categories: ['Web applications'], title: 'Internship Applications', tag: 'Web application · Student', type: 'nova', image: '/assets/projects/searchstage.png', stack: ['React.js', 'Node.js', 'Oracle DB'], desc: 'A platform connecting students and recruiters for internship applications, backed by Oracle DB on OCI.' },
  { n: '08', categories: ['Other'], title: 'ENSIAS Chatbot', tag: 'Other · Information retrieval', type: 'zackweb', image: '/assets/projects/chatbot_ensias.png', stack: ['Python', 'Flask', 'NeuralIntents'], desc: 'An information-retrieval chatbot for ENSIAS built with Python, Flask and NeuralIntents.' },
  { n: '09', categories: ['Extensions'], title: 'Form Saver Pro', tag: 'Extension · Browser utility', type: 'atlas', image: '/assets/projects/FormSaver%20Pro.png', stack: ['JavaScript', 'Chrome Extension', 'Local Storage'], desc: 'A Chrome extension that keeps form inputs available after a page reload.' },
  { n: '10', categories: ['Web applications'], title: 'Nova Pioneer', tag: 'Web application · Microservices', type: 'atlas', image: '/assets/projects/plateform.png', stack: ['Spring Boot', 'React', 'PostgreSQL', 'Docker', 'NASA API'], desc: 'A web-based space learning platform for school-age children, with age-appropriate courses, NASA-powered real-time content, XP rewards, achievement badges and progress tracking. Its secure microservices architecture supports authentication, parent-child profiles, teacher content contributions, course management and parent dashboards.' },
  { n: '11', categories: ['Extensions'], title: 'UM5 Notes Calculator', tag: 'Extension · Student utility', type: 'nova', image: '/assets/projects/um5-notes-calculator.png', stack: ['JavaScript', 'Chrome Extension', 'Algorithms'], desc: 'A Chrome extension for Mohammed V University students that analyzes portal results, calculates semester and overall averages, detects validated modules and estimates the points needed to validate a module.' },
];

const FILTERS = ['All work', 'Web applications', 'Mobile applications', 'Extensions', 'Other'];
type ProjectsSectionProps = { filter: string; setFilter: (filter: string) => void };

export default function ProjectsSection({ filter, setFilter }: ProjectsSectionProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const filteredProjects = PROJECTS.filter(project => filter === 'All work' || project.categories.includes(filter));
  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3);
  const hiddenCount = filteredProjects.length - visibleProjects.length;

  const selectFilter = (nextFilter: string) => {
    setFilter(nextFilter);
    setShowAll(false);
    viewportRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
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
          {visibleProjects.map((project, index) => <ProjectCard key={project.n} project={project} index={index} />)}
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
  </div>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className={`proj-card reveal-on-scroll delay-${index + 1}`}>
    <div className={`project-art art-${project.type}`} aria-hidden="true">{project.image && <img className="project-art-image" src={project.image} alt="" loading="lazy" />}<div className="art-browser"><i /><i /><i /><span>{project.title.split(' / ')[0].toLowerCase()}.studio</span></div><span className="art-index">{project.n} / {String(PROJECTS.length).padStart(2, '0')}</span></div>
    <div className="pc-body"><div className="pc-top"><span className="pc-num">{project.n}</span><span className="pc-tag">{project.tag}</span></div><h3 className="pc-title">{project.title}</h3><p className="pc-desc">{project.desc}</p><div className="pc-stack">{project.stack.map(tag => <span key={tag} className="pc-chip">{tag}</span>)}</div></div>
  </article>;
}
