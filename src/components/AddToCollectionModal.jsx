import React from 'react';
import '../assets/style/AddToDeckModal.css'; // We can reuse the same styles

function AddToCollectionModal({ collection, selectedCard, addCardToCollection, updateCollectionCardQuantity, onCancel }) {
  if (!selectedCard) return null;

  const variants = [];
  if (selectedCard.nonfoil !== false) variants.push({ value: 'nonfoil', label: 'Normal' });
  if (selectedCard.foil) variants.push({ value: 'foil', label: 'Foil' });
  if (selectedCard.etched) variants.push({ value: 'etched', label: 'Etched' });
  if (variants.length === 0) variants.push({ value: 'nonfoil', label: 'Normal' });

  const handleQuantityChange = (variant, change) => {
    const existingCard = collection.find(c => c.id === selectedCard.id && (c.variant || 'nonfoil') === variant);
    const currentTotal = existingCard ? (existingCard.quantity || 1) : 0;

    if (currentTotal === 0 && change > 0) {
      addCardToCollection(selectedCard, variant);
    } else if (existingCard) {
      updateCollectionCardQuantity(selectedCard.id, variant, change);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter à la collection</h2>
        
        <div className="deck-selection-list">
          <div className="deck-quantity-row" style={{ flexDirection: 'column', alignItems: 'stretch', backgroundColor: '#2C2C2C', borderRadius: '8px', padding: '15px', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '15px', textAlign: 'center', display: 'block' }}>Ma Collection</span>
            
            {variants.map(variant => {
              const existingCard = collection.find(c => c.id === selectedCard.id && (c.variant || 'nonfoil') === variant.value);
              const qTotal = existingCard ? (existingCard.quantity || 1) : 0;

              return (
                <div key={variant.value} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', padding: '10px', backgroundColor: '#1A1A1A', borderRadius: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>{variant.label}</span>
                  <div className="quantity-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => handleQuantityChange(variant.value, -1)}
                      disabled={qTotal <= 0}
                      style={{ padding: '5px 12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: qTotal <= 0 ? 'not-allowed' : 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{qTotal}</span>
                    <button 
                      onClick={() => handleQuantityChange(variant.value, 1)}
                      style={{ padding: '5px 12px', backgroundColor: '#E94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default AddToCollectionModal;
