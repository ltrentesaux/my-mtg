import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/MyDecks.css';
import NewDeckModal from '../components/NewDeckModal';

function MyDecks({ decks, onSaveDeck }) { // Recevoir les props ici
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (newDeckData) => {
    onSaveDeck(newDeckData);
    setIsModalOpen(false);
  }

  return (
    <div className="my-decks-container">
      <div className="my-decks-header">
        <h1>Mes Decks</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>+ Nouveau Deck</button>
      </div>

      <div className="decks-grid">
        {decks.length === 0 ? (
          <p className="no-decks-message">Vous n'avez pas encore de deck. Créez-en un pour commencer !</p>
        ) : (
          decks.map(deck => (
            <Link to={`/deck/${deck.id}`} key={deck.id} className="deck-card-link">
              <div className="deck-card">
                <img src={deck.coverCard} alt={deck.name} className="deck-cover-image" />
                <div className="deck-card-info">
                  <h3>{deck.name}</h3>
                  <p>{deck.format}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {isModalOpen && (
        <NewDeckModal 
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
}

export default MyDecks;
