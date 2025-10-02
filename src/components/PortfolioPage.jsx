import React, { useRef, useEffect, useState } from 'react';
import Profile from '../Asset/Profile.png';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import cv from '../Asset/CV Professionnel Informaticien.pdf';

const PortfolioPage = () => {
  const circleRef = useRef(null);
  const overlayRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const { t } = useLanguage(); // Use the language context

  const updateOverlayGradient = () => {
    if (circleRef.current && overlayRef.current && !revealed) {
      const rect = circleRef.current.getBoundingClientRect();
      const radius = rect.width / 2;
      const centerX = rect.left + radius;
      const centerY = rect.top + radius;

      // Applique un dégradé radial : transparent au centre (dans le cercle), noir à l'extérieur
      overlayRef.current.style.background = `
      radial-gradient(
        circle ${radius}px at ${centerX}px ${centerY}px,
        transparent 0%,
        black 100%
        )
        `;
        }
        };
        
        useEffect(() => {
          updateOverlayGradient();
          window.addEventListener('resize', updateOverlayGradient);
          return () => window.removeEventListener('resize', updateOverlayGradient);
          }, [revealed]);
          
          // Fonction appelée lors du clic sur le cercle pour révéler la page
          const handleCircleClick = () => {
            setRevealed(true);
            };
            
            return (
              <div className="relative h-screen bg-black overflow-hidden">
      {/* Image de fond */}
      <img 
        src={Profile} 
        alt="Karim BARA" 
        className="absolute inset-0 ml-[25vw] w-[45vw] mt-[-75px] h-full object-cover z-0" 
      />


      {/* Superposition noire avec dégradé radial */}
      <div 
        ref={overlayRef}
        className={`absolute inset-0 pointer-events-none z-10 transition-all duration-1000 ${
          revealed ? 'bg-black opacity-0' : ''
        }`}
        style={!revealed ? {
          background: 'radial-gradient(circle 102.5px at 102.5px 102.5px, transparent 0%, black 100%)'
        } : {}}
      ></div>

      {/* Cercle blanc guide visuel */}
      <div
        ref={circleRef}
        onClick={handleCircleClick}
        className="absolute top-4 left-[55vw] w-[205px] h-[205px] rounded-full z-20 cursor-pointer flex items-center justify-center"
      >
        {/* Indication textuelle à côté du cercle */}
        {!revealed && (
          <div className="absolute right-64 top-1/2 transform -translate-y-1/2 text-white text-xl font-semibold animate-pulse">
            {t('portfolioPage.clickToReveal')}
          </div>
        )}
      </div>

      {/* Section Textuelle */}
      <div className="relative z-30 flex flex-col justify-center items-end h-full p-12 text-white mt-32 mr-64">
        <div className="text-right flex items-center space-x-4">
          <h1 className="text-4xl font-bold tracking-wide uppercase mb-24">{t('portfolioPage.portfolio')}</h1>
          <div className="w-[1px] h-36 bg-gradient-to-t from-[#FFB86C]/20 to-[#FF6B6B]/20 transform rotate-12"></div>
          <div className="mt-24">
            <p className="text-xl font-light">Karim Bara</p>
            <p className="text-sm font-thin">{t('portfolioPage.developer')}</p>
            
            {/* Social Media Links */}
            <div className="flex space-x-3 mt-2">
              <a href="https://www.linkedin.com/in/karim-bara-6a323b276/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFB86C] transition-colors">
                <FaLinkedin size={18} />
              </a>
              <a href="https://github.com/Rka28" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFB86C] transition-colors">
                <FaGithub size={18} />
              </a>
              {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFB86C] transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FFB86C] transition-colors">
                <FaInstagram size={18} />
              </a> */}
            </div>
            
            {/* Download CV Button */}
            <a 
              href={cv} 
              download 
              className="inline-block mt-4 px-4 py-2 bg-[#FFB86C] text-black text-sm font-medium rounded hover:bg-[#FF6B6B] transition-colors"
            >
              {t('common.downloadCV')}
            </a>
          </div>
        </div>
      </div>
     

      {/* Animation de révélation en vague */}
      {!revealed && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#000000"
              fillOpacity="12"
              d="M0,224L48,197.3C96,171,192,117,288,112C384,107,480,149,576,176C672,203,768,213,864,202.7C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;