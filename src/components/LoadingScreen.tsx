import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LottieLight } from 'lottie-react';
import '../styles/LoadingScreen.css';

type LoadingScreenProps = { onComplete: () => void };

const ANIMATION_PATH = '/assets/logo-animation/zackweb-animation.json';

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const hasCompleted = useRef(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finishLoading = useCallback(() => {
    if (hasCompleted.current) return;

    hasCompleted.current = true;
    setIsExiting(true);
    exitTimer.current = setTimeout(onComplete, 650);
  }, [onComplete]);

  const subscriptions = useMemo(
    () => ({
      complete: finishLoading,
      error: finishLoading,
    }),
    [finishLoading],
  );

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    [],
  );

  return (
    <div
      className={`loader-container ${isExiting ? 'exit-active' : ''}`}
      role="status"
      aria-label="Loading Zackweb portfolio"
    >
      <div className="logo-animation-frame">
        <LottieLight
          src={ANIMATION_PATH}
          autoplay
          loop={false}
          subscriptions={subscriptions}
          className="logo-lottie"
        />
        <div className="watermark-cover" aria-hidden="true" />
      </div>
      <span className="loader-label">Loading portfolio</span>
    </div>
  );
};

export default LoadingScreen;
