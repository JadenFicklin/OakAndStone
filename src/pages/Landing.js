import { Carousel } from 'components/Carousel';
import { Faqs } from 'components/Faqs';
import { Services } from 'components/Services';
import { Spacer } from 'components/Spacer';
import { SingleTestimonial } from 'components/SingleTestimonial';
import { ThreeTestimonials } from 'components/ThreeTestimonials';
import { EditableText } from 'utils/EditableText';

export const Landing = () => {
  return (
    <>
      <div className="mx-auto">
        {/* hero */}
        <h2 className="text-3xl text-center lg:pt-16 lg:pb-10 lg:text-8xl text-brown my-9">
          <EditableText
            firebasePath={`homePageData/homeHeader/heroOne`}
            className="font-semibold xl:py-4 playfair"
          />
          <EditableText
            firebasePath={`homePageData/homeHeader/heroTwo`}
            className="font-semibold xl:py-4 playfair"
          />
        </h2>
        <Carousel />
        <Faqs />
        <Services />
        <SingleTestimonial />
        <ThreeTestimonials />
        <Spacer />
      </div>
    </>
  );
};
