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

// Admin Pages
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageDresses from './pages/admin/ManageDresses';
import ManageCategories from './pages/admin/ManageCategories';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';

// Vendor Pages
import VendorLayout from './components/VendorLayout';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorServices from './pages/vendor/VendorServices';
import VendorBookings from './pages/vendor/VendorBookings';

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

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dresses" element={<ManageDresses />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* Vendor Routes */}
          <Route path="/vendor" element={<VendorLayout />}>
            <Route index element={<VendorDashboard />} />
            <Route path="services" element={<VendorServices />} />
            <Route path="bookings" element={<VendorBookings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
