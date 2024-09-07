import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from 'utils/cn';
import { useFirebaseImage } from 'utils/useFirebaseImage';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';
import { getDatabase, ref, get } from 'firebase/database';
import { EditableText } from 'utils/EditableText';

export const Faqs = () => {
  const [currentFaq, setCurrentFaq] = useState(0);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch FAQ data from Firebase Realtime Database
  useEffect(() => {
    const fetchFaqData = async () => {
      const db = getDatabase();
      const faqRef = ref(db, 'homePageData/homeFaq');
      const snapshot = await get(faqRef);
      if (snapshot.exists()) {
        setFaqData(snapshot.val());
      } else {
        console.log('No FAQ data available');
      }
      setLoading(false);
    };

    fetchFaqData();
  }, []);

  if (loading) {
    return <div>Loading FAQs...</div>;
  }

  return (
    <>
      <div className="grid items-center grid-cols-1 mx-auto my-20 xl:w-10/12 md:grid-cols-2 xl:relative xl:left-8">
        <div className=" md:order-2 md:h-[500px]">
          {faqData.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentFaq(index);
              }}
              className="relative flex flex-wrap w-10/12 mx-auto my-10 cursor-pointer text-brown">
              <div
                className={cn(
                  'h-[110%] w-[3px]  absolute -left-6',
                  currentFaq === index ? 'bg-brown' : ''
                )}></div>
              <div className="max-w-[400px]">
                {/* Editable Title */}
                <EditableText
                  firebasePath={`homePageData/homeFaq/${index}/title`}
                  className="text-3xl"
                />

                {/* Editable Subtitle */}
                {item.subTitle && (
                  <EditableText
                    firebasePath={`homePageData/homeFaq/${index}/subTitle`}
                    className="pt-3 text-xs opacity-50"
                  />
                )}

                {/* Editable Text */}
                <EditableText
                  firebasePath={`homePageData/homeFaq/${index}/text`}
                  className="py-3 text-xs"
                />

                {/* Link Button */}
                {currentFaq === index && (
                  <Link
                    to={item.link}
                    onClick={scrollToTop}
                    className="absolute ml-1 text-xs text-blue-400 cursor-pointer -bottom-2">
                    <EditableText
                      firebasePath={`homePageData/homeFaq/${index}/button`}
                      className="text-xs text-blue-400"
                    />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative">
          {imageUrl ? (
            <img
              className="w-11/12 mx-auto md:order-1 bg-no-repeat bg-cover max-h-[400px] max-w-[800px] my-10 object-cover"
              src={imageUrl}
              alt={faqData[currentFaq]?.imageAlt || 'FAQ Image'}
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
