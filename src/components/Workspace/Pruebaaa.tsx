// src/components/Workspace/Pruebaaa.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ComponentsReutilizables/tabs.tsx';
import { FaPencilAlt, FaTrash, FaUsers } from 'react-icons/fa'; // Importar íconos desde react-icons
import "./Pruebaaa.css";

interface Cliente {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  edad: number;
  genero: string;
  altura: number;
  peso: number;
  telefono: string;
  city: string;
}

interface PruebaaaProps {
  service: any;
  onClose: () => void;
  theme: string; // Añadido el prop 'theme'
}

const Pruebaaa: React.FC<PruebaaaProps> = ({ service, onClose, theme }) => {
  const { name, description, maxParticipants } = service;

  const [participants, setParticipants] = useState([
    { id: 1, name: "Juan Pérez" },
  ]);

  const [sessions, setSessions] = useState([
    { id: 1, date: "2023-06-01", time: "18:00" }
  ]);

  const [payments, setPayments] = useState([
    { id: 1, date: "2023-05-01", amount: 50, status: "Pagado" }
  ]);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [showSessionPopup, setShowSessionPopup] = useState<boolean>(false);
  const [clienteAsociado, setClienteAsociado] = useState<string>('');
  const [newSessionDate, setNewSessionDate] = useState<string>('');
  const [newSessionTime, setNewSessionTime] = useState<string>('');
  const [newSessionLocation, setNewSessionLocation] = useState<string>('');

  const [showPaymentPopup, setShowPaymentPopup] = useState<boolean>(false);
  const [newPaymentDate, setNewPaymentDate] = useState<string>('');
  const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);
  const [selectedPaymentCliente, setSelectedPaymentCliente] = useState<string>('');

  const totalPrevisto = payments.reduce((acc, pago) => acc + pago.amount, 0);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/clientes');
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleCreateSession = () => setShowSessionPopup(true);
  const handleCloseSessionPopup = () => setShowSessionPopup(false);
  const handleCreatePayment = () => setShowPaymentPopup(true);
  const handleClosePaymentPopup = () => setShowPaymentPopup(false);

  const handleSelectCliente = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedCliente(event.target.value);
  const handleSelectPaymentCliente = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedPaymentCliente(event.target.value);
  const handleAsociarCliente = () => {
    if (selectedCliente) {
      const cliente = clientes.find(c => c._id === selectedCliente);
      if (cliente) {
        setParticipants([...participants, { id: participants.length + 1, name: `${cliente.nombre} ${cliente.apellido}` }]);
        setSelectedCliente('');
        alert(`Cliente asociado: ${cliente.nombre} ${cliente.apellido}`);
      }
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewSessionDate(event.target.value);
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewSessionTime(event.target.value);
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewSessionLocation(event.target.value);

  const handlePaymentDateChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewPaymentDate(event.target.value);
  const handlePaymentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => setNewPaymentAmount(Number(event.target.value));

  const handleSubmitNewSession = () => {
    if (newSessionDate && newSessionTime) {
      const newSession = {
        id: sessions.length + 1,
        date: newSessionDate,
        time: newSessionTime,
        location: newSessionLocation || "Sin especificar"
      };
      setSessions([...sessions, newSession]);
      handleCloseSessionPopup();
    } else {
      alert("Por favor, completa la fecha y la hora.");
    }
  };

  const handleSubmitNewPayment = () => {
    if (newPaymentDate && newPaymentAmount > 0 && selectedPaymentCliente) {
      const newPayment = {
        id: payments.length + 1,
        date: newPaymentDate,
        amount: newPaymentAmount,
        status: "Pendiente",
        clienteId: selectedPaymentCliente
      };
      setPayments([...payments, newPayment]);
      handleClosePaymentPopup();
    } else {
      alert("Por favor, completa todos los campos obligatorios.");
    }
  };

  return (
    <div className={`Pruebaaa-modal ${theme}`}>
      <div className={`Pruebaaa-modal-content ${theme}`} style={{ 
        backgroundColor: theme === 'dark' ? '#333' : '#f3f3f3',
        borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf',
        position: 'relative', // Necesario para posicionar el botón "X"
        padding: '20px', // Ajusta el padding según sea necesario
        borderRadius: '8px', // Opcional: agrega bordes redondeados
        maxWidth: '800px', // Opcional: limita el ancho del modal
        margin: '0 auto', // Centra el modal horizontalmente
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Opcional: agrega sombra al modal
      }}>
        {/* Botón de Cerrar "X" */}
        <button 
          onClick={onClose} 
          className="Pruebaaa-close-button"
          style={{
            background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)',
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
            cursor: 'pointer',
            color:  'var(--button-text-dark)' ,
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background 0.3s ease',
            padding: '10px 20px',
            borderRadius: '5px',
          }}
          aria-label="Cerrar Modal"
        >
          X
        </button>

        <h2 className="Pruebaaa-title">Detalles de la Clase</h2>

        <Tabs defaultValue="detalles">
          <TabsList>
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
            <TabsTrigger value="participantes">Participantes</TabsTrigger>
            <TabsTrigger value="sesiones">Sesiones</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
          </TabsList>

          <TabsContent value="detalles">
            <div className="Pruebaaa-detalles-form">
              <form>
                <div className="Pruebaaa-form-group">
                  <label htmlFor="nombreClase">Nombre de la Clase</label>
                  <input
                    type="text"
                    id="nombreClase"
                    className="Pruebaaa-form-control"
                    value={name}
                    readOnly
                  />
                </div>
                <div className="Pruebaaa-form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    className="Pruebaaa-form-control"
                    rows={3}
                    value={description}
                    readOnly
                  ></textarea>
                </div>
                <div className="Pruebaaa-form-group">
                  <label htmlFor="maxParticipantes">Número Máximo de Participantes</label>
                  <input
                    type="number"
                    id="maxParticipantes"
                    className="Pruebaaa-form-control"
                    value={maxParticipants}
                    readOnly
                  />
                </div>
              </form>
            </div>
            {/* Eliminado el botón "Cerrar" de esta sección */}
          </TabsContent>

          <TabsContent value="participantes">
            <div className="Pruebaaa-participantes-list">
              <div className="Pruebaaa-participantes-header">
                <span>Nombre</span>
                <span>Acciones</span>
              </div>
              {participants.map((participant) => (
                <div className="Pruebaaa-participantes-item" key={participant.id}>
                  <span>{participant.name}</span>
                  <button 
                    className="Pruebaaa-delete-button" 
                    title="Eliminar participante"
                    style={{
                      background: theme === 'dark' ? '#555' : '#ddd', 
                      color: theme === 'dark' ? '#fff' : '#000',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.3s ease',
                    }}
                    onClick={() => {
                      // Implementar la lógica para eliminar al participante
                      // Por ejemplo:
                      setParticipants(participants.filter(p => p.id !== participant.id));
                      alert(`Participante eliminado: ${participant.name}`);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <div className="Pruebaaa-add-participante">
                <label>Agregar Participante</label>
                <select 
                  className="Pruebaaa-form-control" 
                  onChange={handleSelectCliente}
                  value={selectedCliente}
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nombre} {cliente.apellido}
                    </option>
                  ))}
                </select>
                {selectedCliente && (
                  <Button 
                    variant="black" 
                    onClick={handleAsociarCliente} 
                    className="Pruebaaa-asociar-cliente-button"
                    style={{
                      background: theme === 'dark' ? '#444' : '#ccc', 
                      color: theme === 'dark' ? '#fff' : '#000',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.3s ease',
                      marginTop: '10px', // Opcional: agrega margen superior
                    }}
                  >
                    Asociar Cliente
                  </Button>
                )}
              </div>
            </div>
            {/* Eliminado el botón "Cerrar" de esta sección */}
          </TabsContent>

          <TabsContent value="sesiones">
            <div className="Pruebaaa-sesiones-list">
              <div className="Pruebaaa-sesiones-header">
                <span>Fecha</span>
                <span>Hora</span>
                <span>Acciones</span>
              </div>
              {sessions.map((session) => (
                <div className="Pruebaaa-sesiones-item" key={session.id}>
                  <span>{session.date}</span>
                  <span>{session.time}</span>
                  <div className="Pruebaaa-sesiones-actions">
                    <button 
                      className="Pruebaaa-edit-button" 
                      title="Editar sesión"
                      style={{
                        background: theme === 'dark' ? '#555' : '#ddd', 
                        color: theme === 'dark' ? '#fff' : '#000',
                        border: 'none',
                        padding: '5px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.3s ease',
                        marginRight: '5px',
                      }}
                      onClick={() => {
                        // Implementar lógica para editar sesión
                        alert(`Editar sesión: ${session.id}`);
                      }}
                    >
                      <FaPencilAlt />
                    </button>
                    <button 
                      className="Pruebaaa-delete-button" 
                      title="Eliminar sesión"
                      style={{
                        background: theme === 'dark' ? '#555' : '#ddd', 
                        color: theme === 'dark' ? '#fff' : '#000',
                        border: 'none',
                        padding: '5px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.3s ease',
                        marginRight: '5px',
                      }}
                      onClick={() => {
                        // Implementar lógica para eliminar sesión
                        setSessions(sessions.filter(s => s.id !== session.id));
                        alert(`Sesión eliminada: ${session.id}`);
                      }}
                    >
                      <FaTrash />
                    </button>
                    <button 
                      className="Pruebaaa-manage-participants-button" 
                      title="Gestionar participantes"
                      style={{
                        background: theme === 'dark' ? '#555' : '#ddd', 
                        color: theme === 'dark' ? '#fff' : '#000',
                        border: 'none',
                        padding: '5px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.3s ease',
                      }}
                      onClick={() => {
                        // Implementar lógica para gestionar participantes
                        alert(`Gestionar participantes de sesión: ${session.id}`);
                      }}
                    >
                      <FaUsers />
                    </button>
                  </div>
                </div>
              ))}
              <Button 
                variant="black" 
                onClick={handleCreateSession} 
                className="Pruebaaa-add-session-button"
                style={{
                  background: theme === 'dark' ? '#444' : '#ccc', 
                  color: theme === 'dark' ? '#fff' : '#000',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                  marginTop: '10px', // Opcional: agrega margen superior
                }}
              >
                Crear Nueva Sesión
              </Button>
            </div>
            {/* Eliminado el botón "Cerrar" de esta sección */}
          </TabsContent>

          <TabsContent value="pagos">
            <div className="Pruebaaa-pagos-list">
              <div className="Pruebaaa-pagos-header">
                <span>Fecha</span>
                <span>Monto</span>
                <span>Estado</span>
              </div>
              {payments.map((pago) => (
                <div className="Pruebaaa-pagos-item" key={pago.id}>
                  <span>{pago.date}</span>
                  <span>${pago.amount}</span>
                  <span>{pago.status}</span>
                </div>
              ))}
              <div className="Pruebaaa-total-previsto">
                <span>Total Previsto: ${totalPrevisto}</span>
              </div>
              <Button 
                variant="black" 
                onClick={handleCreatePayment} 
                className="Pruebaaa-registrar-pago-button"
                style={{
                  background: theme === 'dark' ? '#444' : '#ccc', 
                  color: theme === 'dark' ? '#fff' : '#000',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.3s ease',
                  marginTop: '10px', // Opcional: agrega margen superior
                }}
              >
                Registrar Pago
              </Button>
            </div>
            {/* Eliminado el botón "Cerrar" de esta sección */}
          </TabsContent>
        </Tabs>

        {/* Popups existentes */}
        {showSessionPopup && (
          <div className="Pruebaaa-session-popup-overlay">
            <div className="Pruebaaa-session-popup-content">
              <h3>Crear Nueva Sesión</h3>
              <div className="Pruebaaa-session-form">
                <label>Fecha</label>
                <input
                  type="date"
                  value={newSessionDate}
                  onChange={handleDateChange}
                  className="Pruebaaa-form-control"
                />
                <label>Hora</label>
                <input
                  type="time"
                  value={newSessionTime}
                  onChange={handleTimeChange}
                  className="Pruebaaa-form-control"
                />
                <label>Ubicación (opcional)</label>
                <input
                  type="text"
                  value={newSessionLocation}
                  onChange={handleLocationChange}
                  className="Pruebaaa-form-control"
                />
                <Button 
                  variant="black" 
                  onClick={handleSubmitNewSession}
                  style={{
                    background: theme === 'dark' ? '#444' : '#ccc', 
                    color: theme === 'dark' ? '#fff' : '#000',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                    marginRight: '10px', // Opcional: agrega margen derecho
                  }}
                >
                  Crear Sesión
                </Button>
                <Button 
                  variant="black" 
                  onClick={handleCloseSessionPopup}
                  style={{
                    background: theme === 'dark' ? '#555' : '#ddd', 
                    color: theme === 'dark' ? '#fff' : '#000',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.3s ease',
                  }}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}

        {showPaymentPopup && (
          <div className="Pruebaaa-payment-popup-overlay">
            <div className="Pruebaaa-payment-popup-content">
              <h3>Registrar Nuevo Pago</h3>
              <div className="Pruebaaa-payment-form">
                <label>Fecha</label>
                <input
                  type="date"
                  value={newPaymentDate}
                  onChange={handlePaymentDateChange}
                  className="Pruebaaa-form-control"
                />
                <label>Monto</label>
                <input
                  type="number"
                  value={newPaymentAmount}
                  onChange={handlePaymentAmountChange}
                  className="Pruebaaa-form-control"
                />
                <label>Cliente</label>
                <select
                  value={selectedPaymentCliente}
                  onChange={handleSelectPaymentCliente}
                  className="Pruebaaa-form-control"
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nombre} {cliente.apellido}
                    </option>
                  ))}
                </select>
                <Button 
                  variant="black" 
                  onClick={handleSubmitNewPayment}
                  style={{
                    background: theme === 'dark' ? '#444' : '#ccc', 
                    color: theme === 'dark' ? '#fff' : '#000',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.3s ease',
                    marginRight: '10px', // Opcional: agrega margen derecho
                  }}
                >
                  Registrar Pago
                </Button>
                <Button 
                  variant="black" 
                  onClick={handleClosePaymentPopup}
                  style={{
                    background: theme === 'dark' ? '#555' : '#ddd', 
                    color: theme === 'dark' ? '#fff' : '#000',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.3s ease',
                  }}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pruebaaa;
