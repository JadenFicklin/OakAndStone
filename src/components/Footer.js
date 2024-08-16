import logo from 'assets/images/logo/logo.svg';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div className="pt-10 text-center bg-[#D9D9D9] text-brown bg-opacity-10 border-t border-black border-opacity-40">
        <Link to="/" onClick={handleLogoClick}>
          <img src={logo} alt="oak and stone logo" className="h-12 mx-auto" />
        </Link>
        <p className="my-6 text-xs mb-14">(801) 430-6451</p>
        <p className="py-6 text-xs font-semibold">
          Copyright 2024 Oak and Stone Remodel
        </p>
      </div>
    </>
  );
};
