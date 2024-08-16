import { useEffect, useState, useRef } from 'react';
import { galleryData } from 'data/Gallery';
import { Link } from 'react-router-dom';

export const Gallery = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRefs = useRef([]);

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

  return (
    <>
      <div className="grid text-white gap-y-10">
        {galleryData.map((item, index) => (
          <div
            key={index}
            className="relative w-full h-full overflow-hidden"
            ref={(el) => (containerRefs.current[index] = el)}>
            {/* image */}
            <div
              className="content-center w-full bg-center bg-no-repeat bg-cover pointer-events-none h-[600px] transform scale-[140%] md:scale-[130%] lg:scale-[120%]"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundPositionY: `${
                  (scrollPosition -
                    (containerRefs.current[index]?.offsetTop || 0)) *
                  0.3
                }px`
              }}></div>
            {/* Overlay */}
            <div
              style={{ backgroundColor: 'rgba(143, 99, 70, 0.4)' }}
              className="absolute inset-0 "></div>
            {/* text */}
            <div className="absolute inset-0 grid content-center w-11/12 mx-auto sm:w-9/12 gap-y-10">
              <h3 className="text-4xl md:text-6xl xl:text-8xl">{item.title}</h3>
              <p className="text-lg xl:text-2xl">{item.text}</p>
              <Link
                to={item.link}
                className="p-5 duration-150 sm:p-6 text-md xl:text-xl bg-zinc-900 w-max hover:bg-zinc-950">
                {item.button}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
