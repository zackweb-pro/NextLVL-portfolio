import { FileText, Mail } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="section stack-section contact-sec" id="contact">
      <div className="sec-head" style={{ textAlign: 'center' }}>
        <span className="sec-tag" style={{ justifyContent: 'center' }}>/ Contact</span>
        <h2 className="sec-title">Let's build something<br /><em>remarkable</em> together.</h2>
        <p className="contact-sub">Actively looking for internships and collaborations.<br />I reply within 24 hours.</p>
      </div>
      <div className="contact-ctas">
        <a href="mailto:zakaria@example.com" className="cc-primary"><Mail size={18} /> zakaria@example.com</a>
        <a href="#" className="cc-secondary"><FileText size={16} /> Download CV</a>
      </div>
      <div className="contact-links">{['GitHub ↗', 'LinkedIn ↗', 'X (Twitter) ↗'].map(label => <a key={label} href="#" className="cl-link">{label}</a>)}</div>
    </section>
  );
}
