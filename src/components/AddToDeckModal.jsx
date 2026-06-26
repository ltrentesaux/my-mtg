import React, { useState } from 'react';
import '../assets/style/AddToDeckModal.css';
import NewDeckModal from './NewDeckModal';

function AddToDeckModal({ decks, selectedCard, addCardToDeck, updateDeckCardQuantity, onCancel, onSaveDeck }) {
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);

  const handleSaveNewDeck = (newDeckData) => {
    onSaveDeck(newDeckData);
    setIsCreatingDeck(false);
  };

  const handleQuantityChange = (deck, change) => {
    if (!selectedCard) return;

    const existingCard = deck.cards.find(c => c.id === selectedCard.id);
    const currentTotal = existingCard ? (existingCard.quantity_total || 1) : 0;

    if (currentTotal === 0 && change > 0) {
      // Add card to deck
      addCardToDeck(deck.id, selectedCard, change);
    } else if (existingCard) {
      // Update quantity
      updateDeckCardQuantity(deck.id, selectedCard.id, 'nonfoil', 'total', change);
    }
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
            {decks.map(deck => {
              const existingCard = deck.cards.find(c => c.id === selectedCard?.id);
              const qTotal = existingCard ? (existingCard.quantity_total || 1) : 0;

              return (
                <div key={deck.id} className="deck-quantity-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', backgroundColor: '#2C2C2C', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{deck.name}</span>
                  <div className="quantity-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => handleQuantityChange(deck, -1)}
                      disabled={qTotal <= 0}
                      style={{ padding: '5px 12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: qTotal <= 0 ? 'not-allowed' : 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{qTotal}</span>
                    <button 
                      onClick={() => handleQuantityChange(deck, 1)}
                      style={{ padding: '5px 12px', backgroundColor: '#E94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => setIsCreatingDeck(true)} className="btn btn-primary">Nouveau Deck</button>
          <button onClick={onCancel} className="btn btn-secondary">Terminer</button>
        </div>
      </div>

      {isCreatingDeck && (
        <NewDeckModal
          onSave={handleSaveNewDeck}
          onCancel={() => setIsCreatingDeck(false)}
        />
      )}
    </div>
  );
}

export default AddToDeckModal;
