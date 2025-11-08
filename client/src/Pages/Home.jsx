// src/pages/HomePage.js
import React from 'react';
// Importez vos composants
import PortfolioPage from '../components/PortfolioPage';
import ProjectCard from '../components/ProjectCard';
import ScrollAnimation from '../components/ScrollAnimation ';
import Skill from '../components/Skill';
import About from '../components/AboutSection';
import Contact from '../components/Contact';


import Newsletter from '../components/emailService';
const HomePage = () => {
  return (
    <main className="min-h-screen w-full bg-black">
      {/* 
        Exemple : On affiche votre PortfolioPage, puis ScrollAnimation, 
        puis HorizontalScroll. L'ordre est à adapter selon vos besoins 
      */}
      <PortfolioPage />
      <About />
      <ScrollAnimation />
      <ProjectCard />
      <Skill />
      <Newsletter />
      <Contact />
    </main>
  );
};

export default HomePage;
