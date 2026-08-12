import type { RefObject } from 'react';
import { ArrowRight } from 'lucide-react';

type Project = { n: string; category: string; title: string; tag: string; type: string; image?: string; stack: string[]; desc: string };

const PROJECTS: Project[] = [
  { n:'01', category:'Web applications', title:'OurBusWay', tag:'Web application · Full stack', type:'nova', image:'/assets/projects/ourbusway.png', stack:['Spring Boot','Spring Cloud','RabbitMQ'], desc:'Urban transportation digitalization platform with ticketing, subscriptions, live bus tracking, incidents and role-based dashboards.' },
  { n:'02', category:'Web applications', title:'ENSIAS Department Management', tag:'Web application · Microservices', type:'atlas', image:'/assets/projects/dep_manage.png', stack:['Spring Boot','React.js','Docker'], desc:'A polished web application for managing ENSIAS departments, built with microservices and a more expressive interface.' },
  { n:'03', category:'Web applications', title:'SOMAP / Employee Records', tag:'Web application · Internship', type:'nova', image:'/assets/projects/dashboardsomap.png', stack:['React.js','Node.js','MySQL'], desc:'Employee records and purchase-request management with dedicated administrator and responsible-user roles.' },
  { n:'04', category:'Web applications', title:'Internship Applications', tag:'Web application · Student', type:'nova', image:'/assets/projects/searchstage.png', stack:['React.js','Node.js','Oracle DB'], desc:'A platform connecting students and recruiters for internship applications, backed by Oracle DB on OCI.' },
  { n:'05', category:'Other', title:'ENSIAS Chatbot', tag:'Other · Information retrieval', type:'zackweb', image:'/assets/projects/chatbot_ensias.png', stack:['Python','Flask','NeuralIntents'], desc:'An information-retrieval chatbot for ENSIAS built with Python, Flask and NeuralIntents.' },
  { n:'06', category:'Extensions', title:'Form Saver Pro', tag:'Extension · Browser utility', type:'atlas', image:'/assets/projects/FormSaver%20Pro.png', stack:['JavaScript','Chrome Extension','Local Storage'], desc:'A Chrome extension that keeps form inputs available after a page reload.' },
  { n:'07', category:'Web applications', title:'Platform / Service Core', tag:'Web application · Backend', type:'atlas', image:'/assets/projects/plateform.png', stack:['Java','PostgreSQL','Docker'], desc:'A service foundation focused on dependable data, clear operations and scalable delivery.' },
  { n:'08', category:'Extensions', title:'UM5 Notes Calculator', tag:'Extension · Student utility', type:'nova', image:'/assets/projects/um5-notes-calculator.png', stack:['JavaScript','Chrome Extension','Algorithms'], desc:'A Chrome extension for Mohammed V University students that analyzes portal results, calculates semester and overall averages, detects validated modules and estimates the points needed to validate a module.' },
  { n:'09', category:'Web applications', title:'PipelineX', tag:'Web application · SecureDevOps', type:'atlas', image:'/assets/projects/PFA_3A.png', stack:['DevOps','Security','GitHub','Docker'], desc:'A SecureDevOps platform that automates DevOps workflows while integrating security from the earliest stages. Projects submitted through GitHub or ZIP are validated, queued and executed through isolated pipeline stages for testing and security analysis, producing centralized reports at the end of the workflow.' },
];

const FILTERS = ['All work', 'Web applications', 'Mobile applications', 'Extensions', 'Other'];

type ProjectsSectionProps = { shellRef: RefObject<HTMLDivElement | null>; trackRef: RefObject<HTMLDivElement | null>; offset: number; filter: string; setFilter: (filter: string) => void; setComplete: (complete: boolean) => void };

export default function ProjectsSection({ shellRef, trackRef, offset, filter, setFilter, setComplete }: ProjectsSectionProps) {
  const visibleProjects = PROJECTS.filter(project => filter === 'All work' || project.category === filter);
  return (
    <div className="projects-scroll-shell" id="projects" ref={shellRef}>
      <section className="section stack-section projects-section">
        <div className="sec-head projects-head reveal-on-scroll"><div><span className="sec-tag">/ Selected work · 2024—25</span><h2 className="sec-title">Built by <em>Zackweb</em></h2></div><p className="projects-intro">A selection of digital products, experiments and systems we shaped from first sketch to final release.</p></div>
        <div className="project-filters reveal-on-scroll" role="tablist" aria-label="Project filters">
          {FILTERS.map(current => {
            const count = current === 'All work' ? PROJECTS.length : PROJECTS.filter(project => project.category === current).length;
            return <button key={current} className={`filter-btn ${filter === current ? 'is-active' : ''}`} type="button" onClick={() => { setFilter(current); setComplete(false); }}>{current} <span>{String(count).padStart(2, '0')}</span></button>;
          })}
          <a href="#contact" className="all-work-link">Start a project <ArrowRight size={15} /></a>
        </div>
        <div className="proj-grid project-rail" ref={trackRef} style={{ transform: `translate3d(-${offset}px, 0, 0)` }}>
          {visibleProjects.map((project, index) => <ProjectCard key={project.n} project={project} index={index} />)}
          {visibleProjects.length === 0 && <div className="projects-empty"><span>00 / MOBILE</span><strong>Mobile work is<br /><em>coming next.</em></strong><p>No mobile applications in this collection yet.</p></div>}
        </div>
      </section>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className={`proj-card reveal-on-scroll delay-${index + 1}`}>
    <div className={`project-art art-${project.type}`} aria-hidden="true">{project.image && <img className="project-art-image" src={project.image} alt="" loading="lazy" />}<div className="art-browser"><i /><i /><i /><span>{project.title.split(' / ')[0].toLowerCase()}.studio</span></div><span className="art-index">{project.n} / {String(PROJECTS.length).padStart(2, '0')}</span></div>
    <div className="pc-body"><div className="pc-top"><span className="pc-num">{project.n}</span><span className="pc-tag">{project.tag}</span></div><h3 className="pc-title">{project.title}</h3><p className="pc-desc">{project.desc}</p><div className="pc-stack">{project.stack.map(tag => <span key={tag} className="pc-chip">{tag}</span>)}</div><button className="pc-btn" type="button">Explore case study <ArrowRight size={14} /></button></div>
  </article>;
}
