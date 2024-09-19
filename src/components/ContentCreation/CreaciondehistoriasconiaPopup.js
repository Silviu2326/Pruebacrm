// CreaciondehistoriasconiaPopup.js

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ComponentsReutilizables/tabs.tsx';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import './CreaciondehistoriasconiaPopup.css'; // Asegúrate de tener un CSS separado
import './CreaciondepostsconiaPopup.css'; // Si compartes estilos

const CreaciondehistoriasconiaPopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const [step, setStep] = useState(1);
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [previewModalImages, setPreviewModalImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [showBackButton, setShowBackButton] = useState(false);

  const imagePool = [
    'https://www.w3schools.com/w3images/lights.jpg',
    'https://www.w3schools.com/w3images/nature.jpg',
    'https://www.w3schools.com/w3images/mountains.jpg',
    'https://www.w3schools.com/w3images/forest.jpg',
    'https://www.w3schools.com/w3images/snow.jpg',
    'https://www.w3schools.com/w3images/bridge.jpg',
    'https://www.w3schools.com/w3images/rock.jpg',
    'https://www.w3schools.com/w3images/fjords.jpg',
  ];

  const handleOpenModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStep(1);
    setIdeas([]);
    setSelectedIdea('');
    setInputValue('');
    setPreviewImages([]);
    setSelectedImage(null);
    setShowBackButton(false);
    document.body.style.overflow = 'auto'; // Restaurar scroll
  };

  const handleOpenPreviewModal = () => {
    setShowPreviewModal(true);
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
  };

  // Función para abrir el modal de previsualización de imágenes individuales
  const handleOpenImagePreviewModal = () => {
    const shuffledImages = [...imagePool].sort(() => 0.5 - Math.random());
    const selectedImages = shuffledImages.slice(0, 4);
    setPreviewModalImages(selectedImages);
    setShowImagePreviewModal(true);
  };

  const handleCloseImagePreviewModal = () => {
    setShowImagePreviewModal(false);
    setPreviewModalImages([]);
  };

  const generateIdeas = () => {
    if (inputValue.trim() === '') return;
    const generatedIdeas = [
      `Una historia emocionante inspirada en "${inputValue}"`,
      `Un cuento fascinante sobre "${inputValue}"`,
      `Una narrativa intrigante mostrando "${inputValue}"`,
    ];
    setIdeas(generatedIdeas);
    setStep(2);
  };

  const handleIdeaSelection = (idea) => {
    setSelectedIdea(idea);
    generateImages();
    setStep(3);
    setShowBackButton(true);
  };

  const handleBackToSelection = () => {
    setStep(2);
    setShowBackButton(false);
    setSelectedIdea('');
  };

  const generateImages = () => {
    const shuffledImages = [...imagePool].sort(() => 0.5 - Math.random());
    const selectedImages = shuffledImages.slice(0, 4);
    setPreviewImages(selectedImages);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setActiveTab('preview');
  };

  return (
    <div className="CreaciondehistoriasconiaPopup-container">
      <Button variant="black" size="lg" onClick={handleOpenModal} className="CreaciondehistoriasconiaPopup-openButton">
        Crear Historias con IA
      </Button>

      {showModal && (
        <div className={`CreaciondehistoriasconiaPopup-modalOverlay active`}>
          <div className="CreaciondehistoriasconiaPopup-modal">
            <Button variant="red" className="CreaciondehistoriasconiaPopup-closeButton" onClick={handleCloseModal}>
              &times;
            </Button>
            <div className="CreaciondehistoriasconiaPopup-content">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="CreaciondehistoriasconiaPopup-tabList">
                  <TabsTrigger value="chat" className={`CreaciondehistoriasconiaPopup-tabTrigger ${activeTab === 'chat' ? 'active' : ''}`}>
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="preview" className={`CreaciondehistoriasconiaPopup-tabTrigger ${activeTab === 'preview' ? 'active' : ''}`}>
                    Vista Previa
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat">
                  <div className="CreaciondehistoriasconiaPopup-chatBody">
                    {step === 1 && (
                      <div className="CreaciondehistoriasconiaPopup-inputButtonContainer">
                        <input
                          type="text"
                          placeholder="Ingresa un tema para tu historia"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="CreaciondehistoriasconiaPopup-input"
                        />
                        <Button
                          variant="outline"
                          className="CreaciondehistoriasconiaPopup-generateFooterButton"
                          onClick={generateIdeas}
                        >
                          Generar
                        </Button>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="CreaciondehistoriasconiaPopup-step2Container">
                        <p className="CreaciondehistoriasconiaPopup-ideasTitle">Aquí tienes algunas ideas para tu historia:</p>
                        <div className="CreaciondehistoriasconiaPopup-resultsPanel">
                          {ideas.map((idea, index) => (
                            <div key={index} className="CreaciondehistoriasconiaPopup-chatIdea">
                              <span>{idea}</span>
                              <div className="CreaciondehistoriasconiaPopup-resultActions">
                                {/* Botón para previsualizar imágenes individuales */}
                                <Button
                                  variant="link"
                                  onClick={handleOpenImagePreviewModal}
                                  className="CreaciondehistoriasconiaPopup-previewButton"
                                >
                                  👁️ Previsualizar
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() => handleIdeaSelection(idea)}
                                  className="CreaciondehistoriasconiaPopup-selectButton"
                                >
                                  ✔️ Seleccionar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="CreaciondehistoriasconiaPopup-step3Container">
                        <div className="CreaciondehistoriasconiaPopup-selectedIdeaText">
                          <p>Has seleccionado la idea:</p>
                          <div className="CreaciondehistoriasconiaPopup-chatIdeaSelected">
                            <span>{selectedIdea}</span>
                          </div>
                        </div>
                        <div className="CreaciondehistoriasconiaPopup-regenerateButtonContainer">
                          <Button
                            variant="outline"
                            onClick={generateImages}
                            className="CreaciondehistoriasconiaPopup-regenerateButton"
                          >
                            🔄 Regenerar Imágenes
                          </Button>
                        </div>
                        <div className="CreaciondehistoriasconiaPopup-previewImages">
                          {previewImages.map((src, index) => (
                            <img
                              key={index}
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="CreaciondehistoriasconiaPopup-previewImage"
                              onClick={() => handleImageClick(src)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mostrar botón "Volver" si una idea está seleccionada */}
                    {showBackButton && (
                      <div className="CreaciondehistoriasconiaPopup-backButtonContainer">
                        <Button
                          variant="outline"
                          onClick={handleBackToSelection}
                          className="CreaciondehistoriasconiaPopup-backButton"
                        >
                          🔙 Volver
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  <div className="CreaciondehistoriasconiaPopup-previewBody">
                    {selectedImage ? (
                      <div className="CreaciondehistoriasconiaPopup-fullImageContainer">
                        <img src={selectedImage} alt="Selected Preview" className="CreaciondehistoriasconiaPopup-fullImage" />
                        <div className="CreaciondehistoriasconiaPopup-imageActions">
                          <Button variant="primary">Añadir Imagen</Button>
                          <Button variant="primary">Añadir Texto</Button>
                          <Button variant="primary">Dibujar</Button>
                          <Button variant="success">Guardar</Button>
                        </div>
                      </div>
                    ) : (
                      <p>Haz clic en una imagen en la pestaña "Chat" para previsualizarla aquí.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Previsualización General */}
      {showPreviewModal && (
        <div className={`CreaciondehistoriasconiaPopup-modalOverlay active`}>
          <div className="CreaciondehistoriasconiaPopup-modal">
            <Button variant="red" className="CreaciondehistoriasconiaPopup-closeButton" onClick={handleClosePreviewModal}>
              &times;
            </Button>
            <div className="CreaciondehistoriasconiaPopup-content">
              <h2>Previsualización de Imágenes</h2>
              <div className="CreaciondehistoriasconiaPopup-previewImages">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="CreaciondehistoriasconiaPopup-previewImage"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Previsualización de Imágenes Individual */}
      {showImagePreviewModal && (
        <div className={`CreaciondehistoriasconiaPopup-modalOverlay active`}>
          <div className="CreaciondehistoriasconiaPopup-modal CreaciondehistoriasconiaPopup-previewModal">
            <Button variant="red" className="CreaciondehistoriasconiaPopup-closeButton" onClick={handleCloseImagePreviewModal}>
              &times;
            </Button>
            <div className="CreaciondehistoriasconiaPopup-content">
              <h2>Previsualización de Imágenes</h2>
              <div className="CreaciondehistoriasconiaPopup-previewImagesModal">
                {previewModalImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="CreaciondehistoriasconiaPopup-previewImageModal"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreaciondehistoriasconiaPopup;
