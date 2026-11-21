import { useEffect, useId, useRef, useState, type PointerEvent, type CSSProperties } from 'react';
import { Cloud, Database, Grip, Layers3, Maximize2, Minimize2, Minus, Monitor, Plus, Server } from 'lucide-react';
import type { ArchitectureEdge, ArchitectureNode, Project } from '../data/projectCaseStudies';

const MAP_WIDTH = 1300;
const MAP_HEIGHT = 560;
const NODE_WIDTH = 268;
const NODE_HEIGHT = 122;
const point = (node: ArchitectureNode) => ({ x: 32 + node.column * 322, y: 90 + node.row * 150 });
const icons = { client: Monitor, service: Server, data: Database, external: Cloud };
const kinds = { client: 'Interface', service: 'Application', data: 'Persistence', external: 'Integration' };

function connectionPath(from: ArchitectureNode, to: ArchitectureNode) {
  const a = point(from);
  const b = point(to);
  if (from.column === to.column) {
    const down = to.row > from.row;
    const start = a.y + (down ? NODE_HEIGHT : 0);
    const end = b.y + (down ? 0 : NODE_HEIGHT);
    return `M ${a.x + NODE_WIDTH / 2} ${start} L ${b.x + NODE_WIDTH / 2} ${end}`;
  }
  if (to.column < from.column) {
    const startX = a.x + NODE_WIDTH / 2;
    const endX = b.x + NODE_WIDTH / 2;
    return `M ${startX} ${a.y + NODE_HEIGHT} C ${startX} 550, ${endX} 550, ${endX} ${b.y + NODE_HEIGHT}`;
  }
  const startX = a.x + NODE_WIDTH;
  const endX = b.x;
  const startY = a.y + NODE_HEIGHT / 2;
  const endY = b.y + NODE_HEIGHT / 2;
  const curve = (endX - startX) / 2;
  return `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;
}

export default function ProjectArchitecture({ project }: { project: Project }) {
  const { architecture } = project;
  const [selectedId, setSelectedId] = useState(architecture.nodes[0].id);
  const [zoom, setZoom] = useState(1);
  const [fitted, setFitted] = useState<boolean | 'auto'>('auto');
  const [expanded, setExpanded] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(MAP_WIDTH);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useState<'map' | 'list'>('map');
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, x: 0, y: 0, left: 0, top: 0 });
  const markerId = useId().replace(/:/g, '');
  const inspectorId = useId();
  const selected = architecture.nodes.find(node => node.id === selectedId) ?? architecture.nodes[0];
  const connected = architecture.edges.filter(edge => edge.from === selected.id || edge.to === selected.id);
  const lookup = new Map(architecture.nodes.map(node => [node.id, node]));
  const related = new Set(connected.flatMap(edge => [edge.from, edge.to]));
  const scale = fitted === true || (fitted === 'auto' && canvasWidth >= 820) ? Math.min(canvasWidth / MAP_WIDTH, 1.15) : zoom;
  const mapWidth = MAP_WIDTH * scale;
  const hasOverflow = mapWidth > canvasWidth + 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(entries => setCanvasWidth(entries[0].contentRect.width));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [view]);

  const changeZoom = (increment: number) => {
    setZoom(Math.min(1.75, Math.max(0.4, Math.round((scale + increment) * 100) / 100)));
    setFitted(false);
  };

  const startPan = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || (event.target as Element).closest('[role="button"]')) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY, left: canvas.scrollLeft, top: canvas.scrollTop };
    canvas.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const movePan = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !canvasRef.current) return;
    canvasRef.current.scrollLeft = dragRef.current.left - (event.clientX - dragRef.current.x);
    canvasRef.current.scrollTop = dragRef.current.top - (event.clientY - dragRef.current.y);
  };

  const stopPan = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    if (canvasRef.current?.hasPointerCapture(event.pointerId)) canvasRef.current.releasePointerCapture(event.pointerId);
    setDragging(false);
  };

  function edgeTitle(edge: ArchitectureEdge) {
    return `${lookup.get(edge.from)?.label} → ${lookup.get(edge.to)?.label}: ${edge.label}`;
  }

  return (
    <div className={`case-architecture ${expanded ? 'is-expanded' : ''}`} onKeyDown={event => { if (expanded && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setExpanded(false); } }}>
      <div className="architecture-toolbar">
        <div className="architecture-identity"><Layers3 size={22} strokeWidth={1.3} /><div><span>Under the surface</span><strong>{project.title.split(' / ')[0]}</strong></div></div>
        <div className="architecture-controls">
        <div className="architecture-mode" aria-label="Architecture view">
          <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>Map</button>
          <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>Components</button>
        </div>
        {view === 'map' && <div className="architecture-zoom">
          <button type="button" aria-label="Zoom out" disabled={scale <= 0.4} onClick={() => changeZoom(-0.15)}><Minus size={16} /></button>
          <span>{Math.round(scale * 100)}%</span>
          <button type="button" aria-label="Zoom in" disabled={scale >= 1.75} onClick={() => changeZoom(0.15)}><Plus size={16} /></button>
          <button className="architecture-fit" type="button" aria-label="Fit diagram to view" onClick={() => { setFitted(true); canvasRef.current?.scrollTo({ left: 0, top: 0 }); }}>Fit</button>
        </div>}
        <button className="architecture-expand" type="button" aria-label={expanded ? 'Collapse architecture' : 'Expand architecture'} aria-pressed={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        </div>
      </div>

      {view === 'map' ? <div className={`architecture-canvas ${dragging ? 'is-panning' : ''}`} ref={canvasRef} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={stopPan} onPointerCancel={stopPan} onScroll={() => { const canvas = canvasRef.current; if (canvas) setScrollProgress(canvas.scrollLeft / Math.max(1, canvas.scrollWidth - canvas.clientWidth) * 100); }} tabIndex={0} role="region" aria-label="Interactive architecture map. Drag to pan, or select a component to explore its connections.">
        <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} style={{ width: `${mapWidth}px` }} role="group" aria-label={`${project.title} architecture`}>
          <defs>
            <marker id={markerId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 L7 4 L1 7" fill="none" stroke="currentColor" strokeWidth="1.2" /></marker>
            <filter id={`${markerId}-shadow`} x="-15%" y="-20%" width="130%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#4e3920" floodOpacity="0.065" /></filter>
          </defs>
          {architecture.lanes.map((lane, index) => <g key={lane} className="architecture-lane">
            <text x={32 + index * 322} y="38">{lane}</text>
            <line x1={32 + index * 322} y1="55" x2={300 + index * 322} y2="55" />
          </g>)}
          {architecture.edges.map((edge, index) => {
            const from = lookup.get(edge.from);
            const to = lookup.get(edge.to);
            if (!from || !to) return null;
            const active = edge.from === selectedId || edge.to === selectedId;
            return <path key={`${edge.from}-${edge.to}-${index}`} className={`architecture-edge ${active ? 'is-connected' : ''} ${edge.kind ? `is-${edge.kind}` : ''}`} d={connectionPath(from, to)} markerEnd={`url(#${markerId})`}><title>{edgeTitle(edge)}</title></path>;
          })}
          {architecture.nodes.map(node => {
            const { x, y } = point(node);
            const Icon = icons[node.kind];
            return <g key={node.id} transform={`translate(${x},${y})`} className={`architecture-node ${node.id === selectedId ? 'is-selected' : ''} ${related.has(node.id) ? 'is-related' : ''} ${node.kind === 'external' ? 'is-external' : ''}`} role="button" tabIndex={0} aria-label={`${node.label}. ${node.technology}`} aria-pressed={node.id === selectedId} aria-controls={inspectorId} onClick={() => setSelectedId(node.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedId(node.id); } }}>
              <rect width={NODE_WIDTH} height={NODE_HEIGHT} rx="14" filter={`url(#${markerId}-shadow)`} />
              <rect className="architecture-icon-bg" x="18" y="16" width="34" height="34" rx="10" />
              <Icon x={26} y={24} width={18} height={18} strokeWidth={1.4} />
              <text className="architecture-node-kind" x="250" y="36" textAnchor="end">{kinds[node.kind]}</text>
              <text className="architecture-node-title" x="18" y="76">{node.label}</text>
              <text className="architecture-node-tech" x="18" y="102">{node.technology}</text>
            </g>;
          })}
        </svg>
      </div> : <div className="architecture-component-list">
        {architecture.nodes.map(node => {
          const Icon = icons[node.kind];
          return <button type="button" key={node.id} className={node.id === selectedId ? 'is-selected' : ''} onClick={() => setSelectedId(node.id)} aria-pressed={node.id === selectedId}><Icon size={19} /><span><strong>{node.label}</strong><small>{node.technology}</small></span></button>;
        })}
      </div>}

      {view === 'map' && <div className={`architecture-panbar ${hasOverflow ? '' : 'is-fitted'}`}><span><Grip size={15} /> {hasOverflow ? 'Drag to explore' : 'The complete system'}</span><input type="range" min="0" max="100" step="0.1" value={hasOverflow ? scrollProgress : 0} disabled={!hasOverflow} aria-label="Horizontal diagram position" style={{ '--pan-thumb': `${Math.max(12, Math.min(100, canvasWidth / mapWidth * 100))}%` } as CSSProperties} onChange={event => { const canvas = canvasRef.current; if (canvas) canvas.scrollLeft = Number(event.target.value) / 100 * (canvas.scrollWidth - canvas.clientWidth); }} /><span className="architecture-legend"><i /> Request / data <i className="is-dashed" /> Async / external</span></div>}
      <div className="architecture-inspector" id={inspectorId} aria-live="polite" aria-atomic="true">
        <div><span className="architecture-inspector-label">Explore the component</span><h4>{selected.label}</h4><span className="architecture-inspector-tech">{selected.technology}</span></div>
        <div><p>{selected.detail}</p>{connected.length > 0 && <ul>{connected.map((edge, index) => { const other = lookup.get(edge.from === selected.id ? edge.to : edge.from); return <li key={index}><button type="button" onClick={() => other && setSelectedId(other.id)}><span>{edge.label}</span>{other?.label}</button></li>; })}</ul>}</div>
      </div>
    </div>
  );
}
