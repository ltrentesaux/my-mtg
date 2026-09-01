import React, { createContext, useState, useContext } from 'react';
import ImageModal from '../components/ImageModal';

const ImageModalContext = createContext();

export const useImageModal = () => useContext(ImageModalContext);

export const ImageModalProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <ImageModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ImageModal imageUrl={selectedImage} onClose={closeModal} />
    </ImageModalContext.Provider>
  );
};
