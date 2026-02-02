import React from 'react';
import { useParams } from 'react-router-dom';
import '../assets/style/DeckDetail.css';

function DeckDetail({ decks }) {
  const { deckId } = useParams();
  const deck = decks.find(d => d.id === parseInt(deckId));

  if (!deck) {
    return <div>Deck non trouvé.</div>;
  }

  return (
    <div className="deck-detail-container">
      <div className="deck-detail-header">
        <img src={deck.coverCard} alt={deck.name} className="deck-detail-cover-image" />
        <div className="deck-detail-title">
          <h1>{deck.name}</h1>
          <p>{deck.format}</p>
        </div>
      </div>
      <div className="deck-contents">
        <h2>Cartes du deck ({deck.cards.length})</h2>
        {deck.cards.length === 0 ? (
          <p>Ce deck ne contient aucune carte pour le moment.</p>
        ) : (
          <div className="deck-card-grid">
            {deck.cards.map(card => (
              <div key={card.id} className="deck-card-item">
                <img src={card.imageUrl} alt={card.name} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeckDetail;
