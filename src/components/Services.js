import { landingServicesData } from 'data/LandingServices';
import { Link } from 'react-router-dom';
import HoverImage from 'utils/HoverImage';
import services from 'assets/images/landing/services.jpg';
import { ParallaxSection } from 'components/ParallaxSection';

export const Services = () => {
  return (
    <>
      <ParallaxSection
        backgroundImage={services}
        height="1000px"
        initialOffset={-0}
        parallaxSpeed={0.1}
        classname="text-5xl md:text-7xl"
        overlayColor="rgba(143, 99, 70, 0.4)">
        Our Services
      </ParallaxSection>
      <div className="w-10/12 mx-auto md:my-3 border-t-[1px]">
        <div className="hidden lg:block">
          {landingServicesData.map((item) => (
            <HoverImage
              key={item.name}
              image={item.image}
              width="500px"
              height="250px"
              offsetX={35}
              offsetY={-5}>
              <Link to={item.link}>
                <div className="border-b-[1px] py-7 pl-3 hover:bg-brown hover:bg-opacity-5">
                  {item.name}
                </div>
              </Link>
            </HoverImage>
          ))}
        </div>
        <div className="lg:hidden">
          {landingServicesData.map((item) => (
            <Link to={item.link} key={item.name}>
              <div className="border-b-[1px] py-7 pl-3 hover:bg-brown hover:bg-opacity-5">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
