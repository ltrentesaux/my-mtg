import React from 'react';
import '../assets/style/AddToDeckModal.css';

function AddToDeckModal({ decks, onSelectDeck, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter à un deck</h2>
        {decks.length === 0 ? (
          <p>Vous n'avez aucun deck. Créez-en un d'abord !</p>
        ) : (
          <div className="deck-selection-list">
            {decks.map(deck => (
              <button 
                key={deck.id} 
                className="btn btn-success"
                onClick={() => onSelectDeck(deck.id)}
              >
                {deck.name}
              </button>
            ))}
          </div>
        )}
        <button onClick={onCancel} className="btn btn-secondary">Annuler</button>
      </div>
    </div>
  );
}

export default AddToDeckModal;
