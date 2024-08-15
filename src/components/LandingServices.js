import { landingServicesData } from 'data/LandingServices';
import { Link } from 'react-router-dom';
import HoverImage from 'utils/HoverImage';

export const LandingServices = () => {
  return (
    <div className="w-10/12 mx-auto md:mt-20">
      <h2 className="text-3xl border-b-[1px] py-3">Our Services</h2>
      {landingServicesData.map((item) => (
        <HoverImage
          image={item.image}
          width="500px"
          height="250px"
          offsetX={35}
          offsetY={-5}>
          <Link to={item.link}>
            <div className="border-b-[1px] py-3 pl-3 hover:bg-brown hover:bg-opacity-10">
              {item.name}
            </div>
          </Link>
        </HoverImage>
      ))}
    </div>
  );
};
