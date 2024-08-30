import React, { useState } from 'react';
import Draggable from 'react-draggable';
import CrearPost from './CrearPost';
import CrearHistoria from './CrearHistoria';
import Modal from './Modal';
import WireframeModal from './WireframeModal';
import ConexionConIA from './ConexionConIA';
import './ContentCreation.css';
import chatsConfig from './chatsConfig.json';

const ContentCreation = ({ theme }) => {
  const [showModal, setShowModal] = useState(false); // Modal general
  const [selectedChatConfig, setSelectedChatConfig] = useState(null);
  const [showWireframe, setShowWireframe] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [showRecoveryPopup, setShowRecoveryPopup] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false); // Modal para posts, inicializado en false
  const [showHistoriaModal, setShowHistoriaModal] = useState(false); // Modal para historias, inicializado en false

  const handleChatClick = (config) => {
    setSelectedChatConfig(config);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChatConfig(null);
  };

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    setShowWireframe(true);
  };

  const handleCloseWireframe = () => {
    setShowWireframe(false);
    setSelectedTool(null);
  };

  const handleConexionConIAClick = (title) => {
    const newChat = { id: Date.now(), title };
    setActiveChats([...activeChats, newChat]);
  };

  const handleCloseConexionConIA = (id) => {
    setActiveChats(activeChats.filter(chat => chat.id !== id));
  };

  const handleOpenRecoveryPopup = async () => {
    try {
      const response = await fetch('/api/getSavedChats');
      const chats = await response.json();
      setSavedChats(chats);
    } catch (error) {
      console.error('Error al recuperar los chats guardados:', error);
    }

    setShowRecoveryPopup(true);
  };

  const handleCloseRecoveryPopup = () => {
    setShowRecoveryPopup(false);
  };

  const handleRecoverChat = (title) => {
    handleConexionConIAClick(title);
    handleCloseRecoveryPopup();
  };

  const getIconPath = (title) => {
    try {
      return require(`./assets/icons/${title.toLowerCase()}.png`);
    } catch (error) {
      console.error(`Icon not found for ${title}`);
      return null;
    }
  };

  const handleProcessClick = (processType) => {
    if (processType === 'post') {
      setShowPostModal(true); // Abrir modal de posts
    } else if (processType === 'story') {
      setShowHistoriaModal(true); // Abrir modal de historias
    }
  };

  const handleClosePostModal = () => setShowPostModal(false);
  const handleCloseHistoriaModal = () => setShowHistoriaModal(false);

  return (
    <div className={`content-creation ${theme}`}>
      <div className="process-buttons">
        <button className="content-button" onClick={() => handleProcessClick('post')}>
          Crear Post de Instagram
        </button>
        <button className="content-button" onClick={() => handleProcessClick('story')}>
          Crear Historia de Instagram
        </button>
      </div>

      {chatsConfig.map((config, index) => (
        <div 
          key={index} 
          className={`content-card ${theme}`} 
          onClick={index < 6 ? () => handleConexionConIAClick(config.title) : () => handleChatClick(config)}
        >
          <img src={getIconPath(config.title)} alt={`${config.title} icon`} />
          <h2>{config.title}</h2>
        </div>
      ))}
      <div className={`content-card ${theme}`} onClick={() => handleToolClick('Tool 4')}>
        <img src={getIconPath('Tool 4')} alt="Tool 4 icon" />
        <h2>Tool 4</h2>
      </div>
      <div className={`content-card ${theme}`} onClick={() => handleToolClick('Tool 5')}>
        <img src={getIconPath('Tool 5')} alt="Tool 5 icon" />
        <h2>Tool 5</h2>
      </div>
      <div className={`content-card ${theme}`} onClick={() => handleToolClick('Tool 6')}>
        <img src={getIconPath('Tool 6')} alt="Tool 6 icon" />
        <h2>Tool 6</h2>
      </div>

      <button className={`recovery-button ${theme}`} onClick={handleOpenRecoveryPopup}>
        Recuperar Chat
      </button>

      {showRecoveryPopup && (
        <div className="recovery-popup">
          <h3>Recuperar Chat</h3>
          {savedChats.length > 0 ? (
            savedChats.map((chat, index) => (
              <div 
                key={index} 
                className="recovery-item"
                onClick={() => handleRecoverChat(chat.title)}
              >
                {chat.title}
              </div>
            ))
          ) : (
            <p>No hay chats para recuperar</p>
          )}
          <button onClick={handleCloseRecoveryPopup}>Cerrar</button>
        </div>
      )}

      {activeChats.map(chat => (
        <Draggable key={chat.id}>
          <div className="conexionconia-wrapper" style={{ position: 'absolute', zIndex: chat.id }}>
            <ConexionConIA title={chat.title} theme={theme} />
            <button onClick={() => handleCloseConexionConIA(chat.id)}>Cerrar {chat.title}</button>
          </div>
        </Draggable>
      ))}

      <Modal showModal={showModal} handleCloseModal={handleCloseModal}>
        <h2>{selectedChatConfig?.title}</h2>
        <p>Contenido del chat seleccionado...</p>
      </Modal>

      <WireframeModal 
        showWireframe={showWireframe} 
        handleCloseWireframe={handleCloseWireframe} 
        tool={selectedTool}
      />

      <CrearPost showModal={showPostModal} handleCloseModal={handleClosePostModal} />
      <CrearHistoria showModal={showHistoriaModal} handleCloseModal={handleCloseHistoriaModal} />
    </div>
  );
};

export default ContentCreation;
