
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateJourneyPlan from './pages/CreateJourneyPlan';
import Customers from './pages/Customers';
import Schedule from './pages/Schedule';
import Review from './pages/Review';
import Login from './pages/Login';
import JourneyPlansList from './pages/JourneyPlansList';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  if (location.pathname === '/login') return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-text">Journey<span className="text-primary">Planer</span></span>
        </div>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Create Plan
          </NavLink>
          <NavLink to="/journey-plans" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            View Plans
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CreateJourneyPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journey-plans"
          element={
            <ProtectedRoute>
              <JourneyPlansList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
