import "./Home.scss";
import { Link } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import profile from '../asset/profil.png';
import pro from '../asset/pro.jpg';
import cinema from '../asset/cinema.png';
import { gsap } from "gsap";

import { useEffect, useRef } from "react";
import Anim from "../Contact/Contact.js";

import { IoPin } from "react-icons/io5";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3Alt } from "react-icons/fa";
import { FaPhp } from "react-icons/fa6";
import { IoLogoJavascript } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import { FaSass } from "react-icons/fa";
import { FaBootstrap } from "react-icons/fa";
import { SiTailwindcss } from "react-icons/si";
import { TbBrandThreejs } from "react-icons/tb";
import { SiMysql } from "react-icons/si";
import { GrDocker } from "react-icons/gr";
import { TbApi } from "react-icons/tb";
import { FaVuejs } from "react-icons/fa6";
import { FaWordpress } from "react-icons/fa6";
import { FaFigma } from "react-icons/fa";
import { SiWix } from "react-icons/si";
import { CiShare1 } from "react-icons/ci";

import ContactUs from "../Portofilo/Portfolio.js";


function Home() {

	const onLoad = () => {
		gsap.timeline().fromTo("#logo",
			{
				x: -100,
				opacity: 0,

			}, {
			x: 0,
			opacity: 1,
			stragger: 0.33,
			delay: 0.7
		}
		)
	}


	useEffect(() => {
		onLoad();
	}, [])

	return (
		<body>
			<Anim />

			<div className="content">
				<div id="logo" className="logo-name">
					<h3>K</h3>
					<h3>a</h3>
					<h3>r</h3>
					<h3>i</h3>
					<h3>m</h3>
					<h3>.</h3>
					<h3>d</h3>
					<h3>e</h3>
					<h3>v</h3>



				</div>

				<div className="navbar">
					<button className=" btn-6"><span><a href="#">Home</a></span></button>
					<button className=" btn-6"><span><a href="#Portfolio">Portfolio</a></span></button>
					<button className=" btn-6"><span><a href="#Contact">Contact</a></span></button>
					<button className=" btn-6"><span><a href="#About">About</a></span></button>


				</div>

			</div>

			<div className=" container ">
				<div className="fluid-contenair">

					<h4>Developpeur Full stack</h4>
					<p id="fluid-contenair-p">  Bonjour, je m'appelle Karim et je suis passionné par le développement informatique. Je réside à Vitry-sur-Seine, en France. <IoPin color="red" size={20} className='pin' /></p>

					<div className="link">

						<a className="link-social" href="https://github.com/Rka28" >< FaGithub size={40} className='ico' />
						</a>
						<button className=" cv"><a href="../asset/CV_BARA Karim_EPITECH.pdf" download="CV_BARA Karim_EPITECH.pdf">CV</a></button>
						<a className="link-social" href="https://www.linkedin.com/in/karim-bara-6a323b276/">	<FaLinkedinIn size={40} className='ico' /></a>
					</div>
				</div>

				<img className="logo-profil" src={profile} alt="Logo" width='20%' />

			</div>
			<section className="sec2">


				<div className="items-stack">
					<h5 className="stack">Tech Stack |</h5>

					<button id="ic" className="btn-stack1"><FaHtml5 size={40} /></button>
					<button id="ic" className="btn-stack2"><FaCss3Alt size={40} /></button>
					<button id="ic" className="btn-stack3"><FaPhp size={40} /></button>
					<button id="ic" className="btn-stack4"><IoLogoJavascript size={40} /></button>
					<button id="ic" className="btn-stack5"><FaReact size={40} /></button>
					<button id="ic" className="btn-stack6"><FaSass size={40} /></button>
					<button id="ic" className="btn-stack7"><FaBootstrap size={40} /></button>
					<button id="ic" className="btn-stack8"><SiTailwindcss size={40} /></button>
					<button id="ic" className="btn-stack9"><TbBrandThreejs size={40} /></button>
					<button id="ic" className="btn-stack10"><SiMysql size={40} /></button>
					<button id="ic" className="btn-stack11"><GrDocker size={40} /></button>
					<button id="ic" className="btn-stack12"><TbApi size={40} /></button>
					<button id="ic" className="btn-stack13"><FaVuejs size={40} /></button>
					<button id="ic" className="btn-stack14"><FaWordpress size={40} /></button>
					<button id="ic" className="btn-stack15"><FaFigma size={40} /></button>
					<button height='40px' className="btn-stack16"><SiWix size={40} height={40} /></button>



				</div>
			</section>

			<div className="about">

				<img className="about-logo" src={pro} alt="Logo" width='100%' />


				<div>
					<h6> About me</h6>

					<h5>Développeur Web Full-Stack chevronné disposant d'une vaste palette de compétences technologiques et linguistiques.</h5>
					<p>Je suis un développeur web passionné par la création de solutions numériques innovantes et engageantes. Avec une solide expérience dans le développement full-stack, j'ai acquis des compétences pointues en HTML, CSS, JavaScript, Python, Ruby, PHP et Java.

						Mais ce n'est pas tout : je suis également fier de mon expertise linguistique, ayant ajouté plusieurs langages à mon arc au fil des ans. En plus de l'anglais (ma langue maternelle), je parle couramment français, allemand et espagnol, et j'ai des notions de base en russe, japonais et chinois. Cette capacité à communiquer efficacement avec des équipes multiculturelles est inestimable lorsqu'il s'agit de travailler sur des projets internationaux complexes.
						<br></br>
						Mon approche centrée sur l'utilisateur signifie que je travaille toujours en étroite collaboration avec les parties prenantes pour comprendre leurs besoins et créer des sites Web intuitifs et réactifs </p>
				</div>


			</div>
			<section id="Portfolio" className="projet">

				<h6> Portfolio</h6>

			</section>
			<h5 className="projet">Projet scolaire</h5>


			<div id="portfolio" className="portfolio">
				<img className="portfolio-logo" src={cinema} alt="portfolio-logo"></img>
				<div className="text-pro">

					<h6>Spotify</h6>
					<p>Site de cinema ou le clien peut cherche des film et voir les diffrent enseigne cinematografique ,il ya aussi un cote admin pour voir les recherche des cleient pour modifier leur statue</p>
					<h7>PHP</h7><h7>Mysql</h7><h7>CSS</h7>
					<div className="code">

						<a href="https://github.com/EpitechWebAcademiePromo2025/W-WEB-090-PAR-1-1-spotify-syphax.haddou"><h4> <FaGithub size={40} /></h4></a>
						<h4> <CiShare1 size={40} />Live Demo</h4>
					</div>
				</div>
			</div>

			<div className="portfolio2">
				<img className="portfolio2-logo" src={cinema} alt="portfolio2-logo"></img>
				<div className="text-pro">

					<h6>Cinema Eternel</h6>
					<p>Site de cinema ou le clien peut cherche des film et voir les diffrent enseigne cinematografique ,il ya aussi un cote admin pour voir les recherche des cleient pour modifier leur statue</p>
					<h7>PHP</h7><h7>Mysql</h7><h7>CSS</h7>
					<div className="code">

						<h4> <FaGithub size={40} />Code</h4>
						<h4> <CiShare1 size={40} />Live Demo</h4>
					</div>
				</div>
			</div>
			<div id="portfolio" className="portfolio">
				<img className="portfolio-logo" src={cinema} alt="portfolio-logo"></img>
				<div className="text-pro">

					<h6>Meetics</h6>
					<p>Site de cinema ou le clien peut cherche des film et voir les diffrent enseigne cinematografique ,il ya aussi un cote admin pour voir les recherche des cleient pour modifier leur statue</p>
					<h7>PHP</h7><h7>Mysql</h7><h7>CSS</h7>
					<div className="code">

						<h4> <FaGithub size={40} />Code</h4>
						<h4> <CiShare1 size={40} />Live Demo</h4>
					</div>
				</div>
			</div>


			<div className="perso">

				<h5>Projet Perso</h5>

			</div>
			<div className="portfolio2">
				<img className="portfolio2-logo" src={cinema} alt="portfolio2-logo"></img>
				<div className="text-pro">

					<h6>League of Legend</h6>
					<p>Site de cinema ou le clien peut cherche des film et voir les diffrent enseigne cinematografique ,il ya aussi un cote admin pour voir les recherche des cleient pour modifier leur statue</p>
					<h7>PHP</h7><h7>Mysql</h7><h7>CSS</h7>
					<div className="code">

						<h4> <FaGithub size={40} />Code</h4>
						<h4> <CiShare1 size={40} />Live Demo</h4>
					</div>
				</div>
			</div>
			<div className="portfolio">
				<img className="portfolio-logo" src={cinema} alt="portfolio-logo"></img>
				<div className="text-pro">

					<h6>4M</h6>
					<p>Site de cinema ou le clien peut cherche des film et voir les diffrent enseigne cinematografique ,il ya aussi un cote admin pour voir les recherche des cleient pour modifier leur statue</p>
					<h7>PHP</h7><h7>Mysql</h7><h7>CSS</h7>
					<div className="code">

						<h4> <FaGithub size={40} />Code</h4>
						<h4> <CiShare1 size={40} />Live Demo</h4>
					</div>
				</div>
			</div>
			<div className="portfolio2">
				<img className="portfolio2-logo" src={cinema} alt="portfolio2-logo"></img>
				<div className="text-pro">

					<h6>Crypto</h6>
					<p>Site de cinema ou le clien peut cherche des film et voir les diffrent enseigne cinematografique ,il ya aussi un cote admin pour voir les recherche des cleient pour modifier leur statue</p>
					<h7>PHP</h7><h7>Mysql</h7><h7>CSS</h7>
					<div className="code">

						<h4> <FaGithub size={40} />Code</h4>
						<h4> <CiShare1 size={40} />Live Demo</h4>
					</div>
				</div>
			</div>

			<div className="projet">
				<section id="Contact">

					<h6> Contact</h6>
				</section>


			</div>

			<div className="com">
				<h6 className="projet" id="contact">Contactez moi!</h6>
				<ContactUs />
			</div>






			<footer id="about" className="foot">
				<div>
					<h6> About me</h6>
					<p id="textabout">Je suis un développeur web passionné par la création de solutions numériques innovantes et engageantes. Avec une solide expérience dans le développement full-stack, j'ai acquis des compétences pointues en HTML, CSS, JavaScript, Python, Ruby, PHP et Java.

						Mais ce n'est pas tout : je suis également fier de mon expertise linguistique, ayant ajouté plusieurs langages à mon arc au fil des ans. En plus de l'anglais (ma langue maternelle), je parle couramment français, allemand et espagnol, et j'ai des notions de base en russe, japonais et chinois. Cette capacité à communiquer efficacement avec des équipes </p>
				</div>
				<section id="About">

				</section>
				<div className="projets">

					<h4>Projet</h4>
					<div id="projet">
						<p>Cinema</p>
						<p>Cinema</p>
						<p>Cinema</p>
						<p>Cinema</p>
						<p>Cinema</p>

					</div>
				</div>
				<div className="quick">
					<h4>QUICK LINKS</h4>
					<a href="#"><p id="quick">Cinema</p> </a>
					<a href="#Portfolio"><p id="quick">Portfolio</p> </a>
					<a href="#Contact"><p id="quick">Contact</p> </a>
					<a href="#About"><p id="quick">About</p> </a>



				</div>

			</footer>
			<div className="copy">

				<p id="copy">© 2024 Karim.dev</p>
			</div>

			{/* 		
				 <section>

				<h2>Clique MOI</h2>

				<div className="ligth"></div>
			</section>
			<script type="text/script.js">
				<script src="/Home/script.js"></script>
			</script>  */}


		</body >
	);



}
<Link style={{ cursor: 'pointer' }} to={`/Home`}></Link>

export default Home;
