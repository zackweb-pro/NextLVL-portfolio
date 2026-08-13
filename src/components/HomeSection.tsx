import type { MouseEvent, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import zackwebLog from '../assets/zackweb-logo.png';
import '../styles/HeroSection.css';

type HomeSectionProps = { heroRef: RefObject<HTMLElement | null> };

export default function HomeSection({ heroRef }: HomeSectionProps) {
  const photoRef = useRef<HTMLDivElement | null>(null);
  const hitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const epicImageRef = useRef<HTMLImageElement | null>(null);
  const [isPersonHovered, setIsPersonHovered] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  useEffect(() => {
    const photo = photoRef.current;
    const image = epicImageRef.current;
    const canvas = hitCanvasRef.current;
    if (!photo || !image || !canvas) return;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;

    const prepareHitMap = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
    };
    if (image.complete) prepareHitMap();
    image.addEventListener('load', prepareHitMap);
    return () => image.removeEventListener('load', prepareHitMap);
  }, []);

  const moveOverPhoto = (event: MouseEvent<HTMLDivElement>) => {
    const photo = photoRef.current;
    const image = epicImageRef.current;
    const canvas = hitCanvasRef.current;
    if (!photo || !image || !canvas || !image.naturalWidth) return;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    const bounds = photo.getBoundingClientRect();
    const scale = Math.max(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;
    const imageX = (bounds.width - renderedWidth) / 2;
    const imageY = (bounds.height - renderedHeight) / 2;
    const sourceX = (event.clientX - bounds.left - imageX) / scale;
    const sourceY = (event.clientY - bounds.top - imageY) / scale;
    const x = Math.floor(sourceX);
    const y = Math.floor(sourceY);
    const alpha = x >= 0 && y >= 0 && x < canvas.width && y < canvas.height
      ? context.getImageData(x, y, 1, 1).data[3]
      : 0;
    setIsPersonHovered(alpha > 28);
  };

  return <section className="hero stack-hero clean-hero" id="home" ref={heroRef}>
    <div className={`hero-photo-bg ${isPersonHovered ? 'is-person-hovered' : ''}`} ref={photoRef} onMouseMove={moveOverPhoto} onMouseLeave={() => setIsPersonHovered(false)}>
      <div
        className={`clean-hero-title ${isTitleHovered ? 'is-title-hovered' : ''}`}
        onMouseEnter={() => setIsTitleHovered(true)}
        onMouseLeave={() => setIsTitleHovered(false)}
      >
        ZAKARIA <span>OUMGHAR</span>
      </div>
      <img ref={epicImageRef} src="/assets/Hero_pic_epic.png" alt="Zakaria Oumghar" className="hero-bg-img hero-bg-img-epic" />
      <canvas ref={hitCanvasRef} className="hero-hit-map" aria-hidden="true" />
      <div className="photo-fade-left" /><div className="photo-fade-right" /><div className="photo-fade-bottom" />
    </div>
    <header className="nav clean-hero-nav">
      <span className="nav-logo"><img src={zackwebLog} alt="ZACKWEB" /></span>
    </header>
    <div className="text-block clean-hero-copy">
      <div className="tb-badge">DELIVERY SOFTWARE ENGINEER</div>
      <h1 className="tb-title">Building <span className="tb-highlight">Digital Experiences</span><br />that make you go WOOOOW!</h1>
      <p className="tb-desc">Delivery software engineer crafting elegant, reliable solutions for the web and beyond.</p>
      <div className="tb-ctas"><a href="#projects" className="tb-btn tb-primary">View My Work <ArrowRight size={16} /></a><a href="#contact" className="tb-btn tb-secondary">Let’s collaborate <ArrowRight size={15} /></a></div>
    </div>
    <div className="clean-hero-role">DELIVERY SOFTWARE ENGINEER <span>·</span> ENSIAS</div>
  </section>;
}
