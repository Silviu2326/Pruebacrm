import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import GroupClassesPopup from './GroupClassesPopup.tsx';
import Pruebaaa from './Pruebaaa.tsx'; // Nuevo componente Pruebaaa
import { Service } from '../types/Service';

interface GroupClassesListaProps {
  theme: string;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';

const GroupClassesLista: React.FC<GroupClassesListaProps> = ({ theme }) => {
  const [groupClasses, setGroupClasses] = useState<Service[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isPruebaaaOpen, setIsPruebaaaOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchGroupClasses();
  }, []);

  const fetchGroupClasses = () => {
    axios
      .get(`${API_BASE_URL}/api/groupClasses/group-classes`)
      .then((response) => setGroupClasses(response.data))
      .catch((error) =>
        console.error('Error al cargar las clases grupales:', error)
      );
  };

  const handleOpenPopup = (service: Service) => {
    setSelectedService(service);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedService(null);
  };

  const handleOpenPruebaaa = (service: Service) => {
    setSelectedService(service);
    setIsPruebaaaOpen(true);
  };

  const handleClosePruebaaa = () => {
    setIsPruebaaaOpen(false);
    setSelectedService(null);
  };

  return (
    <div className={`GroupClassesLista-servicios-lista ${theme}`}>
      <table
        className={`GroupClassesLista-tabla-servicios ${theme}`}
        style={{
          borderRadius: '10px',
          borderCollapse: 'separate',
          borderSpacing: '0',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead
          style={{
            backgroundColor: theme === 'dark' ? '#555555' : '#265db5',
            borderBottom: theme === 'dark' ? '1px solid var(--ClientesWorkspace-input-border-dark)' : '1px solid #903ddf',
            color: 'white',
          }}
        >
          <tr>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold',
              }}
            >
              Nombre
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold',
              }}
            >
              Descripción
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold',
              }}
            >
              Precio
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold',
              }}
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {groupClasses.map((service, index) => (
            <tr
              key={service._id}
              style={{
                background: index % 2 === 0 
                  ? 'var(--table-tr-child-bg)' 
                  : 'var(--table-tr-bg)',
              }}
            >
              <td style={{ padding: '12px', color:'var(--text)' }}>
                {service.name}
              </td>
              <td style={{ padding: '12px', color:'var(--text)' }}>
                {service.description}
              </td>
              <td style={{ padding: '12px', color: 'var(--text)' }}>
                {service.subtipo && service.subtipo.length > 0
                  ? service.subtipo[0].price
                  : 'N/A'}
              </td>
              <td style={{ padding: '12px' }}>
                <Button
                  variant="secondary"
                  onClick={() => handleOpenPopup(service)}
                  className={`GroupClassesLista-ver-detalles-btn ${theme}`}
                  style={{
                    background: theme === 'dark' ? 'var(--create-button-bg)' : 'var(--create-button-bg)',
                    color: 'var(--button-text-dark)',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                    transition: 'background 0.3s ease',
                  }}
                >
                  Ver Detalles
                </Button>
                <Button
                  variant="black"
                  onClick={() => handleOpenPruebaaa(service)}
                  className={`GroupClassesLista-pruebaaa-btn ${theme}`}
                  style={{
                    background: theme === 'dark' ? 'var(--create-button-bg)' : 'var(--create-button-bg)',
                    color: 'var(--button-text-dark)',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                    transition: 'background 0.3s ease',
                    marginLeft: '10px',
                  }}
                >
                  Abrir Pruebaaa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && selectedService && (
        <GroupClassesPopup
          service={selectedService}
          onClose={handleClosePopup}
        />
      )}

      {isPruebaaaOpen && selectedService && (
        <Pruebaaa
          service={selectedService}
          theme={theme}
          onClose={handleClosePruebaaa}
        />
      )}
    </div>
  );
};

export default GroupClassesLista;
