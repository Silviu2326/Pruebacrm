import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ModalAssociateClients.css';
import { X, ChevronDown, Check } from 'lucide-react'; // Asegúrate de tener estos iconos instalados

const ModalAssociateClients = ({ show, onClose, onConfirm, alreadyAssociated, theme }) => {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (show) {
      setSelectedClients([]);
      fetchClients();
    }
  }, [show]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5005/api/clientes');
      console.log('API Response:', response.data);
      const clientsList = response.data.map((client) => ({ _id: client._id, nombre: client.nombre }));
      console.log('Clients List:', clientsList);
      setClients(clientsList);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleClientSelection = (clientId) => {
    setSelectedClients((prevSelected) =>
      prevSelected.includes(clientId)
        ? prevSelected.filter((id) => id !== clientId)
        : [...prevSelected, clientId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedClients);
    setIsDropdownOpen(false); // Opcional: Cerrar el desplegable al confirmar
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
          maxWidth: '600px',
          width: '90%',
          textAlign: 'center',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <button
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: theme === 'dark' ? '#f5f5f5' : '#333333',
          }}
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
        <h2
          style={{
            marginBottom: '20px',
            color: theme === 'dark' ? '#f5f5f5' : '#333333',
            fontSize: '1.5rem',
          }}
        >
          Asociar Clientes
        </h2>
        <div className="client-selection-dropdown" ref={dropdownRef}>
          <button
            style={{
              padding: '10px',
              backgroundColor: theme === 'dark' ? '#555555' : '#007bff',
              color: theme === 'dark' ? '#f5f5f5' : '#ffffff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              transition: 'background 0.3s ease',
            }}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-label="Seleccionar clientes"
          >
            {selectedClients.length > 0
              ? `${selectedClients.length} cliente(s) seleccionado(s)`
              : 'Selecciona Clientes'}
            <ChevronDown size={20} className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
          </button>
          {isDropdownOpen && clients.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: theme === 'dark' ? '#333333' : '#ffffff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                marginTop: '5px',
                width: '100%',
                zIndex: 1001,
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '10px 0',
              }}
              className="dropdown-menu"
            >
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {clients.map((client) => (
                  <li key={client._id} style={{ padding: '10px 20px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: alreadyAssociated.includes(client._id)
                          ? '#999999'
                          : theme === 'dark'
                          ? '#f5f5f5'
                          : '#333333',
                      }}
                      className={`dropdown-item ${alreadyAssociated.includes(client._id) ? 'disabled' : ''}`}
                    >
                      <input
                        type="checkbox"
                        value={client._id}
                        checked={selectedClients.includes(client._id)}
                        onChange={() => toggleClientSelection(client._id)}
                        disabled={alreadyAssociated.includes(client._id)}
                      />
                      <span>{client.nombre}</span>
                      {selectedClients.includes(client._id) && <Check size={16} className="check-icon" />}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div style={{ marginTop: '20px', textAlign: 'left' }} className="selected-clients-summary">
          <h3 style={{ color: theme === 'dark' ? '#f5f5f5' : '#333333' }}>Clientes Seleccionados</h3>
          {selectedClients.length === 0 ? (
            <p style={{ color: '#999999' }}>No hay clientes seleccionados.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selectedClients.map((clientId) => {
                const client = clients.find((c) => c._id === clientId);
                return (
                  <li key={clientId} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span>{client.nombre}</span>
                    <button
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: theme === 'dark' ? '#f5f5f5' : '#333333',
                      }}
                      onClick={() => toggleClientSelection(clientId)}
                      aria-label="Eliminar cliente"
                    >
                      <X size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <button
          style={{
            marginTop: '20px',
            padding: '12px 25px',
            backgroundColor: theme === 'dark' ? 'var(--button-bg-primary-dark)' : 'var(--button-bg-primary-light)',
            color: 'var(--button-text-primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background 0.3s ease',
          }}
          onClick={handleConfirm}
          disabled={selectedClients.length === 0}
        >
          Confirmar Asociación
        </button>
      </div>
    </div>
  );
};

export default ModalAssociateClients;