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
      <table className="GroupClassesLista-tabla-servicios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {groupClasses.map((service) => (
            <tr key={service._id}>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>
                {service.subtipo && service.subtipo.length > 0
                  ? service.subtipo[0].price
                  : 'N/A'}
              </td>
              <td>{service.type}</td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => handleOpenPopup(service)}
                  className="GroupClassesLista-ver-detalles-btn"
                >
                  Ver Detalles
                </Button>
                <Button
                  variant="black"
                  onClick={() => handleOpenPruebaaa(service)}
                  className="GroupClassesLista-pruebaaa-btn"
                >
                  Abrir Pruebaaa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && selectedService && (
        <GroupClassesPopup service={selectedService} onClose={handleClosePopup} />
      )}

      {isPruebaaaOpen && selectedService && (
        <Pruebaaa service={selectedService} onClose={handleClosePruebaaa} />
      )}
    </div>
  );
};

export default GroupClassesLista;
