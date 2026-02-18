
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateJourneyPlan from './pages/CreateJourneyPlan';
import Customers from './pages/Customers';
import Schedule from './pages/Schedule';
import Review from './pages/Review';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}

export default App;
