import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/style/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">My MTG</NavLink>
      </div>
      <div className="navbar-links">
        <NavLink to="/search">Recherche</NavLink>
        <NavLink to="/decks">Mes Decks</NavLink>
        <NavLink to="/collection">Ma Collection</NavLink>
        {/*<NavLink to="/profile">Profil</NavLink>*/}
      </div>
    </nav>
  );
}

export default Navbar;
