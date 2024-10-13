// src/components/Clases/Listadeclases.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from 'react-icons-kit';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import './Listadeclases.css';
import ClasesLista from './ClasesLista';
import Pruebaaa from '../Workspace/Pruebaaa.tsx'; // Asegúrate de que este componente exista
import { Eye, Edit } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5005/api/groupClasses/group-classes';

const Listadeclases = ({ theme, setTheme }) => {
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

  const [mostrarPruebaaa, setMostrarPruebaaa] = useState(false);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);

  useEffect(() => {
    fetchClases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClases = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      console.log('Clases obtenidas:', response.data); // Log para depuración
      response.data.forEach((clase, index) => {
        console.log(`Clientes de la clase ${index + 1} (${clase.name}):`, clase.clients);
      });
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
      // Mostrar los clientes seleccionados en la consola
      console.log('Clientes seleccionados:', clientesSeleccionados);

      // Extraer solo los IDs y nombres de los clientes seleccionados
      const nuevosClientes = clientesSeleccionados.map(cliente => ({
        client: cliente._id, // Asegúrate de que 'client' sea el ID del cliente
        nombre: cliente.nombre, // Campo correcto
        apellido: cliente.apellido // Campo correcto
      }));

      // Combinar los clientes existentes con los nuevos, evitando duplicados
      const clientesExistentes = selectedClase.clients || [];
      const clientesUnicos = [
        ...clientesExistentes,
        ...nuevosClientes.filter(nc => !clientesExistentes.some(ce => ce.client === nc.client))
      ];

      const updatedClase = { ...selectedClase, clients: clientesUnicos };
      const response = await axios.put(`${API_BASE_URL}/${selectedClase._id}`, updatedClase);

      if (response.status === 200) {
        setClases(prevClases => prevClases.map(clase =>
          clase._id === selectedClase._id ? response.data : clase
        ));
        setMostrarModalClientes(false);
        console.log(`Clientes asociados correctamente a la clase ${selectedClase._id}.`);
      } else {
        console.error('Error actualizando la clase en el servidor:', response);
      }
    } catch (error) {
      console.error('Error updating clients:', error);
    }
  };

  const handleBorrarCliente = async (claseId, clienteId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente de la clase?')) {
      try {
        // Encontrar la clase específica
        const clase = clases.find(c => c._id === claseId);
        if (!clase) {
          console.error(`Clase con ID ${claseId} no encontrada.`);
          return;
        }

        // Filtrar los clientes para eliminar el cliente con clienteId
        const updatedClientes = clase.clients.filter(cliente => cliente.client !== clienteId);
        
        // Depuración: Verificar la lista actualizada de clientes
        console.log('Clientes actualizados:', updatedClientes);

        // Crear el objeto actualizado de la clase
        const updatedClase = { ...clase, clients: updatedClientes };

        // Enviar la actualización al servidor
        const response = await axios.put(`${API_BASE_URL}/${claseId}`, updatedClase);

        // Depuración: Verificar la respuesta del servidor
        console.log('Respuesta del servidor:', response.data);

        // Verificar la respuesta del servidor
        if (response.status === 200) {
          // Actualizar el estado local con la lista de clientes actualizada
          setClases(prevClases => prevClases.map(c =>
            c._id === claseId ? { ...c, clients: updatedClientes } : c
          ));
          console.log(`Cliente con ID ${clienteId} eliminado correctamente de la clase ${claseId}.`);
        } else {
          console.error('Error al actualizar la clase en el servidor:', response);
        }
      } catch (error) {
        console.error('Error al borrar el cliente:', error);
      }
    }
  };

  const handleBorrarClase = async (clase) => {
    if (window.confirm(`¿Estás seguro de que deseas borrar la clase "${clase.name}"?`)) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/${clase._id}`);
        if (response.status === 200) {
          setClases(clases.filter(c => c._id !== clase._id));
          console.log(`Clase "${clase.name}" eliminada correctamente.`);
        } else {
          console.error('Error al borrar la clase en el servidor:', response);
        }
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
      if (response.status === 201 || response.status === 200) { // Depende de cómo responda tu API
        setClases([...clases, response.data]);
        handleCerrarFormularioCrearClase();
        console.log('Clase creada:', response.data);
      } else {
        console.error('Error al crear la clase en el servidor:', response);
      }
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
      if (response.status === 200) {
        setClases(clases.map(clase =>
          clase._id === claseEditando._id ? response.data : clase
        ));
        handleCerrarFormularioEditarClase();
        console.log('Clase actualizada:', response.data);
      } else {
        console.error('Error al actualizar la clase en el servidor:', response);
      }
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
      const response = await axios.post(`${API_BASE_URL}/${claseEditando._id}/sesiones`, { 
        ...nuevaSesion, 
        fecha: new Date(nuevaSesion.fecha) 
      });
      if (response.status === 201 || response.status === 200) { // Depende de cómo responda tu API
        setClases(clases.map(clase =>
          clase._id === claseEditando._id ? response.data : clase
        ));
        handleCerrarFormularioCrearSesion();
        console.log('Sesión creada:', response.data);
      } else {
        console.error('Error al crear la sesión en el servidor:', response);
      }
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
    <div className={`listadeclasesContainer ${theme}`}>
      <div className="header-title-row">
        <h1 className={`lc-header ${theme}`}>Lista de Clases</h1>
        <button
          className={`crearClaseBtn ${theme}`}
          onClick={handleAbrirFormularioCrearClase}
          style={{
            background:'var(--create-button-bg)', 
            color:  'var(--button-text-dark)' ,
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.3s ease',
          }}>
          Crear Clase
        </button>
      </div>
      <input
        type="text"
        placeholder="Buscar clases"
        className={`buscarClaseInput ${theme}`}
        value={busqueda}
        onChange={handleBusquedaChange}
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
      {/* Modales para crear y editar clases, crear sesiones */}
      {mostrarFormularioCrearClase && (
        <div className={`modalOverlay ${theme}`}>
          <div className={`modalContent ${theme}`}>
            <h2 className={`modalcontent-header ${theme}`}>Crear Clase Grupal</h2>
            <label>
              Nombre de la Clase:
              <input
                type="text"
                name="name"
                placeholder="Ingresa el nombre de la clase"
                value={nuevaClase.name}
                onChange={handleChange}
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
            </label>
            <label>
              Descripción:
              <textarea
                name="description"
                placeholder="Ingresa una descripción de la clase"
                value={nuevaClase.description}
                onChange={handleChange}
                style={{
                  background: 'var(--search-button-bg)',
                  border: '1px solid var(--button-border)',
                  padding: '5px',
                  height: '100px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s',
                  textAlign: 'left',
                }}
              />
            </label>
            <label>
              Número Máximo de Participantes:
              <input
                type="number"
                name="maxParticipants"
                placeholder="Máximo número de participantes"
                value={nuevaClase.maxParticipants}
                onChange={handleChange}
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
            </label>
            <label>
              Estatus:
              <select
                name="estatus"
                value={nuevaClase.estatus || 'Activa'}
                onChange={handleChange}
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
              >
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </label>
            <button
              className={`crearClaseBtn ${theme}`}
              onClick={handleCrearClase}
              style={{
                background:'var(--create-button-bg)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}
            >
              Crear Clase Grupal
            </button>
            <button
              className={`cancelarBtn ${theme}`}
              onClick={handleCerrarFormularioCrearClase}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      {mostrarFormularioEditarClase && (
        <div className={`modalOverlay ${theme}`}>
          <div className={`modalContent ${theme}`}>
            {/* Formulario para editar clase */}
            <h2 className={`modalcontent-header ${theme}`}>Editar Clase Grupal</h2>
            <label>
              Nombre de la Clase:
              <input
                type="text"
                name="name"
                placeholder="Ingresa el nombre de la clase"
                value={claseEditando.name}
                onChange={handleChange}
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
            </label>
            <label>
              Descripción:
              <textarea
                name="description"
                placeholder="Ingresa una descripción de la clase"
                value={claseEditando.description}
                onChange={handleChange}
                style={{
                  background: 'var(--search-button-bg)',
                  border: '1px solid var(--button-border)',
                  padding: '5px',
                  height: '100px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s',
                  textAlign: 'left',
                }}
              />
            </label>
            <label>
              Número Máximo de Participantes:
              <input
                type="number"
                name="maxParticipants"
                placeholder="Máximo número de participantes"
                value={claseEditando.maxParticipants}
                onChange={handleChange}
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
            </label>
            <label>
              Estatus:
              <select
                name="estatus"
                value={claseEditando.estatus || 'Activa'}
                onChange={handleChange}
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
              >
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </label>
            <button
              className={`crearClaseBtn ${theme}`}
              onClick={handleEditarClase}
              style={{
                background:'var(--create-button-bg)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}
            >
              Guardar Cambios
            </button>
            <button
              className={`cancelarBtn ${theme}`}
              onClick={handleCerrarFormularioEditarClase}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      {mostrarFormularioCrearSesion && (
        <div className={`modalOverlay ${theme}`}>
          <div className={`modalContent ${theme}`}>
            {/* Formulario para crear sesión */}
            <h2 className={`modalcontent-header ${theme}`}>Crear Nueva Sesión</h2>
            <label>
              Fecha:
              <input
                type="datetime-local"
                name="fecha"
                value={nuevaSesion.fecha}
                onChange={handleChange}
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
            </label>
            <label>
              Duración (minutos):
              <input
                type="number"
                name="duracion"
                value={nuevaSesion.duracion}
                onChange={handleChange}
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
            </label>
            <label>
              Precio ($):
              <input
                type="number"
                name="precio"
                value={nuevaSesion.precio}
                onChange={handleChange}
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
            </label>
            <button
              className={`crearSesionBtn ${theme}`}
              onClick={handleCrearSesion}
              style={{
                background:'var(--create-button-bg)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}
            >
              Crear Sesión
            </button>
            <button
              className={`cancelarBtn ${theme}`}
              onClick={handleCerrarFormularioCrearSesion}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
      <table className={`clasesTable ${theme}`} 
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
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Clientes</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Máx. Participantes</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Sesiones</th>
            <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: 'bold' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clasesFiltradas.map((clase, index) => (
            <tr key={clase._id} className={theme} style={{ 
                backgroundColor: theme === 'dark' 
                  ? (index % 2 === 0 ? '#333' : '#444') // Colores alternos en modo oscuro
                  : (index % 2 === 0 ? '#f9f9f9' : '#ffffff') // Colores alternos en modo claro
            }}>
              <td style={{ padding: '12px' }}>{clase.name}</td>
              <td style={{ padding: '12px' }}>{clase.description}</td>
              <td style={{ padding: '12px' }}>
  <ul className={`clientesList ${theme}`}>
    {clase.clients && clase.clients.map(({ client }) => (
      <li key={client._id}>
        {client.nombre} {client.apellido}
        <Icon
          icon={ic_delete_outline}
          size={20}
          className={`deleteIcon ${theme}`}
          onClick={() => handleBorrarCliente(clase._id, client._id)}
        />
      </li>
    ))}
  </ul>
  <button
    className={`asociarClientesBtn ${theme}`}
    onClick={() => handleAsociarClientes(clase)}
    style={{
      background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
      color:  'var(--button-text-dark)' ,
      border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background 0.3s ease',
    }}
  >
    Asociar Clientes
  </button>
</td>

              <td style={{ padding: '12px' }}>{clase.maxParticipants}</td>
              <td style={{ padding: '12px' }}>
                <ul className={`sesionesList ${theme}`}>
                  {clase.sesiones && clase.sesiones.map(sesion => (
                    <li key={sesion._id}>
                      Fecha: {new Date(sesion.fecha).toLocaleString()}<br />
                      Duración: {sesion.duracion} minutos<br />
                      Precio: ${sesion.precio}<br />
                      Dinero de esta sesión: ${sesion.precio * (clase.clients ? clase.clients.length : 0)}
                      <Icon
                        icon={ic_delete_outline}
                        size={20}
                        className={`deleteIcon ${theme}`}
                        onClick={async () => {
                          try {
                            const response = await axios.delete(`${API_BASE_URL}/${clase._id}/sesiones/${sesion._id}`);
                            if (response.status === 200) {
                              setClases(prevClases => prevClases.map(c =>
                                c._id === clase._id ? { ...c, sesiones: c.sesiones.filter(s => s._id !== sesion._id) } : c
                              ));
                              console.log(`Sesión ${sesion._id} eliminada correctamente.`);
                            } else {
                              console.error('Error al borrar la sesión en el servidor:', response);
                            }
                          } catch (error) {
                            console.error('Error deleting sesion:', error);
                          }
                        }}
                      />
                    </li>
                  ))}
                </ul>
                <button
                  className={`crearSesionBtn ${theme}`}
                  style={{
                    padding: '10px 20px',
                    background: theme === 'dark' ? 'var(--button-bg-dark)' : 'var(--create-button-bg-light)',
                    color: 'var(--button-text-dark)',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                    transition: 'background 0.3s ease',
                  }}
                  onClick={() => handleAbrirFormularioCrearSesion(clase)}
                >
                  Añadir Sesión
                </button>
              </td>
              <td style={{ padding: '12px' }}>
                <button
                  className={`editarBtn ${theme}`}
                  onClick={() => handleAbrirFormularioEditarClase(clase)}
                  style={{
                    padding: '10px',
                    color: 'var(--button-text-dark)',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    border: 'none',
                    transition: 'background 0.3s ease',
                  }}
                >
                  <Edit color="black" size={20} />
                </button>
                <Icon
                  icon={ic_delete_outline}
                  size={20}
                  className={`deleteIcon ${theme}`}
                  onClick={() => handleBorrarClase(clase)}
                />
                <button
                  className={`verPruebaaaBtn ${theme}`}  
                  onClick={() => {
                    setClaseSeleccionada(clase);
                    setMostrarPruebaaa(true);
                  }}
                  style={{
                    color: 'var(--text)',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.3s',
                    border: 'none',
                    background: 'none',
                  }}
                >
                  <Eye color="black" size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal para Pruebaaa */}
      {mostrarPruebaaa && claseSeleccionada && (
        <Pruebaaa
          service={claseSeleccionada}
          onClose={() => setMostrarPruebaaa(false)}
        />
      )}
      {/* Modal para Asociar Clientes */}
      {mostrarModalClientes && (
        <div className={`modalOverlay ${theme}`}>
          <div className={`modalContent ${theme}`}>
            <ClasesLista
              onClientesSeleccionados={handleClientesSeleccionados}
              clientesSeleccionados={selectedClase ? selectedClase.clients : []}
              onClose={() => setMostrarModalClientes(false)}
              theme={theme} // Asegúrate de pasar el tema si es necesario
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Listadeclases;
