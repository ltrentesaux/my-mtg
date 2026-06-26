import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/style/DeckDetail.css';
import { useImageModal } from '../contexts/ImageModalContext';

function DeckDetail({ decks, updateDeckCardQuantity, onDeleteDeck, onRenameDeck, onDuplicateDeck }) {
  const { openModal } = useImageModal();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const deck = decks.find(d => d.id === parseInt(deckId));
  const [quantityEditMode, setQuantityEditMode] = useState('total'); // 'total' or 'owned'
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');

  if (!deck) {
    return <div>Deck non trouvé.</div>;
  }

  const handleQuantityChange = (cardId, variant, change) => {
    updateDeckCardQuantity(deck.id, cardId, variant, quantityEditMode, change);
  };

  const handleRenameSubmit = () => {
    if (editName.trim() !== '') {
      onRenameDeck(deck.id, editName);
    }
    setIsEditingName(false);
  };

  const handleDelete = async () => {
    const success = await onDeleteDeck(deck.id);
    if (success) {
      navigate('/decks');
    }
  };

  const handleDuplicate = async () => {
    const newDeckId = await onDuplicateDeck(deck.id);
    if (newDeckId) {
      navigate(`/deck/${newDeckId}`);
    }
  };

  return (
    <div className="deck-detail-container">
      <div className="deck-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="deck-detail-title">
          {isEditingName ? (
            <div className="rename-input-group">
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                autoFocus 
                onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                className="rename-input"
              />
              <button className="btn btn-success" onClick={handleRenameSubmit}>OK</button>
              <button className="btn btn-secondary" onClick={() => setIsEditingName(false)}>Annuler</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1>{deck.name}</h1>
              <button className="btn btn-icon" onClick={() => { setEditName(deck.name); setIsEditingName(true); }}>✏️</button>
            </div>
          )}
          <p>{deck.format}</p>
        </div>
        <div className="deck-actions" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={handleDuplicate}>Dupliquer</button>
          <button className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
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
