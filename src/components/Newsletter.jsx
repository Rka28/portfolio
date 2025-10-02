import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
// Using server API with Nodemailer instead of EmailJS

const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({
        submitted: true,
        success: false,
        message: 'Please enter a valid email address.'
      });
      setLoading(false);
      return;
    }
    
    try {
      // Send subscription request to server API instead of using EmailJS
      const response = await fetch('http://localhost:8000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      // Check response
      if (data.success) {
        setStatus({
          submitted: true,
          success: true,
          message: t('common.newsletter.success')
        });
        setEmail('');
      } else {
        throw new Error(data.message || 'Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus({
        submitted: true,
        success: false,
        message: 'There was an error subscribing to the newsletter.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-black to-[#0A0B1E] text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#0D0F2B]/90 to-[#1A1C3F]/90 rounded-2xl p-8 shadow-2xl border border-[#FFB86C]/20 backdrop-blur-lg">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] p-3 rounded-full mr-4">
              <FaEnvelope className="text-black text-2xl" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] bg-clip-text text-transparent">
              {t('common.newsletter.title')}
            </h2>
          </div>
          
          <p className="text-center text-gray-300 mb-8">
            {t('common.newsletter.info')}
          </p>
          
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={handleChange}
                placeholder={t('common.newsletter.placeholder')}
                className="w-full px-6 py-4 bg-[#0A0B1E] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB86C] text-white pr-36"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] text-black font-medium rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaPaperPlane className="mr-2" />
                )}
                {t('common.newsletter.subscribe')}
              </button>
            </div>
            
            {status.submitted && (
              <div className={`mt-4 p-3 rounded-lg ${status.success ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'} text-center`}>
                {status.message}
              </div>
            )}
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
