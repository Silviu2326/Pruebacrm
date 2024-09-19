import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from 'react-icons-kit';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import styles from './Listadeclases.module.css';
import ClientesLista from './ClientesLista';
import Pruebaaa from '../Workspace/Pruebaaa.tsx';  // Importa el componente Pruebaaa

const API_BASE_URL = 'http://localhost:5005/api/groupClasses/group-classes';

const Listadeclases = ({ theme }) => {
  const [clases, setClases] = useState([]);
  const [selectedClase, setSelectedClase] = useState(null);
  const [mostrarModalClientes, setMostrarModalClientes] = useState(false);
  const [mostrarFormularioCrearClase, setMostrarFormularioCrearClase] = useState(false);
  const [mostrarFormularioEditarClase, setMostrarFormularioEditarClase] = useState(false);
  const [mostrarFormularioCrearSesion, setMostrarFormularioCrearSesion] = useState(false);
  const [nuevaClase, setNuevaClase] = useState({
    name: '',
    description: '',
    maxParticipants: '',
    estatus: 'Activa'
  });
  const [claseEditando, setClaseEditando] = useState(null);
  const [nuevaSesion, setNuevaSesion] = useState({ fecha: '', duracion: '', precio: '' });
  const [busqueda, setBusqueda] = useState('');
  
  const [mostrarPruebaaa, setMostrarPruebaaa] = useState(false);  // Nuevo estado
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);  // Nuevo estado

  useEffect(() => {
    fetchClases();
  }, []);

  const fetchClases = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setClases(response.data);
    } catch (error) {
      console.error('Error fetching clases:', error);
    }
  };

  const handleAsociarClientes = (clase) => {
    setSelectedClase(clase);
    setMostrarModalClientes(true);
  };

  const handleClientesSeleccionados = async (clientesSeleccionados) => {
    try {
      const updatedClase = { ...selectedClase, clients: clientesSeleccionados };
      const response = await axios.put(`${API_BASE_URL}/${selectedClase._id}`, updatedClase);
      setClases(clases.map(clase =>
        clase._id === selectedClase._id ? response.data : clase
      ));
      setMostrarModalClientes(false);
    } catch (error) {
      console.error('Error updating clients:', error);
    }
  };

  const handleBorrarCliente = async (claseId, clienteId) => {
    try {
      const clase = clases.find(c => c._id === claseId);
      const updatedClientes = clase.clients.filter(cliente => cliente._id !== clienteId);
      const updatedClase = { ...clase, clients: updatedClientes };
      const response = await axios.put(`${API_BASE_URL}/${claseId}`, updatedClase);
      setClases(clases.map(c =>
        c._id === claseId ? response.data : c
      ));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleBorrarClase = async (clase) => {
    if (window.confirm(`¿Estás seguro de que deseas borrar la clase "${clase.name}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/${clase._id}`);
        setClases(clases.filter(c => c._id !== clase._id));
      } catch (error) {
        console.error('Error deleting clase:', error);
      }
    }
  };

  const handleAbrirFormularioCrearClase = () => {
    setMostrarFormularioCrearClase(true);
  };

  const handleCerrarFormularioCrearClase = () => {
    setMostrarFormularioCrearClase(false);
    setNuevaClase({
      name: '',
      description: '',
      maxParticipants: '',
      estatus: 'Activa'
    });
  };

  const handleCrearClase = async () => {
    try {
      const response = await axios.post(API_BASE_URL, nuevaClase);
      setClases([...clases, response.data]);
      handleCerrarFormularioCrearClase();
    } catch (error) {
      console.error('Error creating clase:', error);
    }
  };

  const handleAbrirFormularioEditarClase = (clase) => {
    setClaseEditando({ ...clase });
    setMostrarFormularioEditarClase(true);
  };

  const handleCerrarFormularioEditarClase = () => {
    setMostrarFormularioEditarClase(false);
    setClaseEditando(null);
  };

  const handleEditarClase = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${claseEditando._id}`, claseEditando);
      setClases(clases.map(clase =>
        clase._id === claseEditando._id ? response.data : clase
      ));
      handleCerrarFormularioEditarClase();
    } catch (error) {
      console.error('Error updating clase:', error);
    }
  };

  const handleAbrirFormularioCrearSesion = (clase) => {
    setClaseEditando({ ...clase });
    setMostrarFormularioCrearSesion(true);
  };

  const handleCerrarFormularioCrearSesion = () => {
    setMostrarFormularioCrearSesion(false);
    setNuevaSesion({ fecha: '', duracion: '', precio: '' });
  };

  const handleCrearSesion = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${claseEditando._id}/sesiones`, { ...nuevaSesion, fecha: new Date(nuevaSesion.fecha) });
      setClases(clases.map(clase =>
        clase._id === claseEditando._id ? response.data : clase
      ));
      handleCerrarFormularioCrearSesion();
    } catch (error) {
      console.error('Error creating sesion:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (mostrarFormularioCrearClase) {
      setNuevaClase({ ...nuevaClase, [name]: value });
    } else if (mostrarFormularioEditarClase) {
      setClaseEditando({ ...claseEditando, [name]: value });
    } else if (mostrarFormularioCrearSesion) {
      setNuevaSesion({ ...nuevaSesion, [name]: value });
    }
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const clasesFiltradas = clases.filter(clase =>
    clase.name && clase.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={`${styles.listadeclasesContainer} ${theme}`}>
      <h1 className={`${styles.header} ${theme}`}>Lista de Clases</h1>
      <button
        className={`${styles.crearClaseBtn} ${theme}`}
        onClick={handleAbrirFormularioCrearClase}
      >
        Crear Clase
      </button>
      <input
        type="text"
        placeholder="Buscar clases"
        className={`${styles.buscarClaseInput} ${theme}`}
        value={busqueda}
        onChange={handleBusquedaChange}
      />
   {mostrarFormularioCrearClase && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={`${styles.header} ${theme}`}>Crear Clase Grupal</h2>
            <label>
              Nombre de la Clase:
              <input
                type="text"
                name="name"  // Cambiado a "name"
                placeholder="Ingresa el nombre de la clase"
                value={nuevaClase.name}  // Cambiado a "name"
                onChange={handleChange}
              />
            </label>
            <label>
              Descripción:
              <textarea
                name="description"  // Cambiado a "description"
                placeholder="Ingresa una descripción de la clase"
                value={nuevaClase.description}  // Cambiado a "description"
                onChange={handleChange}
              />
            </label>
            <label>
              Número Máximo de Participantes:
              <input
                type="number"
                name="maxParticipants"  // Cambiado a "maxParticipants"
                placeholder="Máximo número de participantes"
                value={nuevaClase.maxParticipants}  // Cambiado a "maxParticipants"
                onChange={handleChange}
              />
            </label>
            <label>
              Estatus:
              <select
                name="estatus"
                value={nuevaClase.estatus || 'Activa'}
                onChange={handleChange}
              >
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </label>
            <button
              className={styles.crearClaseBtn}
              onClick={handleCrearClase}
              style={{ backgroundColor: 'green', color: 'white' }}
            >
              Crear Clase Grupal
            </button>
            <button
              className={styles.cancelarBtn}
              onClick={handleCerrarFormularioCrearClase}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
            {mostrarFormularioEditarClase && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {/* Aquí va el formulario de editar clase */}
          </div>
        </div>
      )}
      {mostrarFormularioCrearSesion && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {/* Aquí va el formulario de crear sesión */}
          </div>
        </div>
      )}
      <table className={styles.clasesTable}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Clientes</th>
            <th>Máx. Participantes</th>
            <th>Sesiones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clasesFiltradas.map((clase) => (
            <tr key={clase._id}>
              <td>{clase.name}</td>
              <td>{clase.description}</td>
              <td>
                <ul className={styles.clientesList}>
                  {clase.clients && clase.clients.map(({ client }) => (
                    <li key={client._id}>
                      {client.nombre} {client.apellido}
                      <Icon
                        icon={ic_delete_outline}
                        size={20}
                        className={styles.deleteIcon}
                        onClick={() => handleBorrarCliente(clase._id, client._id)}
                      />
                    </li>
                  ))}
                </ul>
              </td>
              <td>{clase.maxParticipants}</td>
              <td>
                <ul className={styles.sesionesList}>
                  {clase.sesiones && clase.sesiones.map(sesion => (
                    <li key={sesion._id}>
                      Fecha: {new Date(sesion.fecha).toLocaleString()}<br />
                      Duración: {sesion.duracion} minutos<br />
                      Precio: ${sesion.precio}<br />
                      Dinero de esta sesión: ${sesion.precio * clase.clients.length}
                      <Icon
                        icon={ic_delete_outline}
                        size={20}
                        className={styles.deleteIcon}
                        onClick={async () => {
                          try {
                            await axios.delete(`${API_BASE_URL}/${clase._id}/sesiones/${sesion._id}`);
                            setClases(clases.map(c =>
                              c._id === clase._id ? { ...c, sesiones: c.sesiones.filter(s => s._id !== sesion._id) } : c
                            ));
                          } catch (error) {
                            console.error('Error deleting sesion:', error);
                          }
                        }}
                      />
                    </li>
                  ))}
                </ul>
                <button
                  className={`${styles.crearSesionBtn} ${theme}`}
                  onClick={() => handleAbrirFormularioCrearSesion(clase)}
                >
                  Añadir Sesión
                </button>
              </td>
              <td>
                <button
                  className={`${styles.editarBtn} ${theme}`}
                  onClick={() => handleAbrirFormularioEditarClase(clase)}
                >
                  Editar
                </button>
                <Icon
                  icon={ic_delete_outline}
                  size={20}
                  className={styles.deleteIcon}
                  onClick={() => handleBorrarClase(clase)}
                />
                <button
                  className={`${styles.verPruebaaaBtn} ${theme}`}  // Nuevo botón
                  onClick={() => {
                    setClaseSeleccionada(clase);
                    setMostrarPruebaaa(true);
                  }}
                >
                  Ver Pruebaaa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mostrarPruebaaa && claseSeleccionada && (
  <Pruebaaa
    service={claseSeleccionada} // Pasando la clase seleccionada como "service"
    onClose={() => setMostrarPruebaaa(false)}
  />
)}
      {mostrarModalClientes && (
        <ClientesLista
          onClientesSeleccionados={handleClientesSeleccionados}
          clientesSeleccionados={selectedClase ? selectedClase.clients : []}
          onClose={() => setMostrarModalClientes(false)}
        />
      )}
    </div>
  );
};

export default Listadeclases;
