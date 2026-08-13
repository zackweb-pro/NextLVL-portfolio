import type { ReactNode } from 'react';

type StickySectionProps = { id: string; className: string; children: ReactNode };

export default function StickySection({ id, className, children }: StickySectionProps) {
  return <div className="section-shell" id={id}><section className={className}>{children}</section></div>;
}
