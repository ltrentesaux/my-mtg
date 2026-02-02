import React, { useState } from 'react';
import '../assets/style/NewDeckModal.css';

function NewDeckModal({ onSave, onCancel }) {
  const [deckName, setDeckName] = useState('');
  const [deckFormat, setDeckFormat] = useState('Standard');

  const handleSave = () => {
    onSave({ name: deckName, format: deckFormat });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nouveau Deck</h2>
        <div className="form-group">
          <label htmlFor="deckName">Nom du Deck</label>
          <input
            type="text"
            id="deckName"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="deckFormat">Format</label>
          <select
            id="deckFormat"
            value={deckFormat}
            onChange={(e) => setDeckFormat(e.target.value)}
          >
            <option value="Standard">Standard</option>
            <option value="Modern">Modern</option>
            <option value="Commander">Commander</option>
            <option value="Pioneer">Pioneer</option>
            <option value="Legacy">Legacy</option>
            <option value="Vintage">Vintage</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSave}>Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}

export default NewDeckModal;
