import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would make a POST request to your backend here.
    // For now, we'll just simulate a successful login.
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    navigate('/'); // Redirect to the dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <label className="block text-sm font-medium text-gray-700">
          Email
          <br />
          <input type="email" name="email" defaultValue="admin@example.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required autocomplete="email"/>
        </label>
        <br />
        <label className="block text-sm font-medium text-gray-700">
          Password
          <input type="password" name="password" defaultValue="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required autocomplete="current-password"/>
        </label>
        <br />
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
      </form>
    </div>
  );
};

export default Login;