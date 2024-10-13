// src/components/Listaderutinas.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash, UserPlus, MoreHorizontal } from 'lucide-react';
import './Listaderutinas.css';
import FileTable from './FileTable';
import PopupDeCreacionDePlanificacion from './PopupDeCreacionDePlanificacion';
import ModalGenerarFormula from './ModalGenerarFormula';
import Esqueletopopup from './Esqueletopopup';
import ModalAssociateClients from './ModalAssociateClients'; // Importar el nuevo componente

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const Listaderutinas = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showModalFormula, setShowModalFormula] = useState(false);
  const [showSkeletonPopup, setShowSkeletonPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [viewFiles, setViewFiles] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Estados para el modal de asociar clientes
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const predefinedMetas = [
    'cardio', 'fuerza', 'hipertrofia', 'resistencia', 'movilidad',
    'coordinación', 'definición', 'recomposición', 'rehabilitación'
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/routines`);
        if (Array.isArray(response.data)) {
          setPlans(response.data);
        } else {
          console.error('Unexpected response data for plans:', response.data);
          setPlans([]); // Evitar que 'plans' sea undefined
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        setPlans([]); // Evitar que 'plans' sea undefined
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clientes`);
        if (Array.isArray(response.data)) {
          setClients(response.data);
        } else {
          console.error('Unexpected response data for clients:', response.data);
          setClients([]); // Evitar que 'clients' sea undefined
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([]); // Evitar que 'clients' sea undefined
      }
    };

    fetchPlans();
    fetchClients();
  }, []);

  // Función para editar un plan
  const handleEditPlan = (planId) => {
    navigate(`/edit-routine/${planId}`, { state: { theme } });
  };

  // Función para eliminar un plan
  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/routines/${planId}`);
      setPlans(plans.filter((plan) => plan._id !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  // Función para abrir el modal de asociar clientes
  const handleAssociateClientClick = (planId) => {
    setSelectedPlanId(planId);
    setShowAssociateModal(true);
  };

  // Función para confirmar la asociación de clientes
  const handleConfirmAssociateClients = async (clientIds) => {
    if (!selectedPlanId) return;
    try {
      await axios.put(`${API_BASE_URL}/api/rutinas/${selectedPlanId}/asociar-clientes`, {
        clientes: clientIds,
      });

      setShowAssociateModal(false);
      setSelectedPlanId(null);

      // Refrescar los planes
      const updatedPlans = await axios.get(`${API_BASE_URL}/api/routines`);
      setPlans(updatedPlans.data);
    } catch (error) {
      console.error('Error asociando clientes:', error);
    }
  };

  // Función para eliminar un cliente asociado directamente desde la tabla
  const handleRemoveAssociatedClient = async (planId, clientId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/rutinas/${planId}/clientes/${clientId}`);
      const updatedPlans = await axios.get(`${API_BASE_URL}/api/routines`);
      setPlans(updatedPlans.data);
    } catch (error) {
      console.error('Error eliminando cliente asociado:', error);
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no válida';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filtrar planes por término de búsqueda
  const filteredPlans = Array.isArray(plans)
    ? plans.filter((plan) =>
        plan.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-mode', newTheme === 'dark');
  };

  return (
    <div className={`listaderutinas-contenedor ${theme}`}>
      <div className="flex justify-between items-center mb-4" style={{
              display: 'flex',
              flexDirection: 'row', 
              width: '60%',
              alignContent: 'left',
            }}>
        <h2 className="text-2xl font-bold" style={{
              marginRight: '50px',
            }}>Planificaciones</h2>
        <div>
          <button
            className="button"
            onClick={() => setShowPopup(true)}
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
            Crear Planificación
          </button>

          <button
            className="button"
            onClick={() => setViewFiles(!viewFiles)}
            style={{
              background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)',
              color: 'var(--button-text-dark)',
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginLeft: '10px',
              transition: 'background 0.3s ease',
            }}
          >
            {viewFiles ? 'Ver Planificaciones' : 'Ver Archivos'}
          </button>

          <button
            className="button"
            onClick={() => setShowSkeletonPopup(true)} // Abrir el popup de esqueleto
            style={{
              background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)',
              color: 'var(--button-text-dark)',
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginLeft: '10px',
              transition: 'background 0.3s ease',
            }}
          >
            Generar Esqueleto
          </button>
        </div>
      </div>

      {/* Popup de Esqueleto */}
      <Esqueletopopup
        show={showSkeletonPopup}
        onClose={() => setShowSkeletonPopup(false)} // Cerrar el popup
        theme={theme}
      />

      {viewFiles ? (
        <FileTable theme={theme} />
      ) : (
        <>
          <input
            className={`input ${theme}`}
            type="text"
            placeholder="Buscar planificaciones"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '5px',
              border: theme === 'dark' ? '1px solid var(--input-border-dark)' : '1px solid #ccc',
              background: theme === 'dark' ? 'var(--input-bg-dark)' : 'white',
              color: theme === 'dark' ? 'white' : 'black',
              fontSize: '16px',
            }}
          />
          <div className="overflow-x-auto">
            <table 
              className={`listaderutinas-table ${theme}`} 
              style={{ 
                borderRadius: '10px', 
                borderCollapse: 'separate', 
                borderSpacing: '0', 
                width: '100%', 
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <thead style={{ 
                backgroundColor: theme === 'dark' ? '#333' : '#f3f3f3',
                borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf'
              }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Descripción</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Duración</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Fecha de Inicio</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Meta</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Clientes Asociados</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }} className="listaderutinas-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan, index) => (
                  <tr 
                    key={plan._id}
                    onClick={() => handleEditPlan(plan._id)}
                    className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{plan.nombre}</td>
                    <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{plan.descripcion}</td>
                    <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{plan.duracion}</td>
                    <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{formatDate(plan.fechaInicio)}</td>
                    <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>{plan.meta}</td>
                    <td style={{ padding: '12px', color: theme === 'dark' ? 'white' : 'black' }}>
                      {Array.isArray(plan.clientes) && plan.clientes.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {plan.clientes.map((client) => (
                            <li key={client._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              {client.nombre}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Evitar que se active el onClick del <tr>
                                  handleRemoveAssociatedClient(plan._id, client._id);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
                                  marginLeft: '10px',
                                }}
                                title="Eliminar asociación"
                                aria-label="Eliminar asociación"
                              >
                                <Trash size={16} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'No asociado'
                      )}
                    </td>
                    <td 
                      className="listaderutinas-actions" 
                      onClick={(e) => e.stopPropagation()} 
                      style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px' }}
                    >
                      <button
                        onClick={() => handleEditPlan(plan._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
                          padding: '5px',
                        }}
                        title="Editar"
                        aria-label="Editar"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDeletePlan(plan._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
                          padding: '5px',
                        }}
                        title="Borrar"
                        aria-label="Borrar"
                      >
                        <Trash size={18} />
                      </button>

                      <button
                        onClick={() => handleAssociateClientClick(plan._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: theme === 'dark' ? 'var(--button-text-dark)' : 'var(--button-text-light)',
                          padding: '5px',
                        }}
                        title="Asociar Cliente"
                        aria-label="Asociar Cliente"
                      >
                        <UserPlus size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {/* Modals y Popups */}
      <PopupDeCreacionDePlanificacion
        show={showPopup}
        onClose={() => {
          setShowPopup(false);
          setEditingPlan(null); 
        }}
        predefinedMetas={predefinedMetas}
        theme={theme}
        planToEdit={editingPlan}  
      />
      <ModalGenerarFormula
        show={showModalFormula}
        onClose={() => setShowModalFormula(false)} 
        theme={theme}
      />
     <ModalAssociateClients
  show={showAssociateModal}
  onClose={() => {
    setShowAssociateModal(false);
    setSelectedPlanId(null);
  }}
  clients={clients}
  onConfirm={handleConfirmAssociateClients}
  alreadyAssociated={
    selectedPlanId
      ? Array.isArray(plans.find((plan) => plan._id === selectedPlanId)?.clientes)
        ? plans.find((plan) => plan._id === selectedPlanId).clientes.map((c) => c._id)
        : plans.find((plan) => plan._id === selectedPlanId)?.cliente
          ? [plans.find((plan) => plan._id === selectedPlanId).cliente._id]
          : []
      : []
  }
  theme={theme} // Aquí se pasa el tema como prop
/>

    </div>
  );
};

export default Listaderutinas;
