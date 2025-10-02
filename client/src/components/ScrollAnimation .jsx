// src/components/ScrollAnimation.js
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimation = () => {
  const containerRef = useRef(null);
  const { t } = useLanguage(); // Use the language context

  useEffect(() => {
    const container = containerRef.current;
    console.clear();

    // Récupère tous les éléments à animer (chaque mot/phrase)
    const lines = container.querySelectorAll('.line');

    // Crée la timeline liée à ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',    // Démarre quand le conteneur touche le haut de la fenêtre
        end: '+=3000',       // L'animation s'étale sur 3000px de défilement
        pin: true,           // Épingle la section pendant l'animation
        scrub: 1,             // L'animation suit le défilement
      markers: true,
      markers: {startColor: "black", endColor: "black", fontSize: "0px", }

        }
    });

    // Pour chaque ligne, on va la faire apparaître puis disparaître.
    // Sauf la dernière si on veut la laisser affichée, on l'ajustera.
    lines.forEach((line, i) => {
      // Apparition
      tl.fromTo(line,
        { opacity: 0 },     // Départ
        { opacity: 1, duration: 1 } // Arrivée (fade in)
      );

      // Petit délai (le mot reste visible quelque temps)
      tl.to({}, { duration: 0.5 }); // Pause sans animer d'élément

      // Disparition (sauf pour la dernière si on veut la garder)
      if (i < lines.length - 1) {
        tl.to(line, { opacity: 0, duration: 1 }); // fade out
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        position: 'relative',  // Le conteneur est en "relative"
        overflow: 'hidden'
      }}
    >
      {/* 
        On place chaque mot (ou phrase) dans un span/div <h2> 
        avec la même classe "line". 
        position: absolute pour qu'ils soient tous au même endroit.
      */}
      <div style={{ 
        width: '100%',
        height: '100%',
        position: 'absolute', 
        top: 0, 
        left: 0, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 className="line" style={styles.text}>{t('scrollAnimation.welcome')}</h2>
        <h2 className="line" style={styles.text}>{t('scrollAnimation.interfaceCreator')}</h2>
        <h2 className="line" style={styles.text}>{t('scrollAnimation.userExperience')}</h2>
        <h2 className="line" style={styles.text}>{t('scrollAnimation.buildTogether')}</h2>
       
      </div>
    </div>
  );
};

// Style de base pour les textes
const styles = {
  text: {
    position: 'absolute', 
    // Centrage : la même position pour tous
    // (on se repose sur l'alignItems/justifyContent du parent)
    textAlign: 'center',
    color: '#fff',
    fontSize: '8rem',
    // Empêche chaque <h2> de se superposer *visuellement*
// tant qu'il est transparent ou invisible
  }
};

export default ScrollAnimation;