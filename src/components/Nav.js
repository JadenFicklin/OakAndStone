import { Link } from 'react-router-dom';
import logo from 'assets/images/logo/logo.svg';
import { useState } from 'react';

export const Nav = () => {
  const [open, setOpen] = useState();

  return (
    <>
      <div
        className="w-full h-11 bg-brown sm:hidden"
        onClick={() => setOpen(!open)}></div>
      <Link to="/">
        <img
          alt="oak and stone logo"
          src={logo}
          className="h-16 mx-auto my-9"
        />
        <div className="w-10/12 h-[1px] bg-brown  mx-auto"></div>
      </Link>
      {open && (
        <nav className="flex flex-wrap gap-x-4">
          {navOptions.map((item) => (
            <Link to={item.link}>{item.text}</Link>
          ))}
          <p>(801) 430-6451</p>
        </nav>
      )}
    </>
  );
};

const navOptions = [
  {
    text: 'About',
    link: '/about'
  },
  {
    text: 'Gallery',
    link: '/gallery'
  },
  {
    text: 'Process',
    link: '/process'
  },
  {
    text: 'Careers',
    link: '/careers'
  },
  {
    text: 'Contact',
    link: '/contact'
  }
];
