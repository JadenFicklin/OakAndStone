import { Title } from 'components/Title';
import { aboutHeaderData } from 'data/About';
import { aboutPeopleData } from 'data/About';

export const About = () => {
  return (
    <div className="text-brown">
      <Title>About</Title>

      <h2 className="w-10/12 py-10 mx-auto -mt-10 text-3xl text-center md:text-6xl text-brown playfair">
        Meet the Craftsmen Behind Oak and Stone: A Legacy of Precision and
        Passion
      </h2>
      {/* team behind oak and stone */}
      <div className="grid w-10/12 mx-auto xl:my-20 xl:grid-cols-2 gap-y-6 ">
        <img
          src={aboutHeaderData.image}
          alt="oak and stone team building their warehouse"
          className="object-cover my-6 xl:order-2 xl:h-full xl:my-0"
        />
        <div className="grid mx-auto h-max gap-y-6 xl:w-10/12 xl:text-xl">
          <p>
            {aboutHeaderData.text}
            <br></br>
            <br></br>
            {aboutHeaderData.text2}
            <br></br>
            <br></br>
            {aboutHeaderData.text3}
          </p>
        </div>
      </div>

      {/* devider */}
      <div className="w-10/12 mx-auto h-[1px] my-20 bg-brown"></div>
      {/* members */}
      {aboutPeopleData.map((item, index) => (
        <div
          key={index}
          className="grid w-10/12 grid-cols-1 mx-auto my-6 mb-20 xl:text-xl xl:grid-cols-2 gap-y-6 xl:gap-x-20 h-max">
          <img
            src={item.image}
            alt={item.name}
            className="object-cover object-left my-6 bg-no-repeat bg-cover xl:my-0 xl:h-full"
          />
          <div className="grid gap-y-6 h-max">
            <h2 className="text-2xl font-medium text-left xl:text-2xl">
              {item.name}
            </h2>
            <p>
              {item.text}
              <br></br>
              <br></br>
              {item.text2}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
