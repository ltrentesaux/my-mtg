import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AvatarSelectionModal from '../components/AvatarSelectionModal';
import '../assets/style/Profile.css';

function Profile({ decks }) {
  const totalDecks = decks.length;
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);

  // L'objet utilisateur. Dans une application réelle, il viendrait d'un contexte ou d'une API.
  const user = {
    name: 'Nom de l\'utilisateur',
    avatar: '../assets/images/avatar/river.jpg', // Mettez ici l'avatar par défaut souhaité
    memberSince: 'Janvier 2023',
  };

  const [isModalOpen, setModalOpen] = useState(false);
  // Initialise l'avatar avec celui de l'objet utilisateur
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar);

  const handleAvatarSelect = (newAvatar) => {
    setCurrentAvatar(newAvatar);
    // Ici, vous mettriez aussi à jour l'objet utilisateur dans votre état global ou base de données
  };

  return (
    <div className="profile-page-container">
      {isModalOpen && (
        <AvatarSelectionModal
          onSelect={handleAvatarSelect}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="profile-header-card">
        <div className="avatar-container" onClick={() => setModalOpen(true)}>
          <img src={currentAvatar} alt="Avatar" className="profile-avatar-large" />
          <div className="avatar-overlay">
            <span className="avatar-edit-text">Changer</span>
          </div>
        </div>
        <div className="profile-header-info">
          <h1>{user.name}</h1>
          <p>Membre depuis {user.memberSince}</p>
          <Link to="/settings" className="btn btn-secondary">Modifier le profil</Link>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="stat-card">
          <h2>{totalDecks}</h2>
          <p>Decks Créés</p>
        </div>
        <div className="stat-card">
          <h2>{totalCards}</h2>
          <p>Cartes Collectionnées</p>
        </div>
      </div>

      <div className="recent-activity-section">
        <h2>Activité Récente</h2>
        {decks.length > 0 ? (
          decks.slice(-3).reverse().map(deck => (
            <div key={deck.id} className="activity-item">
              <p>Vous avez créé le deck <Link to={`/deck/${deck.id}`}>{deck.name}</Link>.</p>
            </div>
          ))
        ) : (
          <p>Aucune activité récente.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
