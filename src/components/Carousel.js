import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from 'utils/cn';
import { useFirebaseImage } from 'utils/useFirebaseImage';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';

export const Carousel = () => {
  const imagePaths = [
    'images/landing/kitchen-remodel-8.jpg',
    'images/landing/kitchen-remodel-3.jpg',
    'images/landing/kitchen-remodel-10.jpg'
  ];
  const [user] = useAtom(userAtom);

  // Use the useFirebaseImage hook for each image
  const imageOne = useFirebaseImage(imagePaths[0]);
  const imageTwo = useFirebaseImage(imagePaths[1]);
  const imageThree = useFirebaseImage(imagePaths[2]);

  // Collect all the images with their upload buttons
  const firebaseImages = [imageOne, imageTwo, imageThree];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
        setIsSliding(false);
      }, 500);
    }, 5000);
  }, [imagePaths.length]);

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
        {firebaseImages.map(({ imageUrl, UploadButton }, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 object-cover w-full bg-no-repeat">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Slide ${index}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                Loading...
              </div>
            )}
            {user.email && <UploadButton />}
          </div>
        ))}
      </div>
      <div className="absolute flex justify-between w-16 h-5 -translate-x-1/2 lg:w-24 bottom-3 lg:bottom-10 left-1/2">
        {firebaseImages.map((_, index) => (
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
