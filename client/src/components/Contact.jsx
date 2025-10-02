import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';

export const Contact = () => {
  const { t } = useLanguage();
  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState({ submitted: false, success: false, message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status.submitted) {
      const timer = setTimeout(() => setStatus(prev => ({ ...prev, submitted: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [status.submitted]);

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!formData.name.trim()) {
      errors.name = t('common.contact.errors.nameRequired');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = t('common.contact.errors.emailRequired');
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = t('common.contact.errors.emailInvalid');
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = t('common.contact.errors.messageRequired');
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = t('common.contact.errors.messageTooShort');
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const recaptchaToken = recaptchaRef.current.getValue();
    if (!recaptchaToken) {
      setStatus({ submitted: true, success: false, message: t('common.contact.recaptchaRequired') });
      return;
    }

    setLoading(true);

    try {
      // Store contact form submission in database
      const contactResponse = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });
      
      const contactData = await contactResponse.json();
      if (!contactData.success) {
        throw new Error(contactData.message || 'Failed to submit contact form');
      }
      
      // Send email notification
      const templateParams = {
        from_name: formData.name,
        reply_to: formData.email,
        message: formData.message
      };

      await emailjs.send(
        'service_m37mfc2', // Remplace par ton Service ID
        'template_t8iijqo', // Remplace par ton Template ID
        templateParams,
        'P6c9HoyBa9UVDkaTO' // Remplace par ton User ID
      );

      setStatus({ submitted: true, success: true, message: t('common.contact.success') });
      setFormData({ name: '', email: '', message: '' });
      recaptchaRef.current.reset();
    } catch (error) {
      console.error('Failed to process contact form:', error);
      setStatus({ submitted: true, success: false, message: t('common.contact.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] bg-clip-text text-transparent">
          {t('common.contact.title')}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-[#0D0F2B]/90 to-[#1A1C3F]/90 p-6 md:p-8 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">{t('common.contact.name')} *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#0A0B1E] border ${formErrors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg`}
                />
                {formErrors.name && <p className="text-red-400 text-sm">{formErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">{t('common.contact.email')} *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#0A0B1E] border ${formErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg`}
                />
                {formErrors.email && <p className="text-red-400 text-sm">{formErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">{t('common.contact.message')} *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-3 bg-[#0A0B1E] border ${formErrors.message ? 'border-red-500' : 'border-gray-700'} rounded-lg resize-none`}
                ></textarea>
                {formErrors.message && <p className="text-red-400 text-sm">{formErrors.message}</p>}
              </div>

              <ReCAPTCHA ref={recaptchaRef} sitekey="6LdfIMEqAAAAAM9n3D9Q_izB3_-s7k6W4UBW-C3Y" />

              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] text-black font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
                {loading ? '...' : t('common.contact.send')}
              </button>

              {status.submitted && (
                <div className={`mt-4 p-3 rounded-lg ${status.success ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;