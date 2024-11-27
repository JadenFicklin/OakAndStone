import { useState, useEffect } from 'react';
import { landingServicesData } from 'data/LandingServices';
import { Link } from 'react-router-dom';
import HoverImage from 'utils/HoverImage';
import { ParallaxSection } from 'components/ParallaxSection';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';
import { galleryAtom } from 'atoms/galleryAtom';
import { useFirebaseImage } from 'utils/useFirebaseImage';
import { getDatabase, ref, onValue, set } from 'firebase/database';

export const Services = () => {
  const [user] = useAtom(userAtom);
  const [, setGallery] = useAtom(galleryAtom);
  const [hoverEnabled, setHoverEnabled] = useState(true); // State to toggle hover feature
  const {
    imageUrl: serviceImageUrl,
    error,
    UploadButton
  } = useFirebaseImage('images/landing/services.jpg');

  const db = getDatabase();

  useEffect(() => {
    // Fetch initial hoverEnabled value from Firebase
    const hoverRef = ref(db, 'settings/hoverEnabled');
    onValue(hoverRef, (snapshot) => {
      const value = snapshot.val();
      if (value !== null) {
        setHoverEnabled(value);
      }
    });
  }, [db]);

  const toggleHoverFeature = () => {
    const newHoverEnabled = !hoverEnabled;
    setHoverEnabled(newHoverEnabled);

    // Save the updated hoverEnabled value to Firebase
    const hoverRef = ref(db, 'settings/hoverEnabled');
    set(hoverRef, newHoverEnabled);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const serviceClicked = (item) => {
    setGallery(item.link);
    scrollToTop();
  };

  if (error) {
    return <div>Error loading image</div>;
  }

  return (
    <>
      <div className="relative">
        {serviceImageUrl && (
          <ParallaxSection
            backgroundImage={serviceImageUrl}
            height="700px"
            initialOffset={-0}
            parallaxSpeed={0.1}
            classname="text-5xl md:text-7xl"
            overlayColor="rgba(143, 99, 70, 0.4)"
          />
        )}
        {user.email && <UploadButton />}

        <div className="absolute w-full h-full p-5 text-white -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 md:px-32 top-1/2 left-1/2 shadow-custom">
          <div className="flex items-center justify-between">
            <h2 className="py-10 text-4xl text-white border-b border-white border-opacity-25 lg:text-6xl">
              Our services
            </h2>
            {user.email && (
              <button
                className="absolute px-4 py-2 text-sm text-black bg-white rounded-md top-2 left-2 hover:bg-opacity-80"
                onClick={toggleHoverFeature}>
                {hoverEnabled ? 'Disable Hover Images' : 'Enable Hover Images'}
              </button>
            )}
          </div>
          <div className="hidden lg:block">
            {landingServicesData.map((item) =>
              hoverEnabled ? (
                <HoverImage
                  key={item.name}
                  image={item.image}
                  width="500px"
                  height="250px"
                  offsetX={35}
                  offsetY={-5}>
                  <Link to={`/gallery/${item.slug}`} onClick={scrollToTop}>
                    <div className="pl-3 text-xl border-b border-white border-opacity-25 py-7 hover:bg-black hover:bg-opacity-50">
                      {item.name}
                    </div>
                  </Link>
                </HoverImage>
              ) : (
                <Link
                  key={item.name}
                  to={`/gallery/${item.slug}`}
                  onClick={scrollToTop}>
                  <div className="pl-3 text-xl border-b border-white border-opacity-25 py-7 hover:bg-black hover:bg-opacity-50">
                    {item.name}
                  </div>
                </Link>
              )
            )}
          </div>
          <div className="lg:hidden">
            {landingServicesData.map((item) => (
              <Link
                onClick={() => serviceClicked(item)}
                to={`/gallery/${item.slug}`}
                key={item.name}>
                <div className="border-b-[1px] py-7 pl-3 hover:bg-brown hover:bg-opacity-5">
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
