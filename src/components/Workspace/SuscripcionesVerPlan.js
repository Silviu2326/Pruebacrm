import React, { useState, useEffect } from 'react';
import { Button } from '../ComponentsReutilizables/Button.tsx'; // Asegúrate de que este botón soporte la variante "black"
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ComponentsReutilizables/tabs.tsx';
import './SuscripcionesVerPlan.css'; // Archivo CSS con los estilos actualizados
import axios from 'axios';

const SuscripcionesVerPlan = ({ plan, clients, onClose }) => {
  const [allClients, setAllClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/clientes');
        setAllClients(response.data);
        console.log('Clientes obtenidos:', response.data);
      } catch (error) {
        console.error('Error al cargar los clientes:', error);
      }
    };

    fetchClients();
  }, []);

  const handleAddClient = () => {
    if (!selectedClientId) {
      console.log('No se ha seleccionado un cliente para añadir');
      return;
    }

    const selectedClient = allClients.find(client => client._id === selectedClientId);

    if (selectedClient) {
      console.log('Cliente seleccionado para añadir:', selectedClient);
      setSelectedClientId('');
    } else {
      console.error('Cliente no encontrado en la lista');
    }
  };

  return (
    <div className="SuscripcionesVerPlan-overlay">
      <div className="SuscripcionesVerPlan-content">
        <div className="SuscripcionesVerPlan-header">
          <h2>Detalles del Plan</h2>
          <Button variant="black" onClick={onClose}>Cerrar</Button>
        </div>
        <Tabs defaultValue="planDetails">
          <TabsList className="SuscripcionesVerPlan-tabsList">
            <TabsTrigger value="planDetails">Detalles del Plan</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
          </TabsList>

          {/* Detalles del Plan */}
          <TabsContent value="planDetails">
            <div className="SuscripcionesVerPlan-tabSection">
              <h3>{plan.planName}</h3>
              <p className="SuscripcionesVerPlan-detail"><strong>Frecuencia:</strong> {plan.frequency}</p>
              <p className="SuscripcionesVerPlan-detail"><strong>Duración:</strong> {plan.durationValue} {plan.durationUnit}</p>
              <p className="SuscripcionesVerPlan-detail"><strong>Precio:</strong> {plan.price}€</p> {/* Cambio de $ a € */}
            </div>
          </TabsContent>

          {/* Clientes asociados al Plan */}
          <TabsContent value="clients">
            <div className="SuscripcionesVerPlan-tabSection">
              <h3>Clientes</h3>
              <p>Gestiona los clientes del plan</p>
              
              {/* Desplegable para seleccionar cliente */}
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="SuscripcionesVerPlan-select"
              >
                <option value="">Seleccione un cliente</option>
                {allClients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.nombre || client.name}
                  </option>
                ))}
              </select>
              
              <Button variant="black" onClick={handleAddClient}>Añadir Cliente</Button>
              
              <table className="SuscripcionesVerPlan-clientsTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => (
                    <tr key={client._id}>
                      <td>{index + 1}</td>
                      <td>{client.nombre || client.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuscripcionesVerPlan;
