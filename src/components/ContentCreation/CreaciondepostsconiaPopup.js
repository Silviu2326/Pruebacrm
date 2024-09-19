import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ComponentsReutilizables/tabs.tsx';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import './CreaciondepostsconiaPopup.css';

const CreaciondepostsconiaPopup = () => {
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
      `Un post divertido inspirado en "${inputValue}"`,
      `Un video explicativo sobre "${inputValue}"`,
      `Una serie de fotos mostrando "${inputValue}"`,
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
    <div className="CreaciondepostsconiaPopup-container">
      <Button
        variant="black"
        size="lg"
        onClick={handleOpenModal}
        className="CreaciondepostsconiaPopup-openButton"
      >
        Crear Posts con IA
      </Button>

      {showModal && (
        <div className={`CreaciondepostsconiaPopup-modalOverlay active`}>
          <div className="CreaciondepostsconiaPopup-modal">
            <Button
              variant="red"
              className="CreaciondepostsconiaPopup-closeButton"
              onClick={handleCloseModal}
            >
              &times;
            </Button>
            <div className="CreaciondepostsconiaPopup-content">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="CreaciondepostsconiaPopup-tabList">
                  <TabsTrigger
                    value="chat"
                    className={`CreaciondepostsconiaPopup-tabTrigger ${
                      activeTab === 'chat' ? 'active' : ''
                    }`}
                  >
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className={`CreaciondepostsconiaPopup-tabTrigger ${
                      activeTab === 'preview' ? 'active' : ''
                    }`}
                  >
                    Vista Previa
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat">
                  <div className="CreaciondepostsconiaPopup-chatBody">
                    {step === 1 && (
                      <div className="CreaciondepostsconiaPopup-inputButtonContainer">
                        <input
                          type="text"
                          placeholder="Ingresa un tema para tu post"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="CreaciondepostsconiaPopup-input"
                        />
                        <Button
                          variant="outline"
                          className="CreaciondepostsconiaPopup-generateFooterButton"
                          onClick={generateIdeas}
                        >
                          Generar
                        </Button>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="CreaciondepostsconiaPopup-step2Container">
                        <p className="CreaciondepostsconiaPopup-ideasTitle">
                          Aquí tienes algunas ideas para tu post:
                        </p>
                        <div className="CreaciondepostsconiaPopup-resultsPanel">
                          {ideas.map((idea, index) => (
                            <div key={index} className="CreaciondepostsconiaPopup-chatIdea">
                              <span>{idea}</span>
                              <div className="CreaciondepostsconiaPopup-resultActions">
                                <Button
                                  variant="link"
                                  onClick={handleOpenImagePreviewModal}
                                  className="CreaciondepostsconiaPopup-previewButton"
                                >
                                  👁️ Previsualizar
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() => handleIdeaSelection(idea)}
                                  className="CreaciondepostsconiaPopup-selectButton"
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
                      <div className="CreaciondepostsconiaPopup-step3Container">
                        <div className="CreaciondepostsconiaPopup-selectedIdeaText">
                          <p>Has seleccionado la idea:</p>
                          <div className="CreaciondepostsconiaPopup-chatIdeaSelected">
                            <span>{selectedIdea}</span>
                          </div>
                        </div>
                        <div className="CreaciondepostsconiaPopup-regenerateButtonContainer">
                          <Button
                            variant="outline"
                            onClick={generateImages}
                            className="CreaciondepostsconiaPopup-regenerateButton"
                          >
                            🔄 Regenerar Imágenes
                          </Button>
                        </div>
                        <div className="CreaciondepostsconiaPopup-previewImages">
                          {previewImages.map((src, index) => (
                            <img
                              key={index}
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="CreaciondepostsconiaPopup-previewImage"
                              onClick={() => handleImageClick(src)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {showBackButton && (
                      <div className="CreaciondepostsconiaPopup-backButtonContainer">
                        <Button
                          variant="outline"
                          onClick={handleBackToSelection}
                          className="CreaciondepostsconiaPopup-backButton"
                        >
                          🔙 Volver
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="preview">
                  <div className="CreaciondepostsconiaPopup-previewBody">
                    {selectedImage ? (
                      <div className="CreaciondepostsconiaPopup-fullImageContainer">
                        <img
                          src={selectedImage}
                          alt="Selected Preview"
                          className="CreaciondepostsconiaPopup-fullImage"
                        />
                        <div className="CreaciondepostsconiaPopup-imageActions">
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

      {showPreviewModal && (
        <div className={`CreaciondepostsconiaPopup-modalOverlay active`}>
          <div className="CreaciondepostsconiaPopup-modal">
            <Button
              variant="red"
              className="CreaciondepostsconiaPopup-closeButton"
              onClick={handleClosePreviewModal}
            >
              &times;
            </Button>
            <div className="CreaciondepostsconiaPopup-content">
              <h2>Previsualización de Imágenes</h2>
              <div className="CreaciondepostsconiaPopup-previewImages">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="CreaciondepostsconiaPopup-previewImage"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showImagePreviewModal && (
        <div className={`CreaciondepostsconiaPopup-modalOverlay active`}>
          <div className="CreaciondepostsconiaPopup-modal CreaciondepostsconiaPopup-previewModal">
            <Button
              variant="red"
              className="CreaciondepostsconiaPopup-closeButton"
              onClick={handleCloseImagePreviewModal}
            >
              &times;
            </Button>
            <div className="CreaciondepostsconiaPopup-content">
              <h2>Previsualización de Imágenes</h2>
              <div className="CreaciondepostsconiaPopup-previewImagesModal">
                {previewModalImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="CreaciondepostsconiaPopup-previewImageModal"
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

export default CreaciondepostsconiaPopup;
