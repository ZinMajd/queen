import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DressList from './pages/DressList';
import DressDetails from './pages/DressDetails';
import Services from './pages/Services';
import Vendors from './pages/Vendors';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white" dir="rtl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dresses" element={<DressList />} />
          <Route path="/dresses/:categoryId" element={<DressList />} />
          <Route path="/dress/:id" element={<DressDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
