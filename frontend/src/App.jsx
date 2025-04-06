import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '@/app/login/page';
import PastMatches from '@/pages/PastMatches';
import Index from '@/pages/index';
import MatchPage from '@/pages/MatchPage';


function App() {
  return (
    <Router>

      <Routes>
        <Route path="/match/:id" element={<MatchPage />} />
        <Route path="/past" element={<PastMatches />} />
        <Route path="/" element={<Index/>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
