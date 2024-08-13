import heroImage from 'assets/images/landing/kitchen remodel 10.jpg';

export const Landing = () => {
  return (
    <>
      <div className="w-11/12 mx-auto">
        <h2 className="text-3xl font-semibold text-center playfair text-brown my-9">
          Where Your Vision <br></br> Meets Our Craftsmanship
        </h2>
        <img src={heroImage} alt="kitchen remodel" />
      </div>
    </>
  );
};
