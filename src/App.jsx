import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import MyDecks from './pages/MyDecks';
import Settings from './pages/Settings';
import DeckDetail from './pages/DeckDetail';
import Collection from './pages/Collection';
import Navbar from './components/Navbar';
import './assets/style/global.css';

function App() {
  const [decks, setDecks] = useState([]);
  const [collection, setCollection] = useState([]);

  const handleSaveDeck = (newDeckData) => {
    const newDeck = {
      id: decks.length > 0 ? Math.max(...decks.map(d => d.id)) + 1 : 1,
      ...newDeckData,
      coverCard: 'https://cards.scryfall.io/large/front/5/8/58B6357C-28B4-462C-9455-22ABC545453A.jpg?1562608923',
      cards: [],
    };
    setDecks([...decks, newDeck]);
  };

  const addCardToDeck = (deckId, card) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === deckId) {
        if (deck.cards.find(c => c.id === card.id)) {
          alert('Cette carte est déjà dans le deck.');
          return deck;
        }
        return { ...deck, cards: [...deck.cards, card] };
      }
      return deck;
    }));
    alert(`La carte "${card.name}" a été ajoutée au deck !`);
  };

  const addCardToCollection = (card) => {
    if (collection.find(c => c.id === card.id)) {
      alert('Cette carte est déjà dans votre collection.');
      return;
    }
    setCollection([...collection, card]);
    alert(`La carte "${card.name}" a été ajoutée à votre collection !`);
  };

  const removeCardFromCollection = (cardId) => {
    setCollection(prevCollection => prevCollection.filter(card => card.id !== cardId));
  };

  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/search"
            element={<Search decks={decks} addCardToDeck={addCardToDeck} addCardToCollection={addCardToCollection} />}
          />
          <Route
            path="/decks"
            element={<MyDecks decks={decks} onSaveDeck={handleSaveDeck} />}
          />
          <Route
            path="/collection"
            element={<Collection collection={collection} removeCardFromCollection={removeCardFromCollection} />}
          />
          <Route path="/profile" element={<Profile decks={decks} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/deck/:deckId" element={<DeckDetail decks={decks} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
