import { landingFaqData } from 'data/LandingFaq';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from 'utils/cn';
import { useFirebaseImage } from 'utils/useFirebaseImage';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';

export const Faqs = () => {
  const [currentFaq, setCurrentFaq] = useState(0);

  const imageOne = useFirebaseImage('images/landing/about-rodney.jpg');
  const imageTwo = useFirebaseImage('images/landing/contact-where.jpeg');
  const imageThree = useFirebaseImage(
    'images/landing/process-manufacturing.jpg'
  );

  const [user] = useAtom(userAtom);

  const faqImages = [imageOne, imageTwo, imageThree];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const { imageUrl, UploadButton } = faqImages[currentFaq] || {};

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
                    <Link
                      to={item.link}
                      onClick={scrollToTop}
                      className="ml-1 text-xs text-blue-400">
                      {item.button}
                    </Link>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative">
          {imageUrl ? (
            <img
              className="w-11/12 mx-auto md:order-1 bg-no-repeat bg-cover max-h-[400px] max-w-[800px] my-10 object-cover"
              src={imageUrl}
              alt={landingFaqData[currentFaq].imageAlt}
            />
          ) : (
            <div className="w-11/12 mx-auto flex items-center justify-center bg-gray-200 max-h-[400px] max-w-[800px] my-10 object-cover">
              Loading...
            </div>
          )}

          {user.email && <UploadButton />}
        </div>
      </div>
    </>
  );
};
