// Listadedietas.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Listadedietas.css';
import axios from 'axios';
import Tablacomidas from './Tablacomidas';
import PopupDeComidas from './PopupDeComidas';
import PopupFormDieta from './PopupFormDieta';
import { Edit, Trash2 } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const Listadedietas = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [dietas, setDietas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDietas, setShowDietas] = useState(true);
  const [comidaToEdit, setComidaToEdit] = useState(null);

  useEffect(() => {
    const fetchDietas = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/dietas`);
        setDietas(response.data);
      } catch (error) {
        console.error('Error fetching dietas:', error);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clientes`);
        setClientes(response.data);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchDietas();
    fetchClientes();
  }, []);

  // **Función modificada para añadir la dieta y navegar**
  const addDieta = (newDieta) => {
    // Añadimos temporalmente una propiedad 'isNew' para identificar la nueva dieta
    const newDietaWithAnimation = { ...newDieta, isNew: true };
    setDietas(prevDietas => [...prevDietas, newDietaWithAnimation]); 
  
    // Después de 2 segundos, eliminamos la propiedad 'isNew' para remover la clase de animación
    setTimeout(() => {
      setDietas(prevDietas =>
        prevDietas.map(d => d._id === newDieta._id ? { ...d, isNew: false } : d)
      );
    }, 2000);
  
    setIsPopupOpen(false); // Cierra el modal
    navigate(`/edit-dieta/${newDieta._id}`); // Navega a la página de edición de la nueva dieta
  };

  const openPopup = (comida = null) => {
    setComidaToEdit(comida);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setComidaToEdit(null);
  };

  const handleEditDieta = (dietaId) => {
    navigate(`/edit-dieta/${dietaId}`);
  };

  const handleDeleteDieta = async (dietaId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/dietas/${dietaId}`);
      setDietas(prevDietas => prevDietas.filter((dieta) => dieta._id !== dietaId));
    } catch (error) {
      console.error('Error deleting dieta:', error);
    }
  };

  const filteredDietas = dietas.filter((dieta) =>
    dieta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const getClienteNombre = (clienteId) => {
    const cliente = clientes.find((c) => c._id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente no encontrado';
  };

  // Función para formatear las fechas
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className={`Listadedietas-containerFull ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="Listadedietas-header">
        <h2>{showDietas ? 'Dietas' : 'Comidas'}</h2>
        <div className="Listadedietas-headerButtons">
          <button
            className="Listadedietas-btnPrimary"
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            style={{
              background: 'var(--create-button-bg)',
              color: 'var(--button-text-dark)',
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}
          >
            {isPopupOpen ? 'Cerrar Formulario' : `Crear ${showDietas ? 'Dieta' : 'Comida'}`}
          </button>
          <button
            className="Listadedietas-btnPrimary"
            onClick={() => setShowDietas(!showDietas)}
            style={{
              background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)',
              color: 'var(--button-text-dark)',
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}
          >
            {showDietas ? 'Mostrar Comidas' : 'Mostrar Dietas'}
          </button>
        </div>
      </div>
      {/* Contenido que cambia entre dietas y comidas */}
      {showDietas ? (
        <div className={`${theme === 'dark' ? 'dark' : ''}`}>
          <input
            className={`Listadedietas-searchInput ${theme}`}
            type="text"
            placeholder="Buscar dietas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'var(--search-button-bg)',
              border: '1px solid var(--button-border)',
              padding: '5px',
              height: '44px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s',
              textAlign: 'left',
            }}
          />

          <table className={`Listadedietas-styledTable ${theme}`}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cliente</th>
                <th>Fecha de Inicio</th>
                <th>Objetivo</th>
                <th>Restricciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
  {filteredDietas.map((dieta) => (
    <tr 
      key={dieta._id} 
      className={dieta.isNew ? 'Listadedietas-newItem' : ''}
    >
      <td>{dieta.nombre}</td>
      <td>{getClienteNombre(dieta.cliente)}</td>
      <td>{formatDate(dieta.fechaInicio)}</td> {/* Formatear fecha */}
      <td>{dieta.objetivo}</td>
      <td>{dieta.restricciones}</td>
      <td>
        <button
          className="Listadedietas-btnActionEdit"
          onClick={() => handleEditDieta(dieta._id)}
        >
          <Edit size={16} />
        </button>
        <button
          className="Listadedietas-btnActionDelete"
          onClick={() => handleDeleteDieta(dieta._id)}
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>

          {/* Renderizar PopupFormDieta solo si showDietas es true */}
          {isPopupOpen && (
            <PopupFormDieta
              isOpen={isPopupOpen}
              onClose={closePopup}
              clientes={clientes}
              addDieta={addDieta} // Pasar la función actualizada addDieta
              theme={theme}
            />
          )}
        </div>
      ) : (
        <div className={`${theme === 'dark' ? 'dark' : ''}`}>
          <Tablacomidas theme={theme} />

          {/* Renderizar PopupDeComidas solo si showDietas es false */}
          {isPopupOpen && (
            <PopupDeComidas
              theme={theme}
              isOpen={isPopupOpen}
              closeModal={closePopup}
              comidaToEdit={comidaToEdit}
              refreshComidas={() => {}}
              isOption={false} // Asegúrate de pasar correctamente este prop según tu lógica
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Listadedietas;
