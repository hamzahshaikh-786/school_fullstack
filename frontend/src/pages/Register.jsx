import React from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Registration logic here (API call etc.)
        // After registration, redirect to login
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <label className="block text-sm font-medium text-gray-700">
                    Email
                    <input type="email" name="email" defaultValue="admin@example.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required autocomplete="email"/>
                </label>
                <br />
                <label className="block text-sm font-medium text-gray-700">
                    Password
                    <input type="password" name="password" defaultValue="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required autocomplete="new-password"/>
                </label>
                <br />
                <label className="block text-sm font-medium text-gray-700">
                    Role
                    <select name="role" defaultValue="admin" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                        <option value="admin">Admin</option>
                        <option value="school">School</option>
                    </select>
                    <br />
                </label>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
            </form>
        </div>
    );
}

export default Register;