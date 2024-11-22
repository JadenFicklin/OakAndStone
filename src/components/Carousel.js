import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from 'utils/cn';
import kitchenRemodelEight from '../assets/images/landing/kitchen-remodel-8.jpg';
import kitchenRemodelThree from '../assets/images/landing/kitchen-remodel-3.jpg';
import kitchenRemodelTen from '../assets/images/landing/kitchen-remodel-10.jpg';

export const Carousel = () => {
  const localImages = [
    kitchenRemodelEight,
    kitchenRemodelThree,
    kitchenRemodelTen
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % localImages.length);
        setIsSliding(false);
      }, 500);
    }, 5000);
  }, [localImages.length]);

  useEffect(() => {
    startInterval();

    return () => clearInterval(intervalRef.current);
  }, [startInterval]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    startInterval();
  };

  return (
    <div className="overflow-hidden relative w-[98%] mx-auto max-h-[800px]">
      <div
        className={`carousel-inner w-full h-full flex transition-transform duration-500 ease-in-out ${
          isSliding ? 'transform -translate-x-full' : ''
        }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {localImages.map((image, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 object-cover w-full bg-no-repeat">
            <img
              src={image}
              alt={`Slide ${index}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
      <div className="absolute flex justify-between w-16 h-5 -translate-x-1/2 lg:w-24 bottom-3 lg:bottom-10 left-1/2">
        {localImages.map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-white size-3 lg:size-4 cursor-pointer shadow-sm',
              currentIndex === index ? 'bg-opacity-90' : 'bg-opacity-50'
            )}
            onClick={() => handleDotClick(index)}></div>
        ))}
      </div>
    </div>
  );
};
