import { useEffect, useRef, type MouseEvent } from 'react';

const SECTIONS = [
  { id: 'home', label: 'ZACKWEB' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'education', label: 'EDUCATION' },
  { id: 'certifications', label: 'CERTIFICATIONS' },
  { id: 'contact', label: 'CONTACT' },
] as const;

const TICKS = Array.from({ length: 101 }, (_, index) => index);
const DIGITS = Array.from({ length: 10 }, (_, index) => index);

type WordMetrics = {
  centers: number[];
  width: number;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const ease = (value: number) => 1 - Math.pow(1 - clamp(value), 3);

function bezier(from: number, control: number, to: number, amount: number) {
  const inverse = 1 - amount;
  return inverse * inverse * from + 2 * inverse * amount * control + amount * amount * to;
}

export default function ScrollRail() {
  const characterRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hitboxRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const tickFieldRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let targetScroll = window.scrollY;
    let visualScroll = targetScroll;
    let scrollDirection: 1 | -1 = 1;
    let sectionOffsets: number[] = [];
    let metrics: WordMetrics[] = [];
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let scrollRange = 1;

    const measure = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      scrollRange = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      sectionOffsets = SECTIONS.map(({ id }) => {
        const element = document.getElementById(id);
        return element ? element.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
      });
      metrics = measureRefs.current.map((word, wordIndex) => {
        const children = word ? Array.from(word.children) as HTMLElement[] : [];
        const widths = children.map(child => child.getBoundingClientRect().width);
        const centers: number[] = [];
        let cursor = 0;
        widths.forEach(width => {
          centers.push(cursor + width / 2);
          cursor += width;
        });
        return { centers, width: cursor || SECTIONS[wordIndex].label.length * 22 };
      });
      if (tickFieldRef.current) tickFieldRef.current.style.height = `${scrollRange}px`;
      targetScroll = window.scrollY;
      visualScroll = targetScroll;
      render();
    };

    const setDigits = (percentage: number) => {
      const padded = String(Math.round(percentage)).padStart(3, '0').slice(-3);
      digitRefs.current.forEach((column, index) => {
        column?.style.setProperty('transform', `translate3d(0, -${Number(padded[index])}em, 0)`);
      });
    };

    const render = () => {
      if (!media.matches || metrics.length !== SECTIONS.length) return;

      const progress = clamp(visualScroll / scrollRange);
      const edge = 54;
      const needleY = edge + progress * Math.max(viewportHeight - edge * 2, 1);
      const headingRight = viewportWidth - 84;
      const queueBottom = viewportHeight - 54;
      const queueGap = 18;
      const compactScale = 0.44;
      const pastScale = compactScale;
      const pastTop = 30;
      const pastGap = queueGap;

      tickFieldRef.current?.style.setProperty(
        'transform',
        `translate3d(0, ${needleY - visualScroll}px, 0)`,
      );
      needleRef.current?.style.setProperty('transform', `translate3d(0, ${needleY}px, 0)`);
      setDigits(progress * 100);

      const bottomStart = viewportHeight - 72;
      const bottomEnd = viewportHeight - 218;
      const topStart = Math.min(250, viewportHeight * 0.32);
      const topEnd = 72;
      const verticalScale = 20 / 34;
      const heroProgress = clamp(visualScroll / 140);
      const stages = SECTIONS.map((_, index) => {
        const naturalScreenY = sectionOffsets[index] - visualScroll;
        // The final section cannot physically cross the top activation line once
        // the document reaches its scroll limit. Continue that last bit of travel
        // virtually so CONTACT receives the same complete transition as the rest.
        const screenY = index === SECTIONS.length - 1
          ? Math.min(naturalScreenY, topEnd + Math.max(scrollRange - visualScroll, 0))
          : naturalScreenY;
        if (index === 0) return { screenY, detach: 1, attach: heroProgress };
        return {
          screenY,
          detach: clamp((bottomStart - screenY) / Math.max(bottomStart - bottomEnd, 1)),
          attach: clamp((topStart - screenY) / Math.max(topStart - topEnd, 1)),
        };
      });

      let activeIndex = -1;
      stages.forEach((stage, index) => {
        if (index > 0 && stage.attach >= 0.62) activeIndex = index;
      });

      const incomingIndex = stages.findIndex((stage, index) => index > 0 && stage.detach > 0 && stage.attach < 1);
      const incomingAttach = incomingIndex >= 0 ? stages[incomingIndex].attach : 0;

      SECTIONS.forEach((_, sectionIndex) => {
        const word = metrics[sectionIndex];
        const chars = characterRefs.current[sectionIndex] ?? [];
        const stage = stages[sectionIndex];
        const queueY = queueBottom - (SECTIONS.length - 1 - sectionIndex) * queueGap;
        const queueRight = headingRight;
        const isHeroLabel = sectionIndex === 0;
        const isActive = sectionIndex === activeIndex;
        const isIncoming = sectionIndex === incomingIndex;
        const isOutgoing = incomingIndex > 0 && sectionIndex === incomingIndex - 1;
        const isPast = stage.attach >= 1 && sectionIndex < activeIndex;
        const headingY = Math.min(148, pastTop + sectionIndex * pastGap + 32);
        const pastY = pastTop + sectionIndex * pastGap;
        const verticalX = viewportWidth - 57;
        const verticalHalf = word.width * verticalScale * 0.5;
        const verticalCenterY = clamp(
          stage.screenY,
          topStart,
          Math.max(topStart, viewportHeight - 150),
        );

        chars.forEach((character, characterIndex) => {
          if (!character) return;
          const characterCount = Math.max(chars.length, 1);
          const reverseOrder = characterCount - 1 - characterIndex;
          const stagger = Math.min(0.055, 0.3 / characterCount);
          const center = word.centers[characterIndex] ?? characterIndex * 20;

          const queueX = queueRight - word.width * compactScale + center * compactScale;
          const headingX = headingRight - word.width + center;
          const pastX = headingRight - word.width * pastScale + center * pastScale;
          const verticalY = verticalCenterY + verticalHalf - center * verticalScale;
          let x = queueX;
          let y = queueY;
          let rotation = 0;
          let scale = compactScale;
          let opacity = 0.48;

          if (isHeroLabel) {
            const revealProgress = ease(clamp((heroProgress - reverseOrder * stagger * 0.5) / 0.72));
            x = pastX + (1 - revealProgress) * (18 + reverseOrder * 2);
            y = pastY - (1 - revealProgress) * 12;
            rotation = (1 - revealProgress) * -8;
            scale = pastScale;
            opacity = 0.48 * revealProgress;
          } else if (isOutgoing) {
            // Downward: the title folds into the passed stack from its last
            // character. Upward: use the opposite threshold order so the
            // time-reversed movement also unfolds from the last character.
            const stackOrder = scrollDirection < 0 ? characterIndex : reverseOrder;
            const stackProgress = ease(clamp((incomingAttach - stackOrder * stagger) * 1.45));
            x = bezier(headingX, viewportWidth - 48, pastX, stackProgress);
            y = bezier(headingY, lerp(headingY, pastY, 0.45), pastY, stackProgress);
            rotation = Math.sin(stackProgress * Math.PI) * -8;
            scale = lerp(1, pastScale, stackProgress);
            opacity = lerp(1, 0.48, stackProgress);
          } else if (isPast) {
            x = pastX;
            y = pastY;
            rotation = 0;
            scale = pastScale;
            opacity = 0.48;
          } else if (stage.attach > 0 && stage.attach < 1) {
            const attachProgress = ease(clamp(
              (stage.attach - reverseOrder * stagger) /
              Math.max(1 - (characterCount - 1) * stagger, 0.45),
            ));
            x = bezier(verticalX, viewportWidth - 48, headingX, attachProgress);
            y = bezier(verticalY, lerp(verticalY, headingY, 0.5), headingY, attachProgress);
            rotation = lerp(-90, 0, attachProgress);
            scale = lerp(verticalScale, 1, attachProgress);
            opacity = lerp(0.48, 1, attachProgress);
          } else if (isActive) {
            x = headingX;
            y = headingY;
            rotation = 0;
            scale = 1;
            opacity = 1;
          } else if (stage.attach >= 1) {
            opacity = 0;
          } else if (stage.detach > 0) {
            const detachProgress = ease(clamp(
              (stage.detach - reverseOrder * stagger) /
              Math.max(1 - (characterCount - 1) * stagger, 0.45),
            ));
            x = bezier(queueX, viewportWidth - 48, verticalX, detachProgress);
            y = bezier(queueY, queueY - 34, verticalY, detachProgress);
            rotation = lerp(0, -90, detachProgress);
            scale = lerp(compactScale, verticalScale, detachProgress);
          }

          if (isIncoming) opacity = Math.max(opacity, 0.62);
          if (isActive && !isOutgoing) opacity = 1;
          character.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`;
          character.style.opacity = String(clamp(opacity));
        });

        const hitbox = hitboxRefs.current[sectionIndex];
        if (hitbox) {
          if (isHeroLabel) {
            const heroIsVisible = heroProgress >= 0.98;
            hitbox.style.pointerEvents = heroIsVisible ? 'auto' : 'none';
            hitbox.style.width = `${word.width * pastScale}px`;
            hitbox.style.height = '17px';
            hitbox.style.transform = `translate3d(${headingRight - word.width * pastScale}px, ${pastY - 8.5}px, 0)`;
            hitbox.setAttribute('aria-current', 'false');
            return;
          }
          const settledInQueue = stage.detach === 0;
          const settledOnRail = stage.detach >= 1 && stage.attach === 0;
          const settledAsHeading = isActive && stage.attach >= 1;
          const settledAsPast = isPast && !isOutgoing;
          const isCompact = settledInQueue || settledAsPast;
          const hitboxY = settledInQueue ? queueY : settledAsPast ? pastY : headingY;
          const hitboxScale = isCompact ? (settledAsPast ? pastScale : compactScale) : 1;
          hitbox.style.pointerEvents = settledInQueue || settledOnRail || settledAsHeading || settledAsPast ? 'auto' : 'none';
          hitbox.style.width = `${settledOnRail ? 28 : word.width * hitboxScale}px`;
          hitbox.style.height = `${settledOnRail ? word.width * verticalScale : isCompact ? 17 : 42}px`;
          hitbox.style.transform = settledOnRail
            ? `translate3d(${verticalX - 14}px, ${verticalCenterY - verticalHalf}px, 0)`
            : `translate3d(${headingRight - word.width * hitboxScale}px, ${hitboxY - (isCompact ? 8.5 : 21)}px, 0)`;
          hitbox.setAttribute('aria-current', settledAsHeading ? 'location' : 'false');
        }
      });
    };

    const animate = () => {
      const difference = targetScroll - visualScroll;
      visualScroll = reducedMotion.matches || Math.abs(difference) < 0.08
        ? targetScroll
        : visualScroll + difference * 0.115;
      render();
      if (visualScroll !== targetScroll) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    };

    const schedule = () => {
      const nextScroll = window.scrollY;
      if (nextScroll > targetScroll + 0.5) scrollDirection = 1;
      if (nextScroll < targetScroll - 0.5) scrollDirection = -1;
      targetScroll = nextScroll;
      if (!frame) frame = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    media.addEventListener('change', measure);
    reducedMotion.addEventListener('change', measure);
    document.fonts?.ready.then(measure);
    requestAnimationFrame(measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      media.removeEventListener('change', measure);
      reducedMotion.removeEventListener('change', measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const navigateToSection = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <aside className="scroll-instrument" aria-label="Portfolio section navigation">
      <div className="instrument-ruler" aria-hidden="true">
        <div className="instrument-tick-field" ref={tickFieldRef}>
          {TICKS.map(tick => (
            <i
              className={tick % 10 === 0 ? 'is-major' : tick % 5 === 0 ? 'is-mid' : ''}
              style={{ top: `${tick}%` }}
              key={tick}
            >
              {tick % 5 === 0 && <span>{String(tick).padStart(2, '0')}</span>}
            </i>
          ))}
        </div>
        <div className="instrument-needle" ref={needleRef}>
          <span className="instrument-digit-window">
            {[0, 1, 2].map(column => (
              <b className="instrument-digit-column" key={column}>
                <span ref={node => { digitRefs.current[column] = node; }}>
                  {DIGITS.map(digit => <em key={digit}>{digit}</em>)}
                </span>
              </b>
            ))}
            <b className="instrument-percent">%</b>
          </span>
        </div>
      </div>

      <nav className="instrument-characters" aria-label="Page sections">
        {SECTIONS.map((section, sectionIndex) => (
          <div className="instrument-word" key={section.id}>
            {Array.from(section.label).map((character, characterIndex) => (
              <span
                aria-hidden="true"
                className="instrument-character"
                key={`${section.id}-${characterIndex}`}
                ref={node => {
                  if (!characterRefs.current[sectionIndex]) characterRefs.current[sectionIndex] = [];
                  characterRefs.current[sectionIndex][characterIndex] = node;
                }}
              >
                {character}
              </span>
            ))}
            <a
              className="instrument-hitbox"
              href={`#${section.id}`}
              aria-label={`Go to ${section.label.toLowerCase()}`}
              onClick={navigateToSection(section.id)}
              ref={node => { hitboxRefs.current[sectionIndex] = node; }}
            />
          </div>
        ))}
      </nav>

      <div className="instrument-measure" aria-hidden="true">
        {SECTIONS.map((section, sectionIndex) => (
          <div
            className="instrument-measure-word"
            key={section.id}
            ref={node => { measureRefs.current[sectionIndex] = node; }}
          >
            {Array.from(section.label).map((character, characterIndex) => (
              <span key={`${section.id}-measure-${characterIndex}`}>{character}</span>
            ))}
          </div>
        ))}
      </div>

      <nav className="instrument-static-nav" aria-label="Page sections">
        {SECTIONS.map(section => (
          <a href={`#${section.id}`} key={section.id} onClick={navigateToSection(section.id)}>
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
