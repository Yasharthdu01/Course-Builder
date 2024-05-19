import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [editingNotes, setEditingNotes] = useState({});
  const [modalImage, setModalImage] = useState(null);

  const handleAddImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, { id: uuidv4(), src: reader.result, notes: '', isEditing: false }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (id) => {
    setImages(images.filter(image => image.id !== id));
  };

  const handleNoteChange = (id, newNotes) => {
    setEditingNotes({ ...editingNotes, [id]: newNotes });
  };

  const handleSaveNotes = (id) => {
    setImages(images.map(image => 
      image.id === id ? { ...image, notes: editingNotes[id] || image.notes, isEditing: false } : image
    ));
    setEditingNotes({ ...editingNotes, [id]: '' });
  };

  const handleEditNotes = (id) => {
    const noteToEdit = images.find(image => image.id === id).notes;
    setEditingNotes({ ...editingNotes, [id]: noteToEdit });
    setImages(images.map(image =>
      image.id === id ? { ...image, isEditing: true } : image
    ));
  };

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="gallery-container">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleAddImage} 
        className="hidden-file-input" 
        id="file-input"
      />
      <label htmlFor="file-input" className="custom-file-input">
        Upload Image
      </label>
      <div className="gallery">
        {images.map(image => (
          <div key={image.id} className="gallery-item">
            <img src={image.src} alt="User Upload" onClick={() => openModal(image)} />
            {image.isEditing ? (
              <div className="notes-edit">
                <textarea 
                  placeholder="Write notes here..." 
                  value={editingNotes[image.id] || ''} 
                  onChange={(e) => handleNoteChange(image.id, e.target.value)}
                />
                <button onClick={() => handleSaveNotes(image.id)}>Save</button>
              </div>
            ) : (
              <div className="notes-display">
                <p>{image.notes}</p>
                <button onClick={() => handleEditNotes(image.id)}>
                  {image.notes ? 'Edit Notes' : 'Add Notes'}
                </button>
              </div>
            )}
            <button onClick={() => handleDeleteImage(image.id)}>Delete</button>
          </div>
        ))}
      </div>
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={modalImage.src} alt="User Upload" />
            <p>{modalImage.notes}</p>
            <button className="modal-close" onClick={closeModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
