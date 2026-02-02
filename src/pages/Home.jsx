import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/style/Home.css';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Explorez Magic: The Gathering</h1>
        <p>Trouvez des cartes, construisez des decks et suivez votre collection.</p>
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Rechercher une carte..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">Rechercher</button>
        </form>
        <div className="quick-links">
          <Link to="/decks" className="quick-link-btn">Mes Decks</Link>
          <Link to="/profile" className="quick-link-btn">Mon Profil</Link>
        </div>
      </header>
    </div>
  );
}

export default Home;
