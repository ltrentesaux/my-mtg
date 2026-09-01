import React, { useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    username: 'Nom de l\'utilisateur',
    email: 'user@example.com',
    notifications: {
      deckUpdates: true,
      newFeatures: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name.startsWith('notifications.')) {
      const key = name.split('.')[1];
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: checked,
        },
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    console.log('Sauvegarde des paramètres:', settings);
    // Simuler une sauvegarde sur un serveur
    setTimeout(() => {
      setIsSaving(false);
      //alert('Paramètres sauvegardés avec succès!');
    }, 1500);
  };

  return (
    <div className="settings-container">
      <h1>Paramètres</h1>

      <div className="settings-section">
        <h2>Profil</h2>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            value={settings.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
      </button>
    </div>
  );
}

export default Settings;
