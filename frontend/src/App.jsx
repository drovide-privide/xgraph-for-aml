import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GraphPage from './pages/GraphPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />
        <Route path="/graph" element={<GraphPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
