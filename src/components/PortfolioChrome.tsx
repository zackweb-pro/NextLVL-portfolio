import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Moon, Sun } from 'lucide-react';
import { FaGithub, FaInstagram, FaXTwitter } from 'react-icons/fa6';

const COMMANDS: Record<string, () => string[]> = {
  help: () => ['  Available commands:', '  about     — who is Zakaria', '  skills    — tech stack', '  projects  — shipped work', '  contact   — get in touch', '  clear     — clear terminal', '  ls        — list files'],
  about: () => ['  Name    : Zakaria Oumghar', '  Role    : Software Engineering Student', '  Based   : Marrakesh, Morocco', '  Status  : Open to internships 2025'],
  skills: () => ['  Frontend : React.js · JavaScript · CSS', '  Backend  : Node.js · Spring Boot · Java', '  Database : PostgreSQL', '  Tools    : Git · REST APIs · Docker'],
  projects: () => ['  [1] OurBusWay → Spring · React · PostgreSQL', '  [2] ENSIAS Management → Spring · React · Docker', '  [3] Form Saver Pro → JavaScript · Chrome'],
  contact: () => ['  Email    : zakaria@example.com', '  GitHub   : github.com/zakaria-oumghar', '  LinkedIn : linkedin.com/in/zakaria-oumghar'],
  ls: () => ['  total 48', '  drwxr-xr-x  5 zakaria dev  4096 Apr 03  about/', '  -rw-r--r--  1 zakaria dev   512 Apr 03  projects.json'],
};

export function Terminal() {
  const [history, setHistory] = useState([{ type: 'meta', text: 'Last login: Fri April 01 12:15:40AM at berrechid' }, { type: 'hint', text: 'Type "help" to see available commands.' }]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { bodyRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }); }, [history]);
  const run = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (command === 'clear') { setHistory([]); setInput(''); return; }
    const output = COMMANDS[command]?.() ?? [`  command not found: ${command}. Try "help".`];
    setHistory(previous => [...previous, { type: 'input', text: command }, ...output.map(text => ({ type: 'output', text }))]);
    setInput('');
  };
  return <div className="terminal" onClick={() => inputRef.current?.focus()}><div className="term-bar"><span className="tdot red" /><span className="tdot yellow" /><span className="tdot green" /><span className="term-title">macmini — ~zackweb-sh — 120×30</span></div><div className="term-body" ref={bodyRef}>{history.map((line, index) => <div key={index} className={`tline tline-${line.type}`}><span className="ttext">{line.text}</span></div>)}<div className="tline tline-active"><span className="tprompt">zackweb:~$ </span><input ref={inputRef} className="term-input" value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') run(input); }} aria-label="terminal input" /></div></div></div>;
}

export function HamburgerMenu({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [{ label: 'Home', href: '#home' }, { label: 'Projects', href: '#projects' }, { label: 'Skills', href: '#skills' }, { label: 'Contact', href: '#contact' }];
  return <><button className={`ham-btn ${open ? 'ham-open' : ''}`} onClick={() => setOpen(value => !value)} aria-label="Toggle menu"><span className="ham-line" /><span className="ham-line" /><span className="ham-line" /></button>{open && <div className="menu-backdrop" onClick={() => setOpen(false)} />}<nav className={`glass-menu ${open ? 'glass-open' : ''}`}><div className="glass-logo">Z·O</div><ul className="glass-links">{links.map(link => <li key={link.label}><a href={link.href} className="glass-link" onClick={() => setOpen(false)}><ChevronRight size={14} className="gl-arrow" />{link.label}</a></li>)}</ul><div className="glass-divider" /><button className="glass-theme" onClick={toggleTheme}>{theme === 'light' ? <><Moon size={15} /> Dark mode</> : <><Sun size={15} /> Light mode</>}</button><div className="glass-socials"><a href="#" aria-label="GitHub"><FaGithub size={18} /></a><a href="#" aria-label="Instagram"><FaInstagram size={18} /></a><a href="#" aria-label="X"><FaXTwitter size={18} /></a></div></nav></>;
}
