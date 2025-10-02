import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Portfolio = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [showLightbox, setShowLightbox] = useState(false);

  const projectDetails = {
    title: 'STUDIO WEB',
    description: 'Une application de commerce électronique moderne et intuitive conçue pour offrir une expérience utilisateur exceptionnelle.',
    client: 'Studio Design Paris',
    date: 'Mars 2025',
    role: 'Développeur Full Stack',
    technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'TailwindCSS'],
    challenges: [
      'Optimisation des performances pour une expérience utilisateur fluide',
      'Intégration de paiements sécurisés multi-devises',
      'Système de gestion des stocks en temps réel',
      'Interface administrateur personnalisable'
    ],
    images: [
      'https://public.readdy.ai/ai/img_res/c7330207c7e71d36d6d43972f9ae603c.jpg',
      'https://public.readdy.ai/ai/img_res/4e048e894b2005d58dfcf0bf66dbdbb2.jpg',
      'https://public.readdy.ai/ai/img_res/2d960f2ff7017e6d0c92d38a23f5beff.jpg',
      'https://public.readdy.ai/ai/img_res/5dd8851a929ba9bca71ba7f63e7b9f95.jpg'
    ]
  };

  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">{projectDetails.title}</h1>
        <Swiper modules={[Pagination, Navigation]} pagination={{ clickable: true }} navigation spaceBetween={20} slidesPerView={1} className="rounded-xl overflow-hidden mb-12">
          {projectDetails.images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="aspect-video cursor-pointer" onClick={() => { setSelectedImage(image); setShowLightbox(true); }}>
                <img src={image} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-[#0D0F2B] rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">À Propos du Projet</h2>
              <p className="text-gray-300 leading-relaxed">{projectDetails.description}</p>
            </section>
            <section className="bg-[#0D0F2B] rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Défis et Solutions</h2>
              <ul className="space-y-4">
                {projectDetails.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <i className="fas fa-check-circle text-[#FFB86C] mt-1 mr-3"></i>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="space-y-8">
            <section className="bg-[#0D0F2B] rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Détails du Projet</h2>
              <p className="text-gray-300">Client: {projectDetails.client}</p>
              <p className="text-gray-300">Date: {projectDetails.date}</p>
              <p className="text-gray-300">Rôle: {projectDetails.role}</p>
            </section>
            <section className="bg-[#0D0F2B] rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Technologies</h2>
              <div className="flex flex-wrap gap-3">
                {projectDetails.technologies.map((tech, index) => (
                  <span key={index} className="px-4 py-2 bg-[#0A0B1E] text-[#FFB86C] rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setShowLightbox(false)}>
          <div className="relative max-w-7xl w-full">
            <img src={selectedImage} alt="Vue agrandie" className="w-full h-auto rounded-lg" />
            <button className="absolute top-4 right-4 text-white hover:text-[#FFB86C] transition-colors" onClick={() => setShowLightbox(false)}>
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
