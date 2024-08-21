import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { userAtom } from '../atoms/userAtom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      setUser(user);

      Swal.fire({
        title: 'Success!',
        text: 'Logged in successfully!',
        icon: 'success'
      });

      navigate('/');
      scrollToTop();
    } catch (err) {
      setError(err.message);
      console.error('Login failed', err);
    }
  };

  return (
    <div className="flex items-center justify-center py-32 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 text-white transition duration-200 bg-blue-500 rounded-lg hover:bg-blue-600">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
