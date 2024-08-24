import { Title } from 'components/Title';
import { processData } from 'data/Process';
import { cn } from 'utils/cn';

export const Process = () => {
  return (
    <>
      <Title>Our process</Title>

      <h2 className="w-8/12 py-10 pb-20 mx-auto text-3xl text-center md:text-6xl text-brown playfair">
        From Concept to Creation: Our Step-by-Step Process
      </h2>

      <div className="grid w-10/12 mx-auto mb-20 lg:w-8/12 gap-y-6 text-brown">
        {processData.map((item, index) => (
          <div key={index}>
            <div className="grid gap-y-6 lg:grid-cols-2 lg:items-center">
              <h2 className="text-3xl lg:hidden">{item.title}</h2>
              <img
                src={item.image}
                alt={item.title}
                className="lg:order-2 lg:mx-auto"
              />
              <div className="lg:grid lg:content-evenly lg:w-3/4 lg:h-3/4">
                <h2 className="hidden text-3xl lg:block">{item.title}</h2>
                <p>{item.text}</p>
              </div>
            </div>
            <div
              className={cn(
                'w-full h-[1px] bg-brown my-10',
                index === processData.length - 1 && 'hidden'
              )}></div>
          </div>
        ))}
      </div>
    </>
  );
};
