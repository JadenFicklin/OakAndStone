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
      <div>
        <h2>
          If you are interested in having some cabinetry work done in your home,
          please contact us using the form below. We look forward to working
          with you! 
        </h2>
        <form onSubmit={onSubmit}>
          <div>
            <p>
              Name <span className="text-xs opacity-50">(required)</span>
            </p>
            <input type="text" required className="border" name="name" />
          </div>
          <div>
            <p>
              Email Address{' '}
              <span className="text-xs opacity-50">(required)</span>
            </p>
            <input type="email" required className="border" name="email" />
          </div>

          <div>
            <p>
              Message <span className="text-xs opacity-50">(required)</span>
            </p>
            <textarea type="text" required className="border" name="message" />
          </div>

          <button
            type="submit"
            className="bg-[#906C56] p-3 px-5 text-white playfair hover:bg-opacity-90 duration-100">
            Submit
          </button>
        </form>
      </div>
      <div></div>
    </>
  );
};
