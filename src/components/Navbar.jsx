import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/style/Navbar.css';

function Navbar({ user, setUser }) {
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">My MTG</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/search">Recherche</NavLink>
        {user ? (
          <>
            <NavLink to="/decks">Mes Decks</NavLink>
            <NavLink to="/collection">Ma Collection</NavLink>
            <NavLink to="/profile">Profil ({user.username})</NavLink>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #ff4d4d',
                color: '#ff4d4d',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '1rem'
              }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Connexion</NavLink>
            <NavLink to="/register">Inscription</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
