import heroImage from 'assets/images/landing/kitchen remodel 10 cropped.jpg';
import { LandingFaqs } from 'components/LandingFaqs';

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
        <img
          src={heroImage}
          alt="kitchen remodel"
          className="w-[98%] mx-auto"
        />
        {/* faqs */}
        <LandingFaqs />
      </div>
    </>
  );
};
