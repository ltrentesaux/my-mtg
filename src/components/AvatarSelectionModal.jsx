import React from 'react';
import PropTypes from 'prop-types';
import '../assets/style/AvatarSelectionModal.css';

// Importe toutes les images du dossier avatar
const avatarImages = import.meta.glob('../assets/images/avatar/*.jpg', { eager: true });

const AvatarSelectionModal = ({ onSelect, onClose }) => {
  // Transforme l'objet d'images en une liste utilisable
  const avatars = Object.entries(avatarImages).map(([path, module]) => ({
    name: path.split('/').pop().replace('.jpg', ''), // Extrait le nom du fichier
    path: module.default, // Chemin pour la balise <img>
  }));

  const handleSelect = (avatar) => {
    onSelect(avatar.path);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Choisissez votre avatar</h2>
        <div className="avatar-grid">
          {avatars.map((avatar) => (
            <div key={avatar.name} className="avatar-item" onClick={() => handleSelect(avatar)}>
              <img src={avatar.path} alt={avatar.name} className="avatar-image" />
              <p className="avatar-name">{avatar.name}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn btn-secondary close-button">
          Fermer
        </button>
      </div>
    </div>
  );
};

AvatarSelectionModal.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AvatarSelectionModal;
