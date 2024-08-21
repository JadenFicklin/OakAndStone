import React from 'react';
import logo from 'assets/images/logo/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms/userAtom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Swal from 'sweetalert2';

export const Footer = () => {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser({});
      navigate('/');
      handleLogoClick();

      Swal.fire({
        title: 'Success!',
        text: 'Logged out successfully!',
        icon: 'success'
      });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      <div className="pt-10 text-center bg-[#D9D9D9] text-brown bg-opacity-10 border-t border-black border-opacity-40 relative">
        <Link to="/" onClick={handleLogoClick}>
          <img src={logo} alt="oak and stone logo" className="h-12 mx-auto" />
        </Link>
        <p className="my-6 text-xs mb-14">(801) 430-6451</p>
        <p className="py-6 text-xs font-semibold">
          Copyright 2024 Oak and Stone Remodel
        </p>
        {user && user.email ? (
          <button
            onClick={handleLogout}
            className="absolute text-xs text-blue-500 bottom-6 right-5">
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="absolute text-xs text-blue-500 bottom-6 right-5">
            Login
          </Link>
        )}
      </div>
    </>
  );
};
