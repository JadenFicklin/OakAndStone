import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export const ParallaxSectionTwo = ({ image, title, text, button, link }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const calculateParallax = () => {
    if (containerRef.current) {
      const offsetTop = containerRef.current.offsetTop;
      return (scrollPosition - offsetTop) * 0.3;
    }
    return 0;
  };

  return (
    <div className="relative w-full h-full overflow-hidden" ref={containerRef}>
      {/* Background Image with Parallax */}
      <div
        className="content-center w-full bg-center bg-no-repeat bg-cover pointer-events-none h-[600px] transform scale-[140%] md:scale-[130%] lg:scale-[120%]"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPositionY: `${calculateParallax()}px`
        }}></div>

      {/* Overlay */}
      <div
        style={{ backgroundColor: 'rgba(143, 99, 70, 0.4)' }}
        className="absolute inset-0"></div>

      {/* Text Content */}
      <div className="absolute inset-0 grid content-center w-11/12 mx-auto sm:w-9/12 gap-y-10">
        <h3 className="text-4xl md:text-6xl xl:text-8xl">{title}</h3>
        <p className="text-lg xl:text-2xl">{text}</p>
        <Link
          to={link}
          className="p-5 duration-150 sm:p-6 text-md xl:text-xl bg-zinc-900 w-max hover:bg-zinc-950">
          {button}
        </Link>
      </div>
    </div>
  );
};
