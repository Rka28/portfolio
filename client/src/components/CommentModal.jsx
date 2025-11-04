import React, { useState, useEffect } from 'react';

const CommentModal = ({ isOpen, onClose, projectId, projectTitle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const commentRegex = /\S+/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;



  const [showReplies, setShowReplies] = useState({});
  const [replies, setReplies] = useState({});

  useEffect(() => {
    if (isOpen && projectId) {
      fetchComments();
    }
  }, [isOpen, projectId]);

  // Check if user is already logged in from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const fetchComments = async () => {
    try {
      setError('');
      const response = await fetch(`http://localhost:8000/api/comments/${projectId}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Le serveur a renvoyé une réponse non-JSON. Il se peut que le serveur API ne soit pas en cours d’exécution.');
      }
      
      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
      } else {
        setError(data.message || 'Failed to load comments');
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('non-JSON response')) {
        setError('Impossible de se connecter au serveur de commentaires. Veuillez vous assurer que le serveur est en cours d’exécution, puis réessayez.');
      } else {
        setError('Error loading comments: ' + error.message);
      }
      setComments([]);
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      setError('');
      const response = await fetch(`http://localhost:8000/api/comments/replies/${commentId}`);
      
      if (!response.ok) {
        throw new Error(`Le serveur a répondu avec le statut : ${response.status}`);
      }
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. The API server may not be running.');
      }
      
      const data = await response.json();
      if (data.success) {
        setReplies(prev => ({
          ...prev,
          [commentId]: data.replies
        }));
      } else {
        setError(data.message || 'Failed to load replies');
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('non-JSON response')) {
        setError('Impossible de se connecter au serveur de commentaires. Veuillez vous assurer que le serveur est en cours d’exécution et réessayez.');
      } else {
        setError('Error loading replies: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          name: isLoggedIn ? user.name : name,
          email: isLoggedIn ? user.email : email,
          comment,
          parentId: selectedComment ? selectedComment.id : null
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. The API server may not be running.');
      }

      const data = await response.json();

      if (data.success) {
        setSuccess('Commentaire ajouté avec succès!');
        setComment('');
        if (!isLoggedIn) {
          setName('');
          setEmail('');
        }
        fetchComments();
        if (selectedComment) {
          setSelectedComment(null);
          fetchReplies(selectedComment.id);
        }
      } else {
        setError(data.message || 'Erreur lors de l\'ajout du commentaire');
      }
    } catch (error) {
      setError('Impossible de se connecter au serveur de commentaires. Veuillez vérifier que le serveur est en cours d\'exécution et réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. The API server may not be running.');
      }

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        setUser(data.user);
        setShowLogin(false);
        setLoginEmail('');
        setLoginPassword('');
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setError(data.message || 'Identifiants invalides');
      }
    } catch (error) {
      setError('Impossible de se connecter au serveur d\'authentification. Veuillez vérifier que le serveur est en cours d\'exécution et réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };



    const handleRegister = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError('');
    
      // 🔹 Regexes
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    
      // 🔹 Validation AVANT l'appel API
      if (!emailRegex.test(registerEmail)) {
        setError("Veuillez entrer une adresse email valide.");
        setIsSubmitting(false);
        return;
      }
    
      if (!passwordRegex.test(registerPassword)) {
        setError("Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre.");
        setIsSubmitting(false);
        return;
      }
    
      try {
        const response = await fetch('http://localhost:8000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
          }),
        });
    
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
    
        // Vérification que c’est bien du JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response. The API server may not be running.');
        }
    
        const data = await response.json();
    
        if (data.success) {
          setSuccess('Inscription réussie! Vous pouvez maintenant vous connecter.');
          setShowRegister(false);
          setShowLogin(true);
          setRegisterName('');
          setRegisterEmail('');
          setRegisterPassword('');
        } else {
          setError(data.message || 'Erreur lors de l\'inscription');
        }
      } catch (error) {
        setError("Impossible de se connecter au serveur d'inscription. Veuillez vérifier que le serveur est en cours d'exécution et réessayer plus tard.");
      } finally {
        setIsSubmitting(false);
      }
    };
    
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const toggleReplies = (commentId) => {
    if (!showReplies[commentId]) {
      fetchReplies(commentId);
    }
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleReply = (comment) => {
    setSelectedComment(comment);
    const newReplyText = `@${comment.name} `;
    setReplyText(newReplyText);
    setComment(newReplyText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0D0F2B] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-[#FFFFFF]/20 relative">
  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] bg-clip-text text-transparent">
    Commentaires - {projectTitle}
  </h2>

  {/* Bouton X en haut à droite */}
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
  >
    ✕
  </button>
</div>

        <div className="p-6">
          {/* User Authentication Section */}
          <div className="mb-6">
            {!isLoggedIn ? (
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setShowRegister(false);
                  }}
                  className="px-4 py-2 bg-[#1A1C3F] text-white rounded-lg hover:bg-[#2A2C4F] transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => {
                    setShowRegister(true);
                    setShowLogin(false);
                  }}
                  className="px-4 py-2 bg-[#1A1C3F] text-white rounded-lg hover:bg-[#2A2C4F] transition-colors"
                >
                  S'inscrire
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-white">
                  Connecté en tant que <span className="font-bold">{user.name}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#1A1C3F] text-white rounded-lg hover:bg-[#2A2C4F] transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>

          {/* Login Form */}
          {showLogin && (
            <div className="mb-6 p-4 bg-[#1A1C3F]/50 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Connexion</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="loginEmail" className="block text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="loginEmail"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0F2B] border border-[#FFFFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#FFB86C]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="loginPassword" className="block text-gray-300 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="loginPassword"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0F2B] border border-[#FFFFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#FFB86C]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            </div>
          )}

          {/* Register Form */}
          {showRegister && (
            <div className="mb-6 p-4 bg-[#1A1C3F]/50 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Inscription</h3>
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label htmlFor="registerName" className="block text-gray-300 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="registerName"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0F2B] border border-[#FFFFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#FFB86C]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="registerEmail" className="block text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="registerEmail"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0F2B] border border-[#FFFFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#FFB86C]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="registerPassword" className="block text-gray-300 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="registerPassword"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0F2B] border border-[#FFFFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#FFB86C]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
                </button>
              </form>
            </div>
          )}

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
              {success}
            </div>
          )}

          {/* Comment Form */}
          <div className="mb-6">
            {selectedComment && (
              <div className="mb-4 p-3 bg-[#1A1C3F]/50 rounded-lg">
                <p className="text-gray-300 mb-2">Répondre à <span className="font-bold text-white">{selectedComment.name}</span>:</p>
                <button 
                  onClick={() => {
                    setSelectedComment(null);
                    setComment('');
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Annuler la réponse
                </button>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {!isLoggedIn && (
                <>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-300 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0D0F2B] border border-[#FFFFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#FFB86C]"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0D0F2B] border border-[#FFFFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#FFB86C]"
                      required
                    />
                  </div>
                </>
              )}
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-300 mb-2">
                  Commentaire
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 bg-[#0D0F2B] border border-[#FFFFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#FFB86C] resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#FFB86C] to-[#FF6B6B] text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi...' : selectedComment ? 'Répondre' : 'Commenter'}
              </button>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">
              {comments.length > 0 ? `${comments.length} Commentaires` : 'Aucun commentaire'}
            </h3>
            
            {comments.map((comment) => (
              <div key={comment.id} className="bg-[#1A1C3F]/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-white">{comment.name}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReply(comment)}
                    className="text-sm text-[#FFB86C] hover:text-[#FF6B6B] transition-colors"
                  >
                    Répondre
                  </button>
                </div>
                <p className="text-gray-300 mb-3">{comment.comment}</p>
                
                {comment.reply_count > 0 && (
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <i className={`fas fa-chevron-${showReplies[comment.id] ? 'up' : 'down'} mr-2`}></i>
                    {showReplies[comment.id] ? 'Masquer' : 'Afficher'} {comment.reply_count} réponse{comment.reply_count > 1 ? 's' : ''}
                  </button>
                )}
                
                {showReplies[comment.id] && replies[comment.id] && (
                  <div className="mt-4 pl-4 border-l-2 border-[#FFFFFF]/10 space-y-4">
                    {replies[comment.id].map((reply) => (
                      <div key={reply.id} className="bg-[#0D0F2B]/50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-bold text-white">{reply.name}</h5>
                            <p className="text-sm text-gray-400">
                              {new Date(reply.created_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <button
                            onClick={() => handleReply(comment)}
                            className="text-sm text-[#FFB86C] hover:text-[#FF6B6B] transition-colors"
                          >
                            Répondre
                          </button>
                        </div>
                        <p className="text-gray-300">{reply.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;