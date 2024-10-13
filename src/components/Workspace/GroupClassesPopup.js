import React, { useState, useEffect } from 'react';
import './GroupClassesPopup.css';

const GroupClassesPopup = ({ service, onClose }) => {
    const [participants, setParticipants] = useState(service.cliente ? [service.cliente] : []);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [sessions, setSessions] = useState(service.sessions || []);
    const [newSession, setNewSession] = useState({ date: '', time: '', location: '' });
    const [classDetails, setClassDetails] = useState({
        name: service.name,
        description: service.description,
        maxParticipants: service.maxParticipants,
        paymentType: service.paymentType,
        frequency: service.frequency,
        price: service.price,
        durationMonths: service.durationMonths,
    });
    const [attendanceSessionId, setAttendanceSessionId] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [paymentInfo, setPaymentInfo] = useState(service.paymentInfo || []);

    // Fetch clients from the API
    useEffect(() => {
        fetch('http://localhost:5005/api/clientes')
            .then(response => response.json())
            .then(data => setClients(data))
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    const handleAddParticipant = () => {
        if (selectedClient) {
            const client = clients.find(client => client._id === selectedClient);
            setParticipants([...participants, client]);
            setSelectedClient('');
        }
    };

    const handleRemoveParticipant = (id) => {
        const updatedParticipants = participants.filter(participant => participant._id !== id);
        setParticipants(updatedParticipants);
    };

    const handleAddSession = () => {
        if (newSession.date && newSession.time && newSession.location) {
            setSessions([...sessions, { ...newSession, id: Date.now() }]);
            setNewSession({ date: '', time: '', location: '' });
        }
    };

    const handleRemoveSession = (id) => {
        const updatedSessions = sessions.filter(session => session.id !== id);
        setSessions(updatedSessions);
    };

    const handleEditSession = (id) => {
        const sessionToEdit = sessions.find(session => session.id === id);
        setNewSession(sessionToEdit);
        handleRemoveSession(id);
    };

    const handleAttendanceClick = (sessionId) => {
        setAttendanceSessionId(sessionId);
        setAttendance(participants.map(p => ({ ...p, attended: false })));
    };

    const handleAttendanceChange = (participantId) => {
        setAttendance(attendance.map(p => 
            p._id === participantId ? { ...p, attended: !p.attended } : p
        ));
    };

    const handleSaveAttendance = () => {
        const updatedSessions = sessions.map(session => {
            if (session.id === attendanceSessionId) {
                return { ...session, attendance: attendance.filter(p => p.attended).map(p => p._id) };
            }
            return session;
        });
        setSessions(updatedSessions);
        setAttendanceSessionId(null);
    };

    const handleSaveClassDetails = () => {
        // Aquí normalmente enviarías una solicitud API para guardar los detalles actualizados de la clase
        console.log('Class details saved:', classDetails);
    };

    // Cálculo de la previsión de pagos
    const calculatePaymentForecast = () => {
        const totalParticipants = participants.length;
        let totalRevenue = 0;

        if (classDetails.paymentType === 'fijo') {
            totalRevenue = totalParticipants * classDetails.price;
        } else if (classDetails.paymentType === 'por_sesion') {
            totalRevenue = totalParticipants * classDetails.price * sessions.length;
        } else if (classDetails.paymentType === 'paquete_sesiones') {
            totalRevenue = totalParticipants * classDetails.price * (classDetails.sessionPackage || 1);
        }

        return {
            totalParticipants,
            totalRevenue,
            frequency: classDetails.frequency,
        };
    };

    const paymentForecast = calculatePaymentForecast();

    return (
        <div className="GroupClassesPopup-popup">
            <div className="GroupClassesPopup-popup-inner">
                <h2 className="GroupClassesPopup-title">Detalles de la Clase Grupal</h2>

                <div className="GroupClassesPopup-details">
                    <input
                        type="text"
                        value={classDetails.name}
                        onChange={(e) => setClassDetails({ ...classDetails, name: e.target.value })}
                        placeholder="Nombre de la clase"
                    />
                    <textarea
                        value={classDetails.description}
                        onChange={(e) => setClassDetails({ ...classDetails, description: e.target.value })}
                        placeholder="Descripción de la clase"
                    />
                    <input
                        type="number"
                        value={classDetails.maxParticipants}
                        onChange={(e) => setClassDetails({ ...classDetails, maxParticipants: e.target.value })}
                        placeholder="Máximo de Participantes"
                    />
                    <p><strong>Tipo de Pago:</strong> {classDetails.paymentType}</p>
                    <p><strong>Frecuencia de Pago:</strong> {classDetails.frequency}</p>
                    <button onClick={handleSaveClassDetails}>Guardar Detalles</button>
                </div>

                <h3>Clientes Asociados</h3>
                <table className="GroupClassesPopup-participants-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.length > 0 ? (
                            participants.map((participant) => (
                                <tr key={participant._id}>
                                    <td>{participant.nombre} {participant.apellido}</td>
                                    <td>{participant.email}</td>
                                    <td>{participant.telefono}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleRemoveParticipant(participant._id)} 
                                            className="GroupClassesPopup-remove-btn"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No hay clientes asociados</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="GroupClassesPopup-add-participant">
                    <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="GroupClassesPopup-select"
                    >
                        <option value="">Seleccione un cliente</option>
                        {clients.map(client => (
                            <option key={client._id} value={client._id}>
                                {client.nombre} {client.apellido}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddParticipant} className="GroupClassesPopup-add-btn">Añadir</button>
                </div>

                <h3>Sesiones Programadas</h3>
                <div className="GroupClassesPopup-sessions">
                    {sessions.length > 0 ? (
                        <ul>
                            {sessions.map(session => (
                                <li key={session.id}>
                                    <strong>{session.date} - {session.time}</strong> en {session.location}
                                    <button onClick={() => handleEditSession(session.id)}>Editar</button>
                                    <button onClick={() => handleRemoveSession(session.id)}>Cancelar</button>
                                    <button onClick={() => handleAttendanceClick(session.id)}>Marcar Asistencia</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay sesiones programadas</p>
                    )}
                    <div className="GroupClassesPopup-add-session">
                        <input
                            type="date"
                            value={newSession.date}
                            onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                        />
                        <input
                            type="time"
                            value={newSession.time}
                            onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                        />
                        <input
                            type="text"
                            value={newSession.location}
                            onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                            placeholder="Lugar"
                        />
                        <button onClick={handleAddSession}>Añadir Sesión</button>
                    </div>
                </div>

                {attendanceSessionId && (
                    <div className="GroupClassesPopup-attendance">
                        <h4>Marcar Asistencia</h4>
                        <ul>
                            {attendance.map(participant => (
                                <li key={participant._id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={participant.attended}
                                            onChange={() => handleAttendanceChange(participant._id)}
                                        />
                                        {participant.nombre} {participant.apellido}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleSaveAttendance}>Guardar Asistencia</button>
                    </div>
                )}

                <h3>Información de Pagos</h3>
                <div className="GroupClassesPopup-payment-info">
                    <p><strong>Frecuencia de Pago:</strong> {paymentForecast.frequency}</p>
                    <p><strong>Participantes Totales:</strong> {paymentForecast.totalParticipants}</p>
                    <p><strong>Ingresos Totales Previstos:</strong> {paymentForecast.totalRevenue}€</p>
                    <ul>
                        {paymentInfo.length > 0 ? paymentInfo.map((payment, index) => (
                            <li key={index}>
                                <strong>Fecha:</strong> {new Date(payment.date).toLocaleDateString()} - 
                                <strong> Monto:</strong> {payment.amount} - 
                                <strong> Mensaje:</strong> {payment.message}
                            </li>
                        )) : <li>No hay información de pagos disponible.</li>}
                    </ul>
                </div>

                <div className="GroupClassesPopup-actions">
                    <button onClick={onClose} className="GroupClassesPopup-close-btn">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default GroupClassesPopup;
