import { Carousel } from 'components/Carousel';
import { Faqs } from 'components/Faqs';
import { Services } from 'components/Services';
import { Spacer } from 'components/Spacer';
import { SingleTestimonial } from 'components/SingleTestimonial';
import { ThreeTestimonials } from 'components/ThreeTestimonials';

export const Landing = () => {
  return (
    <>
      <div className="mx-auto">
        {/* hero */}
        <h2 className="text-3xl text-center lg:pt-16 lg:pb-10 lg:text-8xl text-brown my-9">
          <p className="font-semibold xl:py-4 playfair">Where Your Vision</p>
          <p className="font-semibold xl:py-4 playfair">
            Meets Our Craftsmanship
          </p>
        </h2>
        <Carousel />
        <Faqs />
        <Services />
        <Spacer />
        <SingleTestimonial />
        <ThreeTestimonials />
        <Spacer />
        <Spacer />
        <Spacer />
      </div>
    </>
  );
};
