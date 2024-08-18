import { ParallaxSection } from 'components/ParallaxSection';
import { Spacer } from 'components/Spacer';
import { Title } from 'components/Title';
import { galleryData } from 'data/Gallery';

export const GallerySub = () => {
  return (
    <>
      <Title>Gallery</Title>
      <div className="-mt-10 text-white">
        <ParallaxSection
          backgroundImage={galleryData[0].image}
          height="400px"
          initialOffset={-50}
          parallaxSpeed={0.1}
          classname="grid w-9/12 gap-10 text-5xl text-left md:text-7xl"
          overlayColor="rgba(143, 99, 70, 0.4)">
          <h3 className="text-4xl md:text-6xl xl:text-8xl">
            {galleryData[0].title}
          </h3>
          <p className="text-lg xl:text-2xl">{galleryData[0].text}</p>
          {/* </div> */}
        </ParallaxSection>
      </div>
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer />
    </>
  );
};
