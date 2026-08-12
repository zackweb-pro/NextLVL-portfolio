const SKILLS = [
  { name: 'Java', img: '/assets/java-logo.png', note: 'Backend foundation' },
  { name: 'Spring Boot', img: '/assets/spring-logo.png', note: 'APIs & services' },
  { name: 'React.js', img: '/assets/react-logo.png', note: 'Web interfaces' },
  { name: 'Node.js', img: '/assets/node-logo.png', note: 'Full-stack tooling' },
  { name: 'PostgreSQL', img: '/assets/postgres-logo.png', note: 'Data & persistence' },
  { name: 'Docker', img: '', note: 'Deployment' },
  { name: 'JavaScript', img: '/assets/javascript-logo.png', note: 'Extensions & web' },
  { name: 'Flutter', img: '', note: 'Mobile applications' },
];

type SkillsSectionProps = { projectComplete: boolean };

export default function SkillsSection({ projectComplete }: SkillsSectionProps) {
  return (
    <section className={`section stack-section skills-section ${projectComplete ? 'project-stage-done' : ''}`} id="skills">
      <div className="sec-head"><span className="sec-tag">/ Tech Stack</span><h2 className="sec-title">Tools I <em>Master</em></h2></div>
      <div className="skills-grid">
        {SKILLS.map(({ name, img, note }) => (
          <div key={name} className="skill-tile">
            <div className="sk-icon">{img ? <img src={img} alt={name} className="sk-img" /> : <span className="sk-lettermark">{name[0]}</span>}</div>
            <div className="skill-tile-copy"><strong>{name}</strong><span>{note}</span></div>
            <span className="skill-arrow">↗</span>
          </div>
        ))}
      </div>
    </section>
  );
}
