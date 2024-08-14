import { landingFaqData } from 'data/LandingFaq';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from 'utils/cn';

export const LandingFaqs = () => {
  const [currentFaq, setCurrentFaq] = useState(0);
  console.log(currentFaq);
  return (
    <>
      <div></div>
      <div>
        {landingFaqData.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setCurrentFaq(index);
            }}
            className="relative flex flex-wrap w-10/12 mx-auto my-10 cursor-pointer text-brown">
            <div
              className={cn(
                'h-full w-[3px] absolute -left-6',
                currentFaq === index ? 'bg-brown' : ''
              )}></div>
            <div>
              <h2 className="text-3xl">{item.title}</h2>
              {item.subTitle && (
                <h3 className="pt-3 text-xs opacity-50">{item.subTitle}</h3>
              )}
              <p className="py-3 text-xs">
                {item.text}{' '}
                {currentFaq === index && (
                  <Link to={item.link} className="ml-1 text-xs text-blue-400">
                    {item.button}
                  </Link>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      <img
        className="w-11/12 mx-auto"
        src={landingFaqData[currentFaq].image}
        alt={landingFaqData[currentFaq].imageAlt}
      />
    </>
  );
};
