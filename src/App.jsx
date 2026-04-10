import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import NominaTool from './pages/NominaTool';
import GuideDomestica from './pages/GuideDomestica';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="guides/domestica" element={<GuideDomestica />} />
            <Route path="tools/nomina" element={<NominaTool />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
