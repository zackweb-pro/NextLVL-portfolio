import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

type Experience = {
  period: string;
  company: string;
  role: string;
  location: string;
  summary: string;
  details: string[];
  skills: string[];
  image?: string;
};

const EXPERIENCES: Experience[] = [
  {
    period: 'Feb 2026 — Aug 2026', company: 'INFORISK', role: 'Full-Stack Software Engineering Intern · Hybrid', location: 'Morocco',
    summary: 'Designed and developed a web-based financial information services platform for individuals and businesses, covering accounts, subscriptions and credit reports.',
    details: ['Developed the Spring Boot backend and REST APIs alongside a responsive web interface and a Flutter mobile app, including dashboards, detailed PP/PM report views and payment flows.', 'Implemented report sharing and access control, request management, notifications, alerts, disputes and document downloads.', 'Containerized and deployed the frontend with Docker and Nginx, integrating PostgreSQL and Inforisk external services.'],
    skills: ['Java', 'Spring Boot', 'Flutter', 'Dart', 'PostgreSQL', 'REST API', 'Docker', 'Nginx'],
  },
  {
    period: 'Jun 2025 — Aug 2025', company: 'Univers Gharb de la Prestation (UGP)', role: 'Software Engineer Intern', location: 'Rabat, Morocco',
    summary: 'Designed and developed a multi-role web platform for industrial surface treatment services management and real-time order tracking.',
    details: ['Developed a Spring Boot microservices backend and a React + TypeScript frontend with analytical dashboards, notifications and a modern glassmorphism interface.', 'Containerized and deployed the platform to Oracle Cloud with Docker and automated CI/CD workflows.'],
    skills: ['Java', 'Spring Boot', 'React', 'TypeScript', 'Docker', 'Oracle Cloud'],
  },
  {
    period: 'Jul 2024 — Aug 2024', company: 'Somap & Service', role: 'Web Development Intern', location: 'Kénitra, Morocco',
    summary: 'Developed a full-stack application to streamline employee management and purchase-request workflows.',
    details: ['Introduced role-based access for Admin and Responsable profiles with secure login and confirmation workflows.', 'Built employee records, purchase approvals and an administrative dashboard with a clean responsive interface.'],
    skills: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'Tailwind CSS'],
    image: '/assets/projects/dashboardsomap.png',
  },
];

export default function ExperienceSection() {
  const [openIndex, setOpenIndex] = useState(1);
  return (
    <section className="section stack-section experience-section" id="experience">
      <div className="experience-heading">
        <div><span className="sec-tag">/ Experience · 2024—now</span><h2 className="sec-title">Where I <em>worked</em></h2></div>
        <p className="projects-intro">A record of the teams, products and systems I’ve helped move forward.</p>
      </div>
      <div className="experience-list">
        {EXPERIENCES.map((experience, index) => {
          const isOpen = openIndex === index;
          return <article key={experience.company} className={`experience-item ${isOpen ? 'is-open' : ''}`}>
            <button className="experience-summary" type="button" onClick={() => setOpenIndex(isOpen ? -1 : index)} aria-expanded={isOpen}>
              <span className="experience-index">0{index + 1}</span>
              <span className="experience-main"><strong>{experience.company}</strong><span>{experience.role}</span></span>
              <span className="experience-period">{experience.period}</span>
              <ChevronDown size={17} className="experience-chevron" />
            </button>
            <div className="experience-details">
              <div className="experience-detail-copy"><span className="experience-location">{experience.location}</span><p>{experience.summary}</p><ul>{experience.details.map(detail => <li key={detail}>{detail}</li>)}</ul><div className="experience-skills">{experience.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div>
              {experience.image && <img src={experience.image} alt="Somap project interface" loading="lazy" />}
            </div>
          </article>;
        })}
      </div>
      <a className="experience-link" href="https://www.linkedin.com/in/zakaria-oumghar-gl" target="_blank" rel="noreferrer">View full experience on LinkedIn <ArrowUpRight size={15} /></a>
    </section>
  );
}
