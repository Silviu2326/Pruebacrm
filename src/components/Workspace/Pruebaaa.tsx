import React, { useState, useEffect } from 'react';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ComponentsReutilizables/tabs.tsx';
import { Icon } from 'react-icons-kit';
import { pencil } from 'react-icons-kit/fa/pencil';
import { trash } from 'react-icons-kit/fa/trash';
import { users } from 'react-icons-kit/fa/users';
import { dollar } from 'react-icons-kit/fa/dollar';
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
}

const Pruebaaa: React.FC<PruebaaaProps> = ({ service, onClose }) => {
  const { name, description, maxParticipants } = service;

  const [participants, setParticipants] = useState([
    { id: 1, name: "Ana García" },
    { id: 2, name: "Carlos Rodríguez" }
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

  // Estados para el popup de pagos
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

  const handleCreateSession = () => {
    setShowSessionPopup(true);
  };

  const handleCloseSessionPopup = () => {
    setShowSessionPopup(false);
  };

  const handleCreatePayment = () => {
    setShowPaymentPopup(true);
  };

  const handleClosePaymentPopup = () => {
    setShowPaymentPopup(false);
  };

  const handleSelectCliente = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCliente(event.target.value);
  };

  const handleSelectPaymentCliente = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPaymentCliente(event.target.value);
  };

  const handleAsociarCliente = () => {
    setClienteAsociado(selectedCliente);
    alert(`Cliente asociado: ${selectedCliente}`);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSessionDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSessionTime(event.target.value);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSessionLocation(event.target.value);
  };

  const handlePaymentDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPaymentDate(event.target.value);
  };

  const handlePaymentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPaymentAmount(Number(event.target.value));
  };

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
    <div className="Pruebaaa-modal">
      <div className="Pruebaaa-modal-content">
        <button className="Pruebaaa-modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="Pruebaaa-title">Detalles de la Clase</h2>

        <Tabs defaultValue="detalles">
          <TabsList>
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
            <TabsTrigger value="participantes">Participantes</TabsTrigger>
            <TabsTrigger value="sesiones">Sesiones</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
          </TabsList>

          {/* Pestaña de Detalles */}
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
          </TabsContent>

          {/* Pestaña de Participantes */}
          <TabsContent value="participantes">
            <div className="Pruebaaa-participantes-list">
              <div className="Pruebaaa-participantes-header">
                <span>Nombre</span>
                <span>Acciones</span>
              </div>
              {participants.map((participant) => (
                <div className="Pruebaaa-participantes-item" key={participant.id}>
                  <span>{participant.name}</span>
                  <button className="Pruebaaa-delete-button" title="Eliminar participante">
                    <Icon icon={trash} size={16} />
                  </button>
                </div>
              ))}
              <div className="Pruebaaa-add-participante">
                <label>Agregar Participante</label>
                <select className="Pruebaaa-form-control" onChange={handleSelectCliente}>
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nombre} {cliente.apellido}
                    </option>
                  ))}
                </select>
                {selectedCliente && (
                  <Button variant="black" onClick={handleAsociarCliente} className="Pruebaaa-asociar-cliente-button">
                    Asociar Cliente
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Pestaña de Sesiones */}
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
                    <button className="Pruebaaa-edit-button" title="Editar sesión">
                      <Icon icon={pencil} size={16} />
                    </button>
                    <button className="Pruebaaa-delete-button" title="Eliminar sesión">
                      <Icon icon={trash} size={16} />
                    </button>
                    <button className="Pruebaaa-manage-participants-button" title="Gestionar participantes">
                      <Icon icon={users} size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <Button variant="black" onClick={handleCreateSession} className="Pruebaaa-add-session-button">
                Crear Nueva Sesión
              </Button>
            </div>
          </TabsContent>

          {/* Pestaña de Pagos */}
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
              <Button variant="black" onClick={handleCreatePayment} className="Pruebaaa-registrar-pago-button">
                <Icon icon={dollar} size={16} /> Registrar Pago
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Popup de Crear Sesión */}
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

                <Button variant="black" onClick={handleSubmitNewSession}>
                  Crear Sesión
                </Button>
                <Button variant="black" onClick={handleCloseSessionPopup}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Popup de Crear Pago */}
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

                <Button variant="black" onClick={handleSubmitNewPayment}>
                  Registrar Pago
                </Button>
                <Button variant="black" onClick={handleClosePaymentPopup}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}

        <Button variant="black" onClick={onClose} className="Pruebaaa-close-button">
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default Pruebaaa;
