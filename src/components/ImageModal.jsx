import React from 'react';
import '../assets/style/ImageModal.css';

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>&times;</button>
        <img src={imageUrl} alt="Enlarged card" className="image-modal-img" />
      </div>
    </div>
  );
};

export default ImageModal;
