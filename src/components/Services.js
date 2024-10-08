import { landingServicesData } from 'data/LandingServices';
import { Link } from 'react-router-dom';
import HoverImage from 'utils/HoverImage';
import { ParallaxSection } from 'components/ParallaxSection';
import { userAtom } from '../atoms/userAtom';
import { useAtom } from 'jotai';
import { galleryAtom } from 'atoms/galleryAtom';
import { useFirebaseImage } from 'utils/useFirebaseImage';

export const Services = () => {
  const [user] = useAtom(userAtom);

  const {
    imageUrl: serviceImageUrl,
    error,
    UploadButton
  } = useFirebaseImage('images/landing/services.jpg');
  const [, setGallery] = useAtom(galleryAtom);

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
          <h2 className="w-full py-10 text-4xl text-white border-b border-white border-opacity-25 lg:text-6xl">
            Our services
          </h2>
          <div className="hidden lg:block">
            {landingServicesData.map((item) => (
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
            ))}
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
