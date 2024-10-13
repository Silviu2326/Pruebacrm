import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './ChaterPopup.css';

const ChaterPopup = ({ chats, selectedChat, onClose, onSelectChat, theme }) => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(selectedChat.messages);

    const handleSend = () => {
        if (newMessage.trim() !== '') {
            const message = {
                text: newMessage,
                date: new Date().toLocaleString(),
                sent: true,
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    return (
        <div className={`Chater-modal ${theme}`}>
            <Draggable handle=".Chater-modal-header">
                <ResizableBox
                    className={`Chater-modal-content ${theme}`}
                    width={800}
                    height={500}
                    minConstraints={[500, 400]}
                    maxConstraints={[1000, 600]}
                    resizeHandles={['se']}
                >
                    <div className={`Chater-popup-inner ${theme}`}>
                        <div className={`Chater-list-container ${theme}`}>
                            <h3>Chats</h3>
                            <div className={`Chater-list ${theme}`}>
                                {chats.map(chat => (
                                    <div
                                        key={chat.id}
                                        className={`Chater-list-item ${theme}`}
                                        onClick={() => onSelectChat(chat)}
                                    >
                                        <p><strong>{chat.name}</strong>: {chat.messages[0].text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`Chater-chat-container ${theme}`}>
                            <div className={`Chater-modal-header ${theme}`}>
                                <h2>{selectedChat.name}</h2>
                                <span className={`Chater-close ${theme}`} onClick={onClose}>&times;</span>
                            </div>
                            <div className={`Chater-modal-body ${theme}`}>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`Chater-message ${message.sent ? `sent ${theme}` : `received ${theme}`}`}
                                    >
                                        <p>{message.text}</p>
                                        <span className={`Chater-modal-date ${theme}`}>{message.date}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={`Chater-modal-footer ${theme}`}>
                                <input
                                    type="text"
                                    placeholder="Escribe un mensaje..."
                                    className={`Chater-input ${theme}`}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button className={`Chater-send-button ${theme}`} onClick={handleSend}>Enviar</button>
                            </div>
                        </div>
                    </div>
                </ResizableBox>
            </Draggable>
        </div>
    );
};

export default ChaterPopup;
