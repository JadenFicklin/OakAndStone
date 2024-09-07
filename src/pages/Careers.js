import { Title } from 'components/Title';
import Swal from 'sweetalert2';
import { EditableText } from 'utils/EditableText';

export const Careers = () => {
  const EMAIL_ACCESS_KEY = process.env.REACT_APP_EMAIL_ACCESS_KEY;

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append('access_key', EMAIL_ACCESS_KEY);

    // Prepend the message with the application text
    const originalMessage = formData.get('message');
    formData.set('message', `-- application --\n\n${originalMessage}`);

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
      <Title>Careers</Title>
      <h2 className="w-10/12 py-10 mx-auto text-3xl text-center md:text-6xl text-brown playfair">
        <EditableText
          firebasePath="titles/careers"
          className="text-3xl text-center md:text-6xl playfair"
        />
      </h2>
      <div className="grid w-10/12 md:w-9/12 grid-cols-1 mx-auto md:grid-cols-[70%_30%]">
        <form
          onSubmit={onSubmit}
          className="text-gray-600 max-w-[900px] md:w-11/12 md:pr-10 md:h-max md:my-10 md:mb-20 md:border-r ">
          <h2 className="my-10 text-lg text-center">
            <EditableText
              firebasePath="other/careersAndContact/careersSub"
              className="text-lg"
            />
            <a href="tel:8014306451">(801) 430-6451</a>
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
          <h2 className="my-2 text-base font-medium">
            <EditableText
              firebasePath="other/careersAndContact/locationTitle"
              className="text-base font-medium"
            />
          </h2>
          <p className="my-2 mb-10 text-base">
            <EditableText
              firebasePath="other/careersAndContact/locationSubTitle"
              className="text-base"
            />
          </p>
          <h2 className="text-base font-medium">
            <EditableText
              firebasePath="other/careersAndContact/contactTitle"
              className="text-base font-medium"
            />
          </h2>
          <a
            href="mailto:oakandstonecabinets@gmail.com"
            className="my-2 text-blue-600 underline">
            <EditableText
              firebasePath="other/careersAndContact/email"
              className="text-blue-600 underline"
            />
          </a>
          <p>
            <a href="tel:8014306451" className="my-2">
              <EditableText
                firebasePath="other/careersAndContact/number"
                className="text-base"
              />
            </a>
          </p>
          <p>
            <a href="tel:3852389152" className="my-2">
              <EditableText
                firebasePath="other/careersAndContact/secondNumber"
                className="text-base"
              />
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
