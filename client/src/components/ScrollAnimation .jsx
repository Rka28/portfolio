// src/components/ScrollAnimation.js
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const containerRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const container = containerRef.current;
    const lines = container.querySelectorAll('.line');

    // Fonction pour créer l'animation
    const createAnimation = () => {
      // Nettoyer les anciennes animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=3000',
          pin: true,
          scrub: 1,
          markers: false, // Désactiver en production
          invalidateOnRefresh: true, // ✅ Recalculer au resize
        }
      });

      lines.forEach((line, i) => {
        tl.fromTo(line,
          { opacity: 0 },
          { opacity: 1, duration: 1 }
        );
        
        tl.to({}, { duration: 0.5 });
        
        if (i < lines.length - 1) {
          tl.to(line, { opacity: 0, duration: 1 });
        }
      });
    };

    // Créer l'animation initiale
    createAnimation();

    // ✅ Recréer au resize avec debounce
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [t]); // ✅ Ajouter t comme dépendance

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={styles.wrapper}>
        <h2 className="line" style={styles.text}>
          {t('scrollAnimation.welcome')}
        </h2>
        <h2 className="line" style={styles.text}>
          {t('scrollAnimation.interfaceCreator')}
        </h2>
        <h2 className="line" style={styles.text}>
          {t('scrollAnimation.userExperience')}
        </h2>
        <h2 className="line" style={styles.text}>
          {t('scrollAnimation.buildTogether')}
        </h2>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 1rem', // ✅ Padding pour mobile
  },
  text: {
    position: 'absolute',
    textAlign: 'center',
    color: '#fff',
    // ✅ Taille responsive avec clamp
    fontSize: 'clamp(2rem, 8vw, 8rem)',
    fontWeight: 'bold',
    margin: 0,
    maxWidth: '90%', // ✅ Éviter le débordement
    lineHeight: 1.2,
  }
};

export default ScrollAnimation;