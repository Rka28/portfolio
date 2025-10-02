import React, { useEffect, useState } from 'react';
import { FaAndroid, FaDesktop, FaGlobe, FaCloud, FaReact, FaNode, FaServer, FaDatabase, FaDocker, FaCube, FaAws, FaLaravel, FaPython, FaPhp, FaCode, FaJs } from 'react-icons/fa';
import { SiMongodb } from 'react-icons/si';

const Skill = () => {
  const [isVisible, setIsVisible] = useState(false);


  const stacks = [
    { name: 'React', icon: <FaReact className="text-4xl text-blue-400 animate-spin" /> },
    { name: 'Node.js', icon: <FaNode className="text-4xl text-green-500 animate-pulse" /> },
    { name: 'Express.js', icon: <FaJs className="text-4xl text-yellow-500 animate-wiggle" /> },
    { name: 'MongoDB', icon: <SiMongodb className="text-4xl text-green-600 animate-bounce" /> },
    { name: 'MySQL', icon: <FaDatabase className="text-4xl text-blue-500 animate-pulse" /> },
    { name: 'Docker', icon: <FaDocker className="text-4xl text-blue-400 " /> },
    { name: 'Kubernetes', icon: <FaCube className="text-4xl text-blue-500 animate-wiggle" /> },
    { name: 'AWS', icon: <FaAws className="text-4xl text-yellow-500 animate-bounce" /> },
    { name: 'Symfony', icon: <FaCode className="text-4xl text-gray-600 animate-pulse" /> },
    { name: 'Laravel', icon: <FaLaravel className="text-4xl text-red-500 animate-bounce" /> },
    { name: 'Python', icon: <FaPython className="text-4xl text-blue-400 animate-spin" /> },
    { name: 'PHP', icon: <FaPhp className="text-4xl text-indigo-500 animate-wiggle" /> }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Main  stacks={stacks} />
    </div>
  );
};

const Header = () => (
		<header className="py-20 text-center text-white">
		  <h1 className="text-5xl font-bold bg-white bg-clip-text text-transparent">My Skills</h1>
		</header>
	  );



const Main = ({  stacks }) => (
  <main className="max-w-7xl mx-auto px-4 py-16">
    <section className="mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       
      </div>
    </section>
    <section className="mb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stacks.map((stack, index) => (
          <div key={index} className="bg-gradient-to-br from-[#0D0F2B]/90 to-[#1A1C3F]/90  p-6 rounded-lg shadow-md flex flex-col items-center">
            {stack.icon}
            <h3 className="text-xl font-semibold mt-4 bg-white bg-clip-text text-transparent">{stack.name}</h3>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default Skill;
