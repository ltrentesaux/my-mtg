import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/style/Search.css';
import AddToDeckModal from '../components/AddToDeckModal';

function Search({ decks, addCardToDeck, addCardToCollection }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || ' ');
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(searchParams.get('set') || '');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const [setSearchTerm, setSetSearchTerm] = useState('');
  const [isSetDropdownOpen, setIsSetDropdownOpen] = useState(false);
  const setDropdownRef = useRef(null);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get('https://api.scryfall.com/sets');
        const sortedSets = response.data.data.sort((a, b) => new Date(b.released_at) - new Date(a.released_at));
        setSets(sortedSets);
      } catch (error) {
        console.error('Failed to fetch sets:', error);
      }
    };
    fetchSets();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (setDropdownRef.current && !setDropdownRef.current.contains(event.target)) {
        setIsSetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCards = async (searchQuery, setCode) => {

    setLoading(true);
    setError(null);
    try {
      let q = `name:/${searchQuery}/ lang:fr`;
      if (setCode) {
        q += ` set:${setCode}`;
      }

      if (await axios.get('https://api.scryfall.com/cards/search', {
        params: { q, unique: 'prints', order: 'name' },
      }).then(response => {
        //console.log(response);
      }).catch(error => {
        console.log(error);
      })) {
      } else {
        q = `name:/${searchQuery}/ `;
        if (setCode) {
          q += ` set:${setCode}`;
        }
      }

      let response = await axios.get('https://api.scryfall.com/cards/search', {
        params: { q, unique: 'prints', order: 'name' },
      });
      //console.log(response);
      const formattedCards = response.data.data.map(card => ({
        id: card.id,
        name: card.name,
        artist: card.artist,
        imageUrl: card.image_uris?.large || card.card_faces?.[0].image_uris?.large,
      })).filter(card => card.imageUrl);


      setCards(formattedCards);
      if (formattedCards.length === 0) {
        setError('Image non disponible.');
      }
    } catch (err) {
      setCards([]);
      setError('Aucune carte trouvée. Veuillez réessayer.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    const setFromUrl = searchParams.get('set');
    if (queryFromUrl) {
      searchCards(queryFromUrl, setFromUrl);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = { q: query };
    if (selectedSet) {
      params.set = selectedSet;
    }
    setSearchParams(params);
  };

  const handleOpenModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleSelectDeck = (deckId) => {
    if (selectedCard) {
      addCardToDeck(deckId, selectedCard);
      handleCloseModal();
    }
  };

  const handleSetSelect = (setCode) => {
    setSelectedSet(setCode);
    setIsSetDropdownOpen(false);
    setSetSearchTerm('');
  };

  const filteredSets = sets.filter(set =>
    set.name.toLowerCase().includes(setSearchTerm.toLowerCase())
  );

  const selectedSetName = sets.find(set => set.code === selectedSet)?.name || 'Toutes les extensions';

  return (
    <div className="search-page-container">
      <h1>Recherche de Cartes Magic</h1>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Entrez le nom d'une carte"
          className="search-input-field"
        />
        <div className="set-filter-container" ref={setDropdownRef}>
          <button
            type="button"
            className="set-filter-select"
            onClick={() => setIsSetDropdownOpen(!isSetDropdownOpen)}
          >
            {selectedSetName}
          </button>
          {isSetDropdownOpen && (
            <div className="set-dropdown-panel">
              <input
                type="text"
                className="set-search-input"
                placeholder="Rechercher une extension..."
                value={setSearchTerm}
                onChange={(e) => setSetSearchTerm(e.target.value)}
                autoFocus
              />
              <ul className="set-list">
                <li onClick={() => handleSetSelect('')}>Toutes les extensions</li>
                {filteredSets.map(set => (
                  <li key={set.code} onClick={() => handleSetSelect(set.code)}>
                    {set.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Rechercher</button>
      </form>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="card-results-grid">
        {cards.map(card => (
          <div key={card.id} className="card-item">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.name} />
            ) : (
              <div className="no-image">Image non disponible</div>
            )}
            <h3>{card.name}</h3>
            <p>{card.artist}</p>
            <button onClick={() => handleOpenModal(card)} className="btn btn-secondary">Ajouter au deck</button>
            <button onClick={() => addCardToCollection(card)} className="btn btn-success" style={{ marginTop: '8px' }}>Ajouter à la collection</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddToDeckModal
          decks={decks}
          onSelectDeck={handleSelectDeck}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
}

export default Search;
