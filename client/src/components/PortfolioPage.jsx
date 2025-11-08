import React, { useRef, useEffect, useState } from 'react';
import Profile from '../Asset/Profile.png';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import cv from '../Asset/CV Professionnel Informaticien.pdf';

const PortfolioPage = () => {
  const circleRef = useRef(null);
  const overlayRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const { t } = useLanguage();

  const updateOverlayGradient = () => {
    if (circleRef.current && overlayRef.current && !revealed) {
      const rect = circleRef.current.getBoundingClientRect();
      const radius = rect.width / 2;
      const centerX = rect.left + radius;
      const centerY = rect.top + radius;

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

  const handleCircleClick = () => {
    setRevealed(true);
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Image de fond - Responsive */}
      <img 
        src={Profile} 
        alt="Karim BARA" 
        className="absolute inset-0 w-full h-full object-contain object-center z-0
                   sm:object-cover
                   md:ml-[15vw] md:w-[60vw]
                   lg:ml-[20vw] lg:w-[50vw]
                   xl:ml-[25vw] xl:w-[45vw] xl:mt-[-75px]" 
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
        className="absolute top-4 z-20 cursor-pointer flex items-center justify-center
                   w-[150px] h-[150px] left-[calc(50%-75px)]
                   sm:w-[180px] sm:h-[180px] sm:left-[calc(60%-90px)]
                   md:w-[205px] md:h-[205px] md:left-[50vw]
                   lg:left-[52vw]
                   xl:left-[55vw]
                   rounded-full"
      >
        {!revealed && (
          <div className="absolute top-1/2 transform -translate-y-1/2 text-white font-semibold animate-pulse
                          right-32 text-sm
                          sm:right-40 sm:text-base
                          md:right-48 md:text-lg
                          lg:right-56 lg:text-xl
                          xl:right-64">
            {t('portfolioPage.clickToReveal')}
          </div>
        )}
      </div>

      {/* Section Textuelle - Responsive */}
      <div className="relative z-30 flex flex-col justify-center h-full text-white
                      items-center text-center p-6
                      sm:p-8
                      md:items-end md:text-right md:p-10 md:mr-12
                      lg:p-12 lg:mr-32 lg:mt-16
                      xl:mr-64 xl:mt-32">
        <div className="flex flex-col items-center space-y-4
                        md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <h1 className="font-bold tracking-wide uppercase
                         text-2xl mb-8
                         sm:text-3xl sm:mb-12
                         md:text-3xl md:mb-16
                         lg:text-4xl lg:mb-20
                         xl:text-4xl xl:mb-24">
            {t('portfolioPage.portfolio')}
          </h1>
          
          <div className="hidden md:block w-[1px] bg-gradient-to-t from-[#FFB86C]/20 to-[#FF6B6B]/20 transform rotate-12
                          h-24
                          lg:h-32
                          xl:h-36"></div>
          
          <div className="md:mt-16 lg:mt-20 xl:mt-24">
            <p className="font-light
                          text-lg
                          sm:text-xl
                          lg:text-xl">
              Karim Bara
            </p>
            <p className="font-thin
                          text-xs
                          sm:text-sm
                          lg:text-sm">
              {t('portfolioPage.developer')}
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center md:justify-start space-x-3 mt-2">
              <a href="https://www.linkedin.com/in/karim-bara-6a323b276/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-white hover:text-[#FFB86C] transition-colors">
                <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://github.com/Rka28" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-white hover:text-[#FFB86C] transition-colors">
                <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
            
            {/* Download CV Button */}
            <a 
              href={cv} 
              download 
              className="inline-block mt-4 bg-[#FFB86C] text-black font-medium rounded hover:bg-[#FF6B6B] transition-colors
                         px-3 py-1.5 text-xs
                         sm:px-4 sm:py-2 sm:text-sm
                         lg:px-4 lg:py-2 lg:text-sm"
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