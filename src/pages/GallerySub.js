import { ParallaxSection } from 'components/ParallaxSection';
import { Spacer } from 'components/Spacer';
import { Title } from 'components/Title';
import { galleryData } from 'data/Gallery';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

export const GallerySub = ({ path }) => {
  // Find the matching gallery item based on the path
  const galleryItem = galleryData.find((item) => item.link === path);

  return (
    <>
      <Title classname="flex flex-wrap items-center">
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
            initialOffset={-50}
            parallaxSpeed={0.1}
            classname="grid w-9/12 gap-10 text-5xl text-left md:text-7xl"
            overlayColor="rgba(143, 99, 70, 0.4)">
            <h3 className="text-4xl md:text-6xl xl:text-8xl">
              {galleryItem.title}
            </h3>
            <p className="text-lg xl:text-2xl">{galleryItem.text}</p>
          </ParallaxSection>
        )}
      </div>
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer />
    </>
  );
};
