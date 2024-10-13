import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './ChaterModalInterfaz.css';

const ChaterModalInterfaz = ({ chat, onClose, theme }) => {
    const [messages, setMessages] = useState(chat.messages);
    const [newMessage, setNewMessage] = useState('');

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
        <Draggable handle=".Chater-modal-header">
            <ResizableBox
                className={`Chater-modal-content ${theme}`}
                width={400}
                height={500}
                minConstraints={[300, 300]}
                maxConstraints={[800, 600]}
                resizeHandles={['se']}
            >
                <div>
                    <div className={`Chater-modal-header ${theme}`}>
                        <img src={chat.profilePic} alt="profile" className={`Chater-profile-pic-large ${theme}`} />
                        <h2>{chat.name}</h2>
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
            </ResizableBox>
        </Draggable>
    );
};

export default ChaterModalInterfaz;
