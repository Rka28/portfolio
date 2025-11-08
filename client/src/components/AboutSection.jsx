import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black 
                        flex items-center justify-center py-20 px-6 overflow-hidden">
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFB86C] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF6B6B] rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-[#FFB86C] text-sm font-semibold tracking-widest uppercase">
            {t('about.subtitle')}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-2 mb-4">
            {t('about.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] mx-auto"></div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 
                        shadow-2xl hover:border-[#FFB86C]/30 transition-all duration-300">
          
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-6">
            {t('about.intro')}
          </p>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
            {t('about.description')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#FFB86C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">
                <span className="font-semibold text-white">{t('about.passion.title')}:</span>{' '}
                {t('about.passion.text')}
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#FF6B6B] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">
                <span className="font-semibold text-white">{t('about.goal.title')}:</span>{' '}
                {t('about.goal.text')}
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#FFB86C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">
                <span className="font-semibold text-white">{t('about.approach.title')}:</span>{' '}
                {t('about.approach.text')}
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#FF6B6B] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">
                <span className="font-semibold text-white">{t('about.values.title')}:</span>{' '}
                {t('about.values.text')}
              </p>
            </div>
          </div>

          <div className="border-l-4 border-[#FFB86C] pl-6 py-2 italic text-gray-400">
            "{t('about.quote')}"
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#FFB86C] mb-1">2+</div>
            <div className="text-sm text-gray-400">{t('about.stats.experience')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#FF6B6B] mb-1">15+</div>
            <div className="text-sm text-gray-400">{t('about.stats.projects')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#FFB86C] mb-1">90%</div>
            <div className="text-sm text-gray-400">{t('about.stats.satisfaction')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#FF6B6B] mb-1">∞</div>
            <div className="text-sm text-gray-400">{t('about.stats.learning')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;