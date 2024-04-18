import "./Portfolio.scss";

import emailjs from '@emailjs/browser';
import React, { useRef } from 'react';

export default function ContactUs() {

	const form = useRef();

	function SendEmail(e) {
		e.preventDefault();

		emailjs
			.sendForm('service_nf8hrp9', 'template_q463d8v', form.current, {
				publicKey: 'rjTFfdezPa38IQRtl',
			})
			.then(
				() => {
					console.log('SUCCESS!');
					console.log("message sent");
				},
				(error) => {
					console.log('FAILED...', error.text);
				},
			);
	}

	return (
		
		<form ref={form} onSubmit={(e) => SendEmail(e)}>
			<label></label>
			<input className="Entreprise" type="text" name="user_name" placeholder="Nom"/>
			<label></label>
			<input className="Entreprise" type="email" name="user_email"  placeholder="email" />
			<label></label>
			<textarea className="commentaire" name="message" placeholder="comantaire"/><input className="btn-com" type="submit" value="Send" />
			
		</form>
	);
};
