import React from 'react';
import '../assets/style/Collection.css';
import { useImageModal } from '../contexts/ImageModalContext';

function Collection({ collection, removeCardFromCollection, updateCollectionCardQuantity, addCardToCollection }) {
    const { openModal } = useImageModal();

    // Group collection by card.id to unify variants
    const groupedCollection = [];
    collection.forEach(card => {
        const existing = groupedCollection.find(c => c.id === card.id);
        const variant = card.variant || 'nonfoil';
        if (existing) {
            existing.quantities[variant] = card.quantity || 1;
        } else {
            groupedCollection.push({
                ...card,
                quantities: {
                    [variant]: card.quantity || 1
                }
            });
        }
    });

    const handleQuantityChange = (card, variant, change) => {
        const currentTotal = card.quantities[variant] || 0;
        if (currentTotal === 0 && change > 0) {
            addCardToCollection(card, variant);
        } else if (currentTotal > 0) {
            if (currentTotal + change <= 0) {
                removeCardFromCollection(card.id, variant);
            } else {
                updateCollectionCardQuantity(card.id, variant, change);
            }
        }
    };

    return (
        <div className="collection-page-container">
            <h1>Ma Collection</h1>

            {collection.length === 0 ? (
                <div className="empty-collection">
                    <p>Votre collection est vide.</p>
                    <p>Ajoutez des cartes depuis la page de recherche pour commencer votre collection !</p>
                </div>
            ) : (
                <div className="collection-stats">
                    <p>Nombre total de cartes : <strong>{collection.reduce((sum, c) => sum + (c.quantity || 1), 0)}</strong></p>
                </div>
            )}

            <div className="card-results-grid">
                {groupedCollection.map(card => {
                    const imgUrl = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || card.imageUrl;
                    
                    const variants = [];
                    if (card.nonfoil !== false) variants.push({ value: 'nonfoil', label: 'Normal' });
                    if (card.foil) variants.push({ value: 'foil', label: 'Foil' });
                    if (card.etched) variants.push({ value: 'etched', label: 'Etched' });
                    if (variants.length === 0) variants.push({ value: 'nonfoil', label: 'Normal' });

                    return (
                    <div key={card.id} className="card-item">
                        {imgUrl ? (
                            <img 
                                src={imgUrl} 
                                alt={card.name} 
                                onClick={() => openModal(imgUrl)}
                                style={{ cursor: 'zoom-in' }}
                            />
                        ) : (
                            <div className="no-image">Image non disponible</div>
                        )}
                        <h3>{card.name}</h3>
                        <p className="card-artist">{card.artist}</p>
                        
                        <div style={{ marginTop: '10px' }}>
                            {variants.map(v => {
                                const qTotal = card.quantities[v.value] || 0;
                                return (
                                    <div key={v.value} className="card-quantity-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', backgroundColor: '#1A1A1A', padding: '5px 10px', borderRadius: '4px', border: '1px solid #333' }}>
                                        <span style={{ fontWeight: 'bold', color: '#E0E0E0', fontSize: '0.9rem' }}>{v.label}</span>
                                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleQuantityChange(card, v.value, -1)}
                                                disabled={qTotal <= 0}
                                                style={{ backgroundColor: '#333', color: 'white', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: qTotal <= 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                                            >
                                                -
                                            </button>
                                            <span style={{ fontWeight: 'bold', color: '#E0E0E0', width: '24px', textAlign: 'center' }}>{qTotal}</span>
                                            <button
                                                onClick={() => handleQuantityChange(card, v.value, 1)}
                                                style={{ backgroundColor: '#333', color: 'white', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Collection;
