import { Carousel } from 'components/Carousel';
import { Faqs } from 'components/Faqs';
import { Services } from 'components/Services';
import { SingleTestimonial } from 'components/SingleTestimonial';
import { ThreeTestimonials } from 'components/ThreeTestimonials';
import { ImageDisplay } from 'components/ImageDisplay';

export const Landing = () => {
  return (
    <>
      <div className="mx-auto">
        {/* hero */}
        <div className="text-3xl text-center lg:pt-16 lg:pb-10 lg:text-8xl text-brown my-9">
          <h2 className="font-semibold xl:py-4 playfair">Where Your Vision</h2>
          <h2 className="font-semibold xl:py-4 playfair">
            Meets Our Craftsmanship
          </h2>
        </div>
        <Carousel />
        <Faqs />
        <Services />
        <SingleTestimonial />
        <ThreeTestimonials />
        <ImageDisplay />
      </div>
    </>
  );
};
