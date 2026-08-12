import type { CSSProperties } from 'react';

const SKILLS = [
  { name: 'React.js', img: '/assets/react-logo.png', pct: 88 },
  { name: 'Node.js', img: '/assets/node-logo.png', pct: 82 },
  { name: 'Spring Boot', img: '/assets/spring-logo.png', pct: 79 },
  { name: 'Java', img: '/assets/java-logo.png', pct: 84 },
  { name: 'PostgreSQL', img: '/assets/postgres-logo.png', pct: 76 },
  { name: 'JavaScript', img: '/assets/javascript-logo.png', pct: 90 },
];

type SkillsSectionProps = { projectComplete: boolean };

export default function SkillsSection({ projectComplete }: SkillsSectionProps) {
  return (
    <section className={`section stack-section skills-section ${projectComplete ? 'project-stage-done' : ''}`} id="skills">
      <div className="sec-head"><span className="sec-tag">/ Tech Stack</span><h2 className="sec-title">Tools I <em>Master</em></h2></div>
      <div className="skills-list">
        {SKILLS.map(({ name, img, pct }) => (
          <div key={name} className="skill-row">
            <div className="sk-icon"><img src={img} alt={name} className="sk-img" /></div>
            <div className="sk-info">
              <div className="sk-head"><span className="sk-name">{name}</span><span className="sk-pct">{pct}%</span></div>
              <div className="sk-track"><div className="sk-fill" style={{ '--w': `${pct}%` } as CSSProperties} /></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
