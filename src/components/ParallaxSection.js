import { useEffect, useState } from 'react';
import { cn } from 'utils/cn';

export const ParallaxSection = ({
  backgroundImage,
  height = '300px',
  classname,
  initialOffset = -300,
  parallaxSpeed = 0.1,
  overlayColor = 'rgba(143, 99, 70, 0.4)',

  children
}) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('parallax-section');
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight && sectionTop > 0) {
          setOffsetY((windowHeight - sectionTop) * parallaxSpeed);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [parallaxSpeed]);

  return (
    <div className="relative" style={{ height }}>
      {children && (
        <div
          className={cn(
            'absolute z-10 text-center text-white -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2',
            classname
          )}>
          {children}
        </div>
      )}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ backgroundColor: overlayColor }}></div>
      <div
        id="parallax-section"
        className="w-full bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: 'fixed',
          backgroundPositionY: `${initialOffset + offsetY}px`,
          backgroundSize: 'cover',
          height: '100%'
        }}></div>
    </div>
  );
};
