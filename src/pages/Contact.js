import { Title } from 'components/Title';
// import { useState } from 'react';
import Swal from 'sweetalert2';

export const Contact = () => {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [subject, setSubject] = useState('');
  // const [message, setMessage] = useState('');

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(name, email, subject, message);
  // };
  const { EMAIL_ACCESS_KEY } = import.meta.env;

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
            <input
              type="text"
              required
              className="border"
              // onChange={(e) => setName(e.target.value)}
              name="name"
            />
          </div>
          <div>
            <p>
              Email Address{' '}
              <span className="text-xs opacity-50">(required)</span>
            </p>
            <input
              type="email"
              required
              className="border"
              // onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
          </div>

          <div>
            <p>
              Message <span className="text-xs opacity-50">(required)</span>
            </p>
            <textarea
              type="text"
              required
              className="border"
              // onChange={(e) => setMessage(e.target.value)}
              name="message"
            />
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
