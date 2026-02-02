import React from 'react';
import '../assets/style/Collection.css';

function Collection({ collection, removeCardFromCollection }) {
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
                {collection.map(card => (
                    <div key={card.id} className="card-item">
                        {card.imageUrl ? (
                            <img src={card.imageUrl} alt={card.name} />
                        ) : (
                            <div className="no-image">Image non disponible</div>
                        )}
                        <h3>{card.name}</h3>
                        <p className="card-artist">{card.artist}</p>
                        <button
                            onClick={() => removeCardFromCollection(card.id)}
                            className="btn btn-danger"
                        >
                            Retirer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Collection;
