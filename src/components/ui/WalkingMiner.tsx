'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const NUM_FRAMES = 18; // Number of images

export default function WalkingCharacter() {
  const [frame, setFrame] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      // Calculate frame index based on scroll position
      const scrollPercent = Math.min(scrollY / maxScroll, 1);
      const scrollX = Math.floor(scrollPercent * 420);
      setScrollX(
        scrollX + 150 > window.innerWidth ? window.innerWidth - 200 : scrollX,
      );

      const frameIndex = Math.floor((window.scrollY / 20) % NUM_FRAMES);

      setFrame(frameIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="relative bottom-[-24px] z-5 w-fit"
      style={{ transform: `translateX(${scrollX}px)` }}
    >
      <Image
        src={`/assets/walking-miner/Walking_${frame}.png`}
        alt={`Character walking frame ${frame + 1}`}
        width={150}
        height={150}
        className="pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );
}
