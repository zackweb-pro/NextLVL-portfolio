import StickySection from './StickySection';

const EDUCATION = [
  {
    period: '2023 — 2026',
    school: 'National School of Computer Science and Systems Analysis (ENSIAS)',
    location: 'Rabat, Morocco',
    degree: 'Engineering Degree in Software Engineering',
  },
  {
    period: '2021 — 2023',
    school: 'Preparatory Classes for Grandes Écoles (CPGE)',
    location: 'Settat, Morocco',
    degree: 'Scientific Preparatory Classes',
    distinction: 'Top 20%',
  },
  {
    period: '2018 — 2021',
    school: 'Imam Malik Technical High School',
    location: 'Berrechid, Morocco',
    degree: 'Baccalaureate in Technical Sciences · Electrical Engineering',
    distinction: '2nd in the province overall · 1st in Casablanca-Settat in Science de l’Ingénieur',
  },
];

export default function EducationSection() {
  return <StickySection id="education" className="section stack-section education-section">
    <div className="education-heading">
      <div><span className="sec-tag">/ Education</span><h2 className="sec-title">Academic <em>path</em></h2></div>
      <p className="projects-intro">The foundations behind my engineering practice and continued growth.</p>
    </div>
    <div className="education-list">
      {EDUCATION.map((item, index) => <article className="education-item" key={item.school}>
        <span className="education-index">0{index + 1}</span>
        <div className="education-main"><h3>{item.school}</h3><p>{item.degree}</p><span>{item.location}</span>{item.distinction && <small>{item.distinction}</small>}</div>
        <span className="education-period">{item.period}</span>
      </article>)}
    </div>
  </StickySection>;
}
