import React, { useState } from 'react';
import VC from '../Asset/4M.png'
import LOL from '../Asset/LOL.png'
import LSLs from '../Asset/LSL.png'
import Snap from '../Asset/Snap.png'
import LSL from '../Asset/lsl.png'
import CommentModal from './CommentModal';
const ProjectCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = [
    {
      icon: VC,
      title: '4M',
      number: '01',
      description: 'Application de Locations de Véhicule',
      link: 'https://4-wm.netlify.app/',
      size: 'lg:col-span-2 h-[600px]'
    },
    {
      icon: LOL,
      title: 'League of Legand',
      number: '02',
      description: 'Appel d\'api',
      link: 'https://karim-lol.netlify.app/',
      size: 'h-[400px]'
    },
    {
      icon: Snap,
      title: 'SNAPCHAT',
      number: '03',
      description: 'Application snachat',
      size: 'h-[500px]'
    },
    {
      icon: LSL,
      title: 'LE STUDIO LED',
      number: '04',
      description: 'Création d\'un site en Wordpress',
      size: 'lg:col-span-2 h-[550px]'
    },
    {
      icon: LSL,
      title: 'SITE LE STUDIO LED',
      number: '05',
      description: 'Création d’un site internet pour l’entreprise où j’ai effectué mon alternance.',
      link: 'https://lestudioled.com/',
      size: 'h-[450px]'
    },
    {
      icon: 'https://public.readdy.ai/ai/img_res/3d47eadde1b445c7d69914098fc4d352.jpg',
      title: 'DATA VISUALIZER',
      number: '06',
      description: 'Analyse et visualisation de données',
      link: 'https://data-visualizer.com',
      size: 'h-[500px]'
    }
  ];

  const openCommentModal = (e, project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };



  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-64">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`relative group transition-all duration-500 bg-gradient-to-br from-[#0D0F2B]/90 to-[#1A1C3F]/90 backdrop-blur-lg rounded-2xl p-8 transition-all duration-500 shadow-2xl hover:scale-[1.02] cursor-pointer shadow-[#ffffff]/10 ${project.size}`}
            onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB86C]/20 to-[#FF6B6B]/20 rounded-2xl blur-xl" />
            </div>

            <div className="relative h-full flex flex-col">
              <div className="mb-6 overflow-hidden rounded-xl transition-all duration-500 h-[50%]">
                <img
                  src={project.icon}
                  alt={project.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 space-y-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] bg-clip-text text-transparent">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between border-t border-[#FFFFFF]/20 pt-4">
                  <span className="font-mono text-xl text-[#FFB86C]">
                    {project.number}
                  </span>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={(e) => openCommentModal(e, project)}
                      className="flex items-center space-x-2 bg-[#1A1C3F] px-3 py-1 rounded-lg hover:bg-[#2A2C4F] transition-colors"
                    >
                      <span className="text-white">Commentaires</span>
                      <i className="fas fa-comment text-[#FFB86C]" />
                    </button>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                      <span className="text-white">Visiter le site</span>
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-[#FFB86C] rounded-full transform transition-all duration-300 group-hover:scale-125" />
                        <i className="fas fa-arrow-right text-[#FFB86C] transform transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <CommentModal 
          isOpen={isModalOpen} 
          onClose={closeCommentModal} 
          projectId={selectedProject.number} 
          projectTitle={selectedProject.title} 
        />
      )}
    </>
  );
};

export default ProjectCard;
