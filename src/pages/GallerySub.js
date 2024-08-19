import { ParallaxSection } from 'components/ParallaxSection';
import { Title } from 'components/Title';
import { galleryData } from 'data/Gallery';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

export const GallerySub = ({ path }) => {
  const galleryItem = galleryData?.find((item) => item.link === path);

  return (
    <>
      <Title>
        <Link to="/gallery" className="mx-5">
          <IoIosArrowRoundBack className="text-white size-10" />
        </Link>
        Gallery {galleryItem ? `- ${galleryItem.title}` : ''}
      </Title>
      <div className="relative -mt-10 text-white">
        {galleryItem && (
          <ParallaxSection
            backgroundImage={galleryItem.image}
            height="400px"
            initialOffset={35}
            parallaxSpeed={0.1}
            classname="grid w-9/12 gap-10 text-5xl text-left md:text-7xl"
            overlayColor="rgba(143, 99, 70, 0.4)">
            <h3 className="text-4xl md:text-6xl xl:text-8xl">
              {galleryItem.title}
            </h3>
            <p className="text-lg xl:text-2xl">{galleryItem.text}</p>
          </ParallaxSection>
        )}
        <div className="absolute w-full h-full p-5 px-32 text-white -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 top-1/2 left-1/2 shadow-custom"></div>
      </div>
      <div className="grid w-10/12 mx-auto my-6 gap-y-6">
        {galleryItem.imageCollection.map((item) => (
          <img
            src={item}
            alt={galleryItem.title}
            className="w-full object-cover max-h-[800px]"
          />
        ))}
      </div>
    </>
  );
};
