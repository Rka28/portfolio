import React, { useState } from 'react';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { getApiUrl } from '../utils/api';

const Newsletter = () => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({
        submitted: true,
        success: false,
        message: "Veuillez entrer une adresse e-mail valide."
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${getApiUrl()}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          submitted: true,
          success: true,
          message: "🎉 Vous êtes maintenant abonné à la newsletter !"
        });
        setEmail('');
      } else {
        throw new Error(data.message || "Échec de l'abonnement à la newsletter.");
      }
    } catch (error) {
      console.error("Erreur lors de l'abonnement à la newsletter :", error);
      setStatus({
        submitted: true,
        success: false,
        message: "Une erreur est survenue lors de votre inscription à la newsletter."
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
              Abonnez-vous à notre newsletter
            </h2>
          </div>

          <p className="text-center text-gray-300 mb-8">
            Recevez nos dernières actualités, projets et conseils directement dans votre boîte mail.
          </p>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="Entrez votre adresse e-mail"
                className="w-full px-6 py-4 bg-[#0A0B1E] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB86C] text-white pr-36"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] text-black font-medium rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <FaPaperPlane className="mr-2" />
                )}
                S'abonner
              </button>
            </div>

            {status.submitted && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  status.success
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-red-900/30 text-red-300'
                } text-center`}
              >
                {status.message}
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Nous respectons votre vie privée. Vous pouvez vous désabonner à tout moment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;