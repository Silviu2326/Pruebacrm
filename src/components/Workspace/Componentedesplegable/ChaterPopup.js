// src/ChaterPopup.js
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './ChaterPopup.css';

const ChaterPopup = ({ chats, selectedChat, onClose, onSelectChat }) => {
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
        <div className="Chater-modal">
            <Draggable handle=".Chater-modal-header">
                <ResizableBox
                    className="Chater-modal-content"
                    width={800}
                    height={500}
                    minConstraints={[500, 400]}
                    maxConstraints={[1000, 600]}
                    resizeHandles={['se']}
                >
                    <div className="Chater-popup-inner">
                        <div className="Chater-list-container">
                            <h3>Chats</h3>
                            <div className="Chater-list">
                                {chats.map(chat => (
                                    <div
                                        key={chat.id}
                                        className="Chater-list-item"
                                        onClick={() => onSelectChat(chat)}
                                    >
                                        <p><strong>{chat.name}</strong>: {chat.messages[0].text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="Chater-chat-container">
                            <div className="Chater-modal-header">
                                <h2>{selectedChat.name}</h2>
                                <span className="Chater-close" onClick={onClose}>&times;</span>
                            </div>
                            <div className="Chater-modal-body">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`Chater-message ${message.sent ? 'sent' : 'received'}`}
                                    >
                                        <p>{message.text}</p>
                                        <span className="Chater-modal-date">{message.date}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="Chater-modal-footer">
                                <input
                                    type="text"
                                    placeholder="Escribe un mensaje..."
                                    className="Chater-input"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button className="Chater-send-button" onClick={handleSend}>Enviar</button>
                            </div>
                        </div>
                    </div>
                </ResizableBox>
            </Draggable>
        </div>
    );
};

export default ChaterPopup;
