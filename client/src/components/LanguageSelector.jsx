import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const LanguageSelector = () => {
  const { languages, changeLanguage, t, languageSelected } = useLanguage();
  const navigate = useNavigate();
  
  // Redirect to home page when language is selected
  useEffect(() => {
    if (languageSelected) {
      navigate('/');
    }
  }, [languageSelected, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="w-full max-w-md p-8 mx-auto bg-gradient-to-br from-[#0D0F2B] to-[#1A1C3F] rounded-xl shadow-2xl text-white border border-[#FFB86C]/20 backdrop-blur-lg">
        <h2 className="mb-8 text-3xl font-bold text-center">{t('common.languageSelector')}</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="group flex flex-col items-center justify-center p-6 transition-all duration-300 border border-gray-700 rounded-lg hover:bg-[#2A2D4F] hover:border-[#FFB86C] focus:outline-none focus:ring-2 focus:ring-[#FFB86C] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFB86C]/10 to-[#FF6B6B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="text-2xl mb-2">
                {lang.code === 'en' ? '🇬🇧' : lang.code === 'es' ? '🇪🇸' : '🇫🇷'}
              </span>
              <span className="text-lg font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => changeLanguage(Object.values(languages)[0].code)}
            className="px-6 py-3 bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] text-black font-medium rounded-lg hover:from-[#FF6B6B] hover:to-[#FFB86C] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {t('common.continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;