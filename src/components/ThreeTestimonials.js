import { testimonialsData } from 'data/Testimonials';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { cn } from 'utils/cn';

export const ThreeTestimonials = () => {
  const [startIndex, setStartIndex] = useState(0);
  const displayCount = 3;

  const handleLeftClick = () => {
    setStartIndex((prevIndex) => {
      return prevIndex === 0
        ? testimonialsData.length - displayCount
        : prevIndex - 1;
    });
  };

  const handleRightClick = () => {
    setStartIndex((prevIndex) => {
      return prevIndex === testimonialsData.length - displayCount
        ? 0
        : prevIndex + 1;
    });
  };

  const testimonialsToDisplay = testimonialsData.slice(
    startIndex,
    startIndex + displayCount
  );

  if (testimonialsToDisplay.length < displayCount) {
    testimonialsToDisplay.push(
      ...testimonialsData.slice(0, displayCount - testimonialsToDisplay.length)
    );
  }

  return (
    <div className="relative hidden xxl:block text-brown">
      <h2 className="w-full my-20 mt-32 text-4xl text-center">Testimonials</h2>

      <div className="relative flex justify-between mx-auto space-x-4 w-max">
        <div
          className="absolute top-0 grid content-center h-full cursor-pointer -left-7 w-max"
          onClick={handleLeftClick}>
          <FaChevronLeft className="m-3 size-5" />
        </div>
        {testimonialsToDisplay.map((item, index) => (
          <div
            key={index}
            className="border-[1px] rounded-md border-opacity-25 p-10 w-[400px] min-h-[320px] h-max text-center relative">
            <div
              className={cn(
                item.color,
                'rounded-full w-10 h-10 flex items-center justify-center mx-auto absolute top-0 text-xl text-white -translate-y-1/2 left-1/2 -translate-x-1/2 select-none'
              )}>
              {item.name[0]}
            </div>
            <h3 className="mb-4 font-bold">{item.name}</h3>
            <div>{item.text}</div>
          </div>
        ))}
        <div
          className="absolute top-0 grid content-center h-full cursor-pointer -right-11 w-max"
          onClick={handleRightClick}>
          <FaChevronRight className="m-3 size-5" />
        </div>
      </div>
    </div>
  );
};
