import heroOne from 'assets/images/landing/kitchen-remodel-8.jpg';
import heroTwo from 'assets/images/landing/kitchen-remodel-3.jpg';
import heroThree from 'assets/images/landing/kitchen-remodel-10.jpg';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from 'utils/cn';

export const Carousel = () => {
  const images = [heroOne, heroTwo, heroThree];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsSliding(false);
      }, 500);
    }, 7000);
  }, [images.length]);

  useEffect(() => {
    startInterval();

    return () => clearInterval(intervalRef.current);
  }, [startInterval]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    startInterval();
  };

  return (
    <div className="carousel-container overflow-hidden relative w-[98%] mx-auto">
      <div
        className={`carousel-inner w-full h-full flex transition-transform duration-500 ease-in-out ${
          isSliding ? 'transform -translate-x-full' : ''
        }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className="flex-shrink-0 w-full"
          />
        ))}
      </div>
      <div className="absolute flex justify-between w-24 h-5 -translate-x-1/2 bottom-10 left-1/2">
        {images.map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-white size-4 cursor-pointer shadow-sm',
              currentIndex === index ? 'bg-opacity-90' : 'bg-opacity-50'
            )}
            onClick={() => handleDotClick(index)}></div>
        ))}
      </div>
    </div>
  );
};
