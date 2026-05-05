import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/style/Auth.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/my_tcg/backend-tcg/public/api/register.php', {
        username,
        email,
        password
      });
      if (response.data.success) {
        //alert('Inscription réussie ! Vous pouvez vous connecter.');
        navigate('/login');
      } else {
        alert(response.data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur de communication avec le serveur.');
    }
  };

  return (
    <>
      <h2 className="auth-title">Inscription</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <div className="auth-form-group">
          <label className="auth-label">Nom d'utilisateur :</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="auth-input" />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">Email :</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="auth-input" />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">Mot de passe :</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="auth-input" />
        </div>
        <button type="submit" className="auth-button">S'inscrire</button>
      </form>
      <p className="auth-footer">Déjà un compte ? <Link to="/login" className="auth-link">Se connecter</Link></p>
    </>
  );
}

export default Register;
