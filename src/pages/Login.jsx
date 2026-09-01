import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/style/Auth.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/my_tcg/backend-tcg/public/api/login.php', {
        email,
        password
      });
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        //alert('Connexion réussie !');
        navigate('/');
      } else {
        alert(response.data.message || 'Erreur lors de la connexion');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur de communication avec le serveur.');
    }
  };

  return (
    <>
      <h2 className="auth-title">Connexion</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="auth-form-group">
          <label className="auth-label">Email :</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="auth-input" />
        </div>
        <div className="auth-form-group">
          <label className="auth-label">Mot de passe :</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="auth-input" />
        </div>
        <button type="submit" className="auth-button">Se Connecter</button>
      </form>
      <p className="auth-footer">Pas encore de compte ? <Link to="/register" className="auth-link">S'inscrire</Link></p>
    </>
  );
}

export default Login;
