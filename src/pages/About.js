import { Title } from 'components/Title';
import { aboutHeaderData } from 'data/About';
import { aboutPeopleData } from 'data/About';

export const About = () => {
  return (
    <div className="text-brown">
      <Title>About</Title>
      {/* team behind oak and stone */}
      <div className="grid w-10/12 mx-auto gap-y-6">
        <h2 className="text-2xl font-medium text-center">
          {aboutHeaderData.title}
        </h2>
        <img
          src={aboutHeaderData.image}
          alt="oak and stone team building their warehouse"
          className="my-6"
        />
        <p>{aboutHeaderData.text}</p>
        <p>{aboutHeaderData.text2}</p>
        <p>{aboutHeaderData.text3}</p>
      </div>

      {/* devider */}
      <div className="w-10/12 mx-auto h-[1px] my-20 bg-brown"></div>
      {/* members */}
      {aboutPeopleData.map((item) => (
        <div className="grid w-10/12 mx-auto my-6 gap-y-6">
          <img
            src={item.image}
            alt="oak and stone team building their warehouse"
            className="my-6"
          />
          <h2 className="text-2xl font-medium text-center">{item.name}</h2>
          <p>{item.text}</p>
          <p>{item.text2}</p>
        </div>
      ))}
    </div>
  );
};
