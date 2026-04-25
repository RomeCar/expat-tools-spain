import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import NominaTool from './pages/NominaTool';
import GuideDomestica from './pages/GuideDomestica';
import Modelo149 from './pages/Modelo149';
import BajaMedica from './pages/BajaMedica';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="guides/domestica" element={<GuideDomestica />} />
            <Route path="tools/nomina" element={<NominaTool />} />
            <Route path="tools/modelo149" element={<Modelo149 />} />
            <Route path="guides/baja-medica" element={<BajaMedica />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
