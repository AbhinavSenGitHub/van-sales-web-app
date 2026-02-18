
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateJourneyPlan from './pages/CreateJourneyPlan';
import Customers from './pages/Customers';
import Schedule from './pages/Schedule';
import Review from './pages/Review';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateJourneyPlan />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </Router>
  );
}

export default App;
