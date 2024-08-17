import { Title } from 'components/Title';
import { galleryData } from 'data/Gallery';
import { ParallaxSectionTwo } from 'components/ParallaxSectionTwo';

export const Gallery = () => {
  return (
    <>
      <Title>Our Services</Title>
      <div className="grid -mt-10 text-white gap-y-10">
        {galleryData.map((item, index) => (
          <ParallaxSectionTwo
            key={index}
            image={item.image}
            title={item.title}
            text={item.text}
            button={item.button}
            link={item.link}
          />
        ))}
      </div>
    </>
  );
};
