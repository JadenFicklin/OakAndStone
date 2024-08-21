import { Title } from 'components/Title';
import Swal from 'sweetalert2';

export const Contact = () => {
  const EMAIL_ACCESS_KEY = process.env.REACT_APP_EMAIL_ACCESS_KEY;

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append('access_key', EMAIL_ACCESS_KEY);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      Swal.fire({
        title: 'Success!',
        text: 'Message sent successfully!',
        icon: 'success'
      });
    }
  };

  return (
    <>
      <Title>Contact us</Title>
      <div className="grid w-10/12 md:w-9/12 grid-cols-1 mx-auto md:grid-cols-[70%_30%]">
        <form
          onSubmit={onSubmit}
          className="text-gray-600 max-w-[900px] md:w-11/12 md:pr-10 md:h-max md:my-10 md:mb-20 md:border-r ">
          <h2 className="my-10 text-lg text-center">
            If you are interested in having some cabinetry work done in your
            home, please contact us using the form below. We look forward to
            working with you! 
          </h2>
          <div className="my-2">
            <p className="text-xl">
              Name <span className="text-xs opacity-50">(required)</span>
            </p>
            <input
              type="text"
              required
              className="w-full p-2 my-2 bg-black border border-black border-opacity-30 bg-opacity-5"
              name="name"
            />
          </div>
          <div className="my-2">
            <p className="text-xl">
              Email Address{' '}
              <span className="text-xs opacity-50">(required)</span>
            </p>
            <input
              type="email"
              required
              name="email"
              className="w-full p-2 my-2 bg-black border border-black border-opacity-30 bg-opacity-5"
            />
          </div>
          <div className="my-2">
            <p className="text-xl">
              Message <span className="text-xs opacity-50">(required)</span>
            </p>
            <textarea
              type="text"
              required
              className="w-full p-2 my-2 bg-black border border-black border-opacity-30 bg-opacity-5 min-h-24"
              name="message"
            />
          </div>

          <button
            type="submit"
            className="bg-[#906C56] p-3 px-5 text-white playfair hover:bg-opacity-90 duration-100 mb-10">
            Submit
          </button>
        </form>
        <div className="mb-20 text-gray-600 md:my-20 h-max">
          <h2 className="my-2 text-base font-medium">WHERE WE WORK</h2>
          <p className="my-2 mb-10 text-base">
            We work in the greater Wasatch Front, from Logan to Lehi
          </p>
          <h2 className="text-base font-medium">Contact</h2>
          <a
            href="mailto:oakandstonecabinets@gmail.com"
            className="my-2 text-blue-600 underline">
            oakandstonecabinets@gmail.com
          </a>
          <p className="my-2">(801) 430-6451</p>
          <p className="my-2">(385) 238-9152</p>
        </div>
      </div>
    </>
  );
};
