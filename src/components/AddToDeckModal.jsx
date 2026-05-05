import React, { useState } from 'react';
import '../assets/style/AddToDeckModal.css';
import NewDeckModal from './NewDeckModal';

function AddToDeckModal({ decks, onSelectDeck, onCancel, onSaveDeck }) {
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);

  const handleSaveNewDeck = (newDeckData) => {
    onSaveDeck(newDeckData);
    setIsCreatingDeck(false);
    // Optionnel : fermer aussi AddToDeckModal après création
    // onCancel();
  };

  const handleCancelNewDeck = () => {
    setIsCreatingDeck(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter à un deck</h2>
        {decks.length === 0 ? (
          <>
            <p>Vous n'avez aucun deck. Créez-en un d'abord !</p>
            <button
              onClick={() => setIsCreatingDeck(true)}
              className="btn btn-primary"
            >
              Créer un deck
            </button>
          </>
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

      {isCreatingDeck && (
        <NewDeckModal
          onSave={handleSaveNewDeck}
          onCancel={handleCancelNewDeck}
        />
      )}
    </div>
  );
}

export default AddToDeckModal;
