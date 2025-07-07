'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const NUM_FRAMES = 18; // Number of images
const ANIMATION_SPEED = 70; // Frame animation speed in ms
const MOVEMENT_SPEED = 3; // Pixels per frame for movement
const CHARACTER_WIDTH = 150; // Character width for boundary calculation

export default function WalkingCharacter() {
  const [frame, setFrame] = useState(0);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    // Set initial screen width
    setScreenWidth(window.innerWidth);

    // Handle window resize
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      // Update frame for walking animation
      setFrame((prevFrame) => (prevFrame + 1) % NUM_FRAMES);

      // Update position
      setPosition((prevPosition) => {
        const newPosition = prevPosition + MOVEMENT_SPEED * direction;

        // Check boundaries and reverse direction if needed
        if (newPosition <= 0) {
          setDirection(1); // Start moving right
          return 0;
        }

        if (newPosition >= screenWidth - CHARACTER_WIDTH) {
          setDirection(-1); // Start moving left
          return screenWidth - CHARACTER_WIDTH;
        }

        return newPosition;
      });
    }, ANIMATION_SPEED);

    return () => clearInterval(animationInterval);
  }, [direction, screenWidth]);

  return (
    <div
      className="relative bottom-[-24px] z-10 w-fit transition-transform duration-75"
      style={{
        transform: `translateX(${position}px) scaleX(${direction})`,
        left: 0,
      }}
    >
      <Image
        src={`/assets/walking-miner/Walking_${frame}.png`}
        alt={`Character walking frame ${frame + 1}`}
        width={CHARACTER_WIDTH}
        height={150}
        className="pointer-events-none select-none"
        draggable={false}
        priority
      />
    </div>
  );
}
