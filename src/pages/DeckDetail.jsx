import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/style/DeckDetail.css';
import { useImageModal } from '../contexts/ImageModalContext';

function DeckDetail({ decks, updateDeckCardQuantity }) {
  const { openModal } = useImageModal();
  const { deckId } = useParams();
  const deck = decks.find(d => d.id === parseInt(deckId));
  const [quantityEditMode, setQuantityEditMode] = useState('total'); // 'total' or 'owned'

  if (!deck) {
    return <div>Deck non trouvé.</div>;
  }

  const handleQuantityChange = (cardId, variant, change) => {
    updateDeckCardQuantity(deck.id, cardId, variant, quantityEditMode, change);
  };

  return (
    <div className="deck-detail-container">
      <div className="deck-detail-header">
        <img 
          src={deck.coverCard} 
          alt={deck.name} 
          className="deck-detail-cover-image" 
          onClick={() => openModal(deck.coverCard)}
          style={{ cursor: 'zoom-in' }}
        />
        <div className="deck-detail-title">
          <h1>{deck.name}</h1>
          <p>{deck.format}</p>
        </div>
      </div>
      <div className="deck-contents">
        <div className="deck-contents-header">
          <h2>Cartes du deck ({deck.cards.length})</h2>
          <div className="quantity-toggle">
            <span>Éditer : </span>
            <button 
              className={`toggle-btn ${quantityEditMode === 'total' ? 'active' : ''}`}
              onClick={() => setQuantityEditMode('total')}
            >
              Quantité Totale
            </button>
            <button 
              className={`toggle-btn ${quantityEditMode === 'owned' ? 'active' : ''}`}
              onClick={() => setQuantityEditMode('owned')}
            >
              Quantité Possédée
            </button>
          </div>
        </div>

        {deck.cards.length === 0 ? (
          <p>Ce deck ne contient aucune carte pour le moment.</p>
        ) : (
          <div className="deck-card-grid">
            {deck.cards.map(card => {
              const qTotal = card.quantity_total || 1;
              const qOwned = card.quantity_owned || 0;
              const variant = card.variant || 'nonfoil';

              return (
                <div key={`${card.id}-${variant}`} className="deck-card-item">
                  <img 
                    src={card.image_uris?.normal || card.imageUrl} 
                    alt={card.name} 
                    onClick={() => openModal(card.image_uris?.normal || card.imageUrl)}
                    style={{ cursor: 'zoom-in' }}
                  />
                  <p className="deck-card-name">{card.printed_name || card.name}</p>
                  <div className="card-quantity-controls">
                    <div className="quantity-display">{qOwned} / {qTotal}</div>
                    <div className="quantity-actions">
                      <button onClick={() => handleQuantityChange(card.id, variant, -1)}>-</button>
                      <button onClick={() => handleQuantityChange(card.id, variant, 1)}>+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeckDetail;
