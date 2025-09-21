import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Payments from './pages/Payments';
import CreatePayment from './pages/CreatePayment';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white py-4 shadow-md">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex space-x-4 items-center">
              {isLoggedIn && (
                <>
                  <Link to="/" className="text-gray-700 hover:text-gray-900 px-2">Payments</Link>
                  <Link to="/create-payment" className="text-gray-700 hover:text-gray-900 px-2">Create Payment</Link>
                </>
              )}
            </div>
            <div className="flex space-x-4 items-center">
              {!isLoggedIn && (
                <>
                  <Link to="/register" className="text-gray-700 hover:text-gray-900 px-2">Register</Link>
                  <Link to="/login" className="text-gray-700 hover:text-gray-900 px-2">Login</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/" element={!isLoggedIn ? <Register /> : <Payments />} />
          <Route path="/create-payment" element={isLoggedIn ? <CreatePayment /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
