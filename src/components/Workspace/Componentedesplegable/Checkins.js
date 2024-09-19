import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkins.css';
import { IoFitnessOutline, IoRestaurantOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { ClipboardList } from 'lucide-react';
import CheckinsPopup from './CheckinsPopup';

const Checkins = () => {
    const [checkins, setCheckins] = useState([]);
    const [selectedCheckin, setSelectedCheckin] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        // Función para obtener los check-ins desde la API
        const fetchCheckins = async () => {
            try {
                const response = await axios.get('http://localhost:5005/api/checkins');
                setCheckins(response.data);
            } catch (error) {
                console.error('Error fetching checkins:', error);
            }
        };

        fetchCheckins();
    }, []);

    const clients = [
        {
            id: 1,
            name: 'Alice Johnson',
            checkins: [
                { id: 1, date: '2023-06-01', title: 'rutina', description: 'Descripción de la rutina...', status: 'green' },
                { id: 2, date: '2023-06-08', title: 'dieta', description: 'Descripción de la dieta...', status: 'yellow' },
                { id: 3, date: '2023-06-15', title: 'rutina', description: 'Otra rutina...', status: 'red' },
            ]
        },
        {
            id: 2,
            name: 'Bob Smith',
            checkins: [
                { id: 4, date: '2023-06-05', title: 'rutina', description: 'Descripción de la rutina...', status: 'green' },
                { id: 5, date: '2023-06-12', title: 'dieta', description: 'Descripción de la dieta...', status: 'yellow' },
            ]
        },
        {
            id: 3,
            name: 'Charlie Brown',
            checkins: [
                { id: 6, date: '2023-06-20', title: 'rutina', description: 'Descripción de la rutina...', status: 'green' },
            ]
        }
    ];
    
    const handleItemClick = (checkin) => {
        setSelectedCheckin(checkin);
    };

    const closeModal = () => {
        setSelectedCheckin(null);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'workout':
                return <IoFitnessOutline size={20} />;
            case 'diet':
                return <IoRestaurantOutline size={20} />;
            default:
                return null;
        }
    };

    const getIcons = (type, hasNote) => {
        return (
            <div style={{ display: 'flex', gap: '5px' }}>
                {getTypeIcon(type)}
                {hasNote && <IoDocumentTextOutline size={20} />}
            </div>
        );
    };

    return (
        <div className="Checkins-column">
            <h3>Check ins</h3>
            <button 
                className="checkins-detalles-button" 
                onClick={() => setIsPopupOpen(true)}
            >
                <ClipboardList size={20} color="white" style={{ marginRight: '8px' }} />
                Ver Lista de Checkins
            </button>
            <div className="Checkins-checkins-container">
                {checkins.map((checkin) => (
                    <div className="Checkins-item" key={checkin._id} onClick={() => handleItemClick(checkin)}>
                        <div className="Checkins-status-text">
                            <div className={`Checkins-status ${checkin.status}`}></div>
                            <p><strong>{checkin.title}</strong>: {checkin.message}</p>
                            {getIcons(checkin.type, checkin.hasNote)}
                        </div>
                        {checkin.date && (
                            <div className="Checkins-date">
                                <p>{checkin.date}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedCheckin && (
                <div className="Checkins-modal" style={{ display: 'flex' }}>
                    <div className="Checkins-modal-content">
                        <span className="Checkins-close" onClick={closeModal}>&times;</span>
                        <h2>{selectedCheckin.title}</h2>
                        <p>{selectedCheckin.message}</p>
                        {selectedCheckin.date && <p><strong>Fecha:</strong> {selectedCheckin.date}</p>}
                    </div>
                </div>
            )}

            {isPopupOpen && (
                <CheckinsPopup 
                    clients={clients}
                    onClose={() => setIsPopupOpen(false)} 
                />
            )}
        </div>
    );
};

export default Checkins;
