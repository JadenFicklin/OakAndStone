import { landingFaqData } from 'data/LandingFaq';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from 'utils/cn';

export const Faqs = () => {
  const [currentFaq, setCurrentFaq] = useState(0);
  return (
    <>
      <div className="grid items-center grid-cols-1 mx-auto my-20 xl:w-10/12 md:grid-cols-2 xl:relative xl:left-8">
        <div className="md:order-2">
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
              <div className="max-w-[400px]">
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
          className="w-11/12 mx-auto md:order-1 bg-no-repeat bg-cover max-h-[400px] max-w-[800px] my-10 object-cover"
          src={landingFaqData[currentFaq].image}
          alt={landingFaqData[currentFaq].imageAlt}
        />
      </div>
    </>
  );
};
