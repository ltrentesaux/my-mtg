import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import MyDecks from './pages/MyDecks';
import Settings from './pages/Settings';
import DeckDetail from './pages/DeckDetail';
import Collection from './pages/Collection';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import './assets/style/global.css';

const API_BASE = 'http://localhost:8000/api';

// Helper function to hydrate Scryfall data
const fetchScryfallData = async (items) => {
  if (items.length === 0) return [];

  const chunks = [];
  for (let i = 0; i < items.length; i += 75) {
    chunks.push(items.slice(i, i + 75));
  }

  let allCards = [];
  for (const chunk of chunks) {
    const identifiers = chunk.map(item => ({ id: item.card_id }));
    try {
      const res = await axios.post('https://api.scryfall.com/cards/collection', { identifiers });
      allCards = [...allCards, ...res.data.data];
    } catch (e) {
      console.error('Error hydrating scryfall data:', e);
    }
  }

  return items.map(item => {
    const sfCard = allCards.find(sf => sf.id === item.card_id) || {};
    return {
      ...sfCard,
      ...item,
      id: item.card_id, // keep scryfall id as primary
      db_id: item.id    // keep local db id
    };
  });
};

function App() {
  const [decks, setDecks] = useState([]);
  const [collection, setCollection] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE}/collections/${user.id}`).then(async res => {
        if (res.data.success) {
          const hydrated = await fetchScryfallData(res.data.collection);
          setCollection(hydrated);
        }
      }).catch(console.error);

      axios.get(`${API_BASE}/decks/${user.id}`).then(async res => {
        if (res.data.success) {
          const fetchedDecks = res.data.decks;
          const hydratedDecks = await Promise.all(fetchedDecks.map(async deck => {
            return {
              ...deck,
              cards: await fetchScryfallData(deck.cards)
            };
          }));
          setDecks(hydratedDecks);
        }
      }).catch(console.error);
    } else {
      setCollection([]);
      setDecks([]);
    }
  }, [user]);

  const handleSaveDeck = async (newDeckData) => {
    if (!user) {
      alert("Vous devez être connecté pour créer un deck !");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/decks`, {
        user_id: user.id,
        name: newDeckData.name,
        description: newDeckData.description,
        format: newDeckData.format,
      });
      if (res.data.success) {
        const newDeck = {
          id: res.data.deck_id,
          ...newDeckData,
          cards: [],
        };
        setDecks([...decks, newDeck]);
        alert("Deck créé avec succès !");
      } else {
        alert("Erreur du serveur lors de la création du deck.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur de connexion à l'API : " + e.message);
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (!user) return;
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce deck ?")) {
      try {
        const res = await axios.delete(`${API_BASE}/decks/${deckId}`);
        if (res.data.success) {
          setDecks(prevDecks => prevDecks.filter(d => d.id !== deckId));
          return true;
        }
      } catch (e) {
        console.error(e);
        alert("Erreur lors de la suppression.");
      }
    }
    return false;
  };

  const handleRenameDeck = async (deckId, newName) => {
    if (!user || !newName.trim()) return;
    try {
      const res = await axios.put(`${API_BASE}/decks/${deckId}`, { name: newName });
      if (res.data.success) {
        setDecks(prevDecks => prevDecks.map(d => 
          d.id === deckId ? { ...d, name: newName } : d
        ));
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors du renommage.");
    }
  };

  const handleDuplicateDeck = async (deckId) => {
    if (!user) return;
    try {
      const res = await axios.post(`${API_BASE}/decks/${deckId}/duplicate`);
      if (res.data.success) {
        const newDeckId = res.data.deck_id;
        
        // Re-fetch decks to get the updated list including the duplicate with cards hydrated
        axios.get(`${API_BASE}/decks/${user.id}`).then(async fetchRes => {
          if (fetchRes.data.success) {
            const fetchedDecks = fetchRes.data.decks;
            const hydratedDecks = await Promise.all(fetchedDecks.map(async deck => {
              return {
                ...deck,
                cards: await fetchScryfallData(deck.cards)
              };
            }));
            setDecks(hydratedDecks);
          }
        });
        
        alert("Deck dupliqué avec succès !");
        return newDeckId;
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la duplication.");
    }
    return null;
  };

  const addCardToDeck = async (deckId, card, quantity = 1, variant = 'nonfoil') => {
    if (!user) {
      alert("Vous devez être connecté pour modifier un deck !");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/decks/${deckId}/cards`, {
        card_id: card.id,
        quantity: quantity,
        lang: 'fr',
        variant: variant
      });
      if (res.data.success) {
        setDecks(prevDecks => prevDecks.map(deck => {
          if (deck.id === parseInt(deckId)) {
            let updatedCards = [...deck.cards];
            const existingCardIndex = updatedCards.findIndex(c => c.id === card.id && (c.variant || 'nonfoil') === variant);
            if (existingCardIndex !== -1) {
              updatedCards[existingCardIndex] = {
                ...updatedCards[existingCardIndex],
                quantity_total: (updatedCards[existingCardIndex].quantity_total || 1) + quantity
              };
            } else {
              updatedCards.push({ ...card, quantity_total: quantity, quantity_owned: 0, variant: variant });
            }
            return { ...deck, cards: updatedCards };
          }
          return deck;
        }));
        //alert(`Carte ajoutée au deck avec succès (${quantity} exemplaire(s)) !`);
      } else {
        alert("Erreur du serveur lors de l'ajout.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur de connexion à l'API : " + e.message);
    }
  };

  const updateDeckCardQuantity = async (deckId, cardId, variant, type, change) => {
    if (!user) {
      alert("Vous devez être connecté !");
      return;
    }
    try {
      const res = await axios.put(`${API_BASE}/decks/${deckId}/cards/${cardId}`, {
        type,
        change,
        variant
      });
      if (res.data.success) {
        setDecks(prevDecks => prevDecks.map(deck => {
          if (deck.id === parseInt(deckId)) {
            const updatedCards = deck.cards.map(card => {
              if (card.id === cardId && (card.variant || 'nonfoil') === variant) {
                if (type === 'total') {
                  const newTotal = (card.quantity_total || 1) + change;
                  if (newTotal <= 0) return null;
                  return { ...card, quantity_total: newTotal };
                } else {
                  let newOwned = (card.quantity_owned || 0) + change;
                  newOwned = Math.max(0, Math.min(newOwned, card.quantity_total || 1));
                  return { ...card, quantity_owned: newOwned };
                }
              }
              return card;
            }).filter(Boolean);
            return { ...deck, cards: updatedCards };
          }
          return deck;
        }));
      } else {
        alert("Erreur du serveur lors de la mise à jour.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur API : " + e.message);
    }
  };

  const updateCollectionCardQuantity = async (cardId, variant, change) => {
    if (!user) return;
    try {
      const res = await axios.put(`${API_BASE}/collections/${user.id}/cards/${cardId}`, {
        change,
        variant
      });
      if (res.data.success) {
        setCollection(prevCollection => {
          return prevCollection.map(card => {
            if (card.id === cardId && (card.variant || 'nonfoil') === variant) {
              const newQuantity = (card.quantity || 1) + change;
              if (newQuantity <= 0) return null;
              return { ...card, quantity: newQuantity };
            }
            return card;
          }).filter(Boolean);
        });
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la mise à jour de la collection.");
    }
  };

  const addCardToCollection = async (card, variant = 'nonfoil') => {
    if (!user) return;
    try {
      const res = await axios.post(`${API_BASE}/collections`, {
        user_id: user.id,
        card_id: card.id,
        lang: 'fr',
        variant: variant
      });
      if (res.data.success) {
        const existingIndex = collection.findIndex(c => c.id === card.id && (c.variant || 'nonfoil') === variant);
        if (existingIndex !== -1) {
          const newCollection = [...collection];
          newCollection[existingIndex] = {
            ...newCollection[existingIndex],
            quantity: (newCollection[existingIndex].quantity || 1) + 1
          };
          setCollection(newCollection);
        } else {
          setCollection([...collection, { ...card, quantity: 1, variant: variant }]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeCardFromCollection = async (cardId, variant = 'nonfoil') => {
    if (!user) return;
    try {
      const res = await axios.delete(`${API_BASE}/collections/${user.id}/${cardId}?variant=${variant}`);
      if (res.data.success) {
        setCollection(prevCollection => prevCollection.filter(card => !(card.id === cardId && (card.variant || 'nonfoil') === variant)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/search"
            element={<Search decks={decks} collection={collection} updateCollectionCardQuantity={updateCollectionCardQuantity} addCardToDeck={addCardToDeck} addCardToCollection={addCardToCollection} onSaveDeck={handleSaveDeck} updateDeckCardQuantity={updateDeckCardQuantity} />}
          />
          <Route
            path="/decks"
            element={<MyDecks decks={decks} onSaveDeck={handleSaveDeck} />}
          />
          <Route
            path="/collection"
            element={<Collection collection={collection} removeCardFromCollection={removeCardFromCollection} updateCollectionCardQuantity={updateCollectionCardQuantity} addCardToCollection={addCardToCollection} />}
          />
          <Route path="/profile" element={<Profile decks={decks} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/deck/:deckId" element={<DeckDetail 
            decks={decks} 
            updateDeckCardQuantity={updateDeckCardQuantity} 
            addCardToDeck={addCardToDeck}
            onDeleteDeck={handleDeleteDeck}
            onRenameDeck={handleRenameDeck}
            onDuplicateDeck={handleDuplicateDeck}
          />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
