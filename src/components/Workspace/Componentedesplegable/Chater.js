import React, { useState } from 'react';
import './Chater.css';
import { MessageSquare, User } from 'lucide-react';
import ChaterPopup from './ChaterPopup';
import ChaterModalInterfaz from './ChaterModalInterfaz';

const chaterData = [
    {
        id: 1,
        name: 'Juan',
        messages: [
            { text: 'Hola entrenador', date: 'Recibido hace 5 horas', sent: false },
            { text: 'Que tal cliente', date: 'Enviado hace 5 horas', sent: true },
            { text: 'Hola', date: 'Recibido hace 5 horas', sent: false },
        ],
    },
    {
        id: 2,
        name: 'Maria',
        messages: [
            { text: 'Buenos días', date: 'Recibido hace 2 horas', sent: false },
            { text: '¿Cómo estás?', date: 'Recibido hace 1 hora', sent: false },
            { text: 'Bien, gracias', date: 'Enviado hace 30 minutos', sent: true },
        ],
    },
    // Agrega más chats si es necesario
];

const Chater = ({ theme }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleOpenModal = (chat) => {
        setSelectedChat(chat);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSelectChatInPopup = (chat) => {
        setSelectedChat(chat);
    };

    return (
        <div className={`Chater-column ${theme}`}>
            <h3>Chater</h3>
            <button
                className={`chater-detalles-button ${theme}`}
                onClick={handleOpenPopup}
            >
                <MessageSquare size={20} color="white" style={{ marginRight: '8px' }} />
                Abrir Lista de Chats
            </button>
            <div className={`Chater-chater-container ${theme}`}>
                {chaterData.map((chat) => (
                    <div 
                        className={`Chater-item ${theme}`} 
                        key={chat.id} 
                        onClick={() => handleOpenModal(chat)}
                    >
                        <div className={`Chater-status-text ${theme}`}>
                            <User size={32} color="#007bff" />
                            <p><strong>{chat.name}:</strong> {chat.messages[0].text}</p>
                        </div>
                        <div className={`Chater-date ${theme}`}>
                            <p>{chat.messages[0].date}</p>
                        </div>
                    </div>
                ))}
            </div>
            {isPopupOpen && (
                <ChaterPopup
                    chats={chaterData}
                    selectedChat={selectedChat || chaterData[0]} // Usamos el primer chat como fallback
                    onClose={handleClosePopup}
                    onSelectChat={handleSelectChatInPopup}
                    theme={theme}
                />
            )}
            {isModalOpen && selectedChat && (
                <ChaterModalInterfaz
                    chat={selectedChat}
                    onClose={handleCloseModal}
                    theme={theme}
                />
            )}
        </div>
    );
};

export default Chater;
