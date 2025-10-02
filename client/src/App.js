import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import StudioWeb from './Pages/StudioWeb';
import Portfolio from './Pages/Portfolio';
import Galerie from './Pages/Galerie';
import Cube from './Pages/Cube';
import Contact from './Pages/Contact';
import { LanguageProvider } from './context/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import './cursor.css'; // Will create this file later for custom cursor

const App = () => {
  // Check if language has been selected
  const [showLanguageSelector, setShowLanguageSelector] = React.useState(() => {
    return localStorage.getItem('languageSelected') !== 'true';
  });

  // Listen for changes to languageSelected in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const isLanguageSelected = localStorage.getItem('languageSelected') === 'true';
      setShowLanguageSelector(!isLanguageSelected);
    };
    
    // Create a custom event listener for language selection
    window.addEventListener('languageSelected', handleStorageChange);
    
    return () => {
      window.removeEventListener('languageSelected', handleStorageChange);
    };
  }, []);

  // Custom cursor implementation
  useEffect(() => {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    cursorDot.classList.add('cursor-dot');
    cursorOutline.classList.add('cursor-dot-outline');
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    const moveCursor = (e) => {
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) rotate(45deg)`;
      cursorOutline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    
    document.addEventListener('mousemove', moveCursor);
    
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      if (cursorDot.parentNode) document.body.removeChild(cursorDot);
      if (cursorOutline.parentNode) document.body.removeChild(cursorOutline);
    };
  }, []);

  return (
    <LanguageProvider>
      <Router>
        {showLanguageSelector ? (
          <LanguageSelector />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pages/studio-web" element={<StudioWeb />} />
            <Route path="/pages/portfolio" element={<Portfolio />} />
            <Route path="/pages/galerie" element={<Galerie />} />
            <Route path="/pages/cube" element={<Cube />} />
            <Route path="/pages/contact" element={<Contact />} />
          </Routes>
        )}
      </Router>
    </LanguageProvider>
  );
};

export default App;