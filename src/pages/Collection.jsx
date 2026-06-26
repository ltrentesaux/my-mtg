import React from 'react';
import '../assets/style/Collection.css';
import { useImageModal } from '../contexts/ImageModalContext';

function Collection({ collection, removeCardFromCollection, updateCollectionCardQuantity }) {
    const { openModal } = useImageModal();
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
                    <p>Nombre total de cartes : <strong>{collection.length}</strong></p>
                </div>
            )}

            <div className="card-results-grid">
                {collection.map(card => {
                    const variant = card.variant || 'nonfoil';
                    const imgUrl = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || card.imageUrl;
                    return (
                    <div key={`${card.id}-${variant}`} className="card-item" style={{ position: 'relative' }}>
                        {variant !== 'nonfoil' && (
                            <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#E94560', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 5, boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                {variant.toUpperCase()}
                            </span>
                        )}
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
                        <div className="card-quantity-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', backgroundColor: '#1A1A1A', padding: '5px 10px', borderRadius: '4px', border: '1px solid #333' }}>
                            <span style={{ fontWeight: 'bold', color: '#E0E0E0' }}>{card.quantity || 1}</span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button
                                    onClick={() => updateCollectionCardQuantity(card.id, variant, -1)}
                                    style={{ backgroundColor: '#333', color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => updateCollectionCardQuantity(card.id, variant, 1)}
                                    style={{ backgroundColor: '#333', color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => removeCardFromCollection(card.id, variant)}
                            className="btn btn-danger"
                            style={{ marginTop: '8px', width: '100%' }}
                        >
                            Retirer
                        </button>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Collection;
