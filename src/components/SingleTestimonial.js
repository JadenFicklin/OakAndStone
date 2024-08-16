import { testimonialsData } from 'data/Testimonials';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { cn } from 'utils/cn';

export const SingleTestimonial = () => {
  const [count, setCount] = useState(0);

  const handleLeftClick = () => {
    setCount(count === 0 ? testimonialsData.length - 1 : count - 1);
  };

  const handleRightClick = () => {
    setCount(count === testimonialsData.length - 1 ? 0 : count + 1);
  };

  return (
    <div className="relative text-brown xxl:hidden">
      <h2 className="w-full my-20 mt-32 text-4xl text-center">Testimonials</h2>
      {testimonialsData.map((item, index) => (
        <>
          <div
            key={index}
            className={cn(
              index === count
                ? 'border-[1px] rounded-md border-opacity-25 p-10 mx-auto w-[75%] max-w-[400px]  min-h-[320px] h-max text-center relative'
                : 'hidden'
            )}>
            <div
              className="absolute top-0 grid content-center h-full cursor-pointer -left-11 w-max"
              onClick={handleLeftClick}>
              <FaChevronLeft className="m-3 size-5" />
            </div>
            <div
              className="absolute top-0 grid content-center h-full cursor-pointer -right-11 w-max"
              onClick={handleRightClick}>
              <FaChevronRight className="m-3 size-5" />
            </div>
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
        </>
      ))}
    </div>
  );
};
