import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Icon } from 'react-icons-kit';
import { angleUp } from 'react-icons-kit/fa/angleUp';
import { angleDown } from 'react-icons-kit/fa/angleDown';
import styles from './Modaltransferenciarutinas.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const Modaltransferenciarutinas = ({ show, onClose, days }) => {
  const [targetRoutineId, setTargetRoutineId] = useState('');
  const [routines, setRoutines] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [targetDays, setTargetDays] = useState([]);
  const [collapsedWeeks, setCollapsedWeeks] = useState({});

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/routines`);
        console.log('Fetched routines:', response.data);
        setRoutines(response.data);
      } catch (error) {
        console.error('Error fetching routines:', error);
      }
    };

    fetchRoutines();
  }, []);

  const handleRoutineSelect = async (routineId) => {
    setTargetRoutineId(routineId);
    console.log('Selected routine ID:', routineId);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/routines/${routineId}`);
      console.log('Fetched weeks for selected routine:', response.data.semanas);
      setWeeks(response.data.semanas);
    } catch (error) {
      console.error('Error fetching routine weeks:', error);
    }
  };

  const handleTransfer = async () => {
    const selectedTransferDays = transferData.filter(day => day.isSelected);
    const selectedTargetDays = targetDays.filter(day => day.isSelected);

    console.log('Transfer data before sending:', selectedTransferDays);
    console.log('Target days before sending:', selectedTargetDays);

    try {
      await axios.post(`${API_BASE_URL}/api/routines/transfer`, {
        targetRoutineId,
        transferDays: selectedTransferDays,
        targetDays: selectedTargetDays
      });
      onClose();
    } catch (error) {
      console.error('Error transferring days:', error);
    }
  };


  const handleDayCheckboxChange = (dayId, weekId, isChecked) => {
    const uniqueDayId = `${weekId}-${dayId}`;
    console.log(`Day checkbox changed: ${uniqueDayId}, checked: ${isChecked}`);

    setTransferData(prevState => {
      const dayExists = prevState.some(day => day.id === uniqueDayId);
      const updatedTransferData = dayExists
        ? prevState.map(day => (day.id === uniqueDayId ? { ...day, isSelected: isChecked } : day))
        : [...prevState, { ...days.find(day => day.id === dayId), id: uniqueDayId, weekId, isSelected: isChecked, targetWeek: '', targetDay: '' }];
      console.log('Updated transfer data:', updatedTransferData);
      return updatedTransferData;
    });

    setTargetDays(prevState => {
      const dayExists = prevState.some(day => day.id === uniqueDayId);
      const updatedTargetDays = dayExists
        ? prevState.map(day => (day.id === uniqueDayId ? { ...day, isSelected: isChecked } : day))
        : [...prevState, { id: dayId, weekId, isSelected: isChecked, targetWeek: '', targetDay: '' }];
      console.log('Updated target days:', updatedTargetDays);
      return updatedTargetDays;
    });
  };

  const handleWeekCheckboxChange = (weekId, isChecked) => {
    console.log(`Week checkbox changed: ${weekId}, checked: ${isChecked}`);
    setWeeks(prevState => prevState.map(week =>
      week.id === weekId ? { ...week, isSelected: isChecked } : week
    ));

    setTransferData(prevState => {
      let updatedData = prevState.map(day =>
        day.weekId === weekId ? { ...day, isSelected: isChecked } : day
      );

      if (isChecked) {
        const weekData = weeks.find(week => week.id === weekId);
        weekData.dias.forEach(day => {
          const uniqueDayId = `${weekId}-${day.id}`;
          if (!prevState.some(d => d.id === uniqueDayId)) {
            updatedData.push({ ...day, id: uniqueDayId, weekId, isSelected: isChecked, targetWeek: '', targetDay: '' });
          }
        });
      }

      console.log('Updated transfer data after week change:', updatedData);
      return updatedData;
    });

    setTargetDays(prevState => {
      let updatedData = prevState.map(day =>
        day.weekId === weekId ? { ...day, isSelected: isChecked } : day
      );

      if (isChecked) {
        const weekData = weeks.find(week => week.id === weekId);
        weekData.dias.forEach(day => {
          const uniqueDayId = `${weekId}-${day.id}`;
          if (!prevState.some(d => d.id === uniqueDayId)) {
            updatedData.push({ id: day.id, weekId, isSelected: isChecked, targetWeek: '', targetDay: '' });
          }
        });
      }

      console.log('Updated target days after week change:', updatedData);
      return updatedData;
    });
  };

  const toggleWeekCollapse = (weekId) => {
    setCollapsedWeeks(prevState => ({
      ...prevState,
      [weekId]: !prevState[weekId]
    }));
  };

  useEffect(() => {
    console.log('Initial days for transfer:', days);
    setTransferData(days.map(day => ({
      ...day,
      id: day.id,
      isSelected: false,
      targetWeek: '',
      targetDay: ''
    })));
  }, [days]);

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Transferir archivos a otra rutina</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formRoutineSelect">
            <Form.Label>Seleccionar Rutina</Form.Label>
            <Form.Control as="select" value={targetRoutineId} onChange={(e) => handleRoutineSelect(e.target.value)}>
              <option value="">Seleccione una rutina</option>
              {routines.map(routine => (
                <option key={routine._id} value={routine._id}>
                  {routine.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {weeks.length > 0 && (
            <div className={styles.mtWeeksContainer}>
              {weeks.map(week => (
                <div key={week.id} className={styles.mtWeek}>
                  <div className={styles.mtWeekHeader}>
                    <Form.Check 
                      type="checkbox" 
                      label={`Semana ${week.nombre}`} 
                      checked={week.isSelected || false}
                      onChange={(e) => handleWeekCheckboxChange(week.id, e.target.checked)}
                    />
                    <Button variant="link" onClick={() => toggleWeekCollapse(week.id)}>
                      <Icon icon={collapsedWeeks[week.id] ? angleDown : angleUp} />
                    </Button>
                  </div>
                  {!collapsedWeeks[week.id] && (
                    <div className={styles.mtDaysContainer}>
                      {week.dias.map((day, dayIndex) => (
                        <div key={`${week.id}-${day.id}`} className={styles.mtDayCheckbox}>
                          <Form.Check 
                            type="checkbox" 
                            label={`Día ${dayIndex + 1}`} 
                            checked={transferData.some(d => d.id === `${week.id}-${day.id}` && d.isSelected)}
                            onChange={(e) => handleDayCheckboxChange(day.id, week.id, e.target.checked)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleTransfer}>
          Transferir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Modaltransferenciarutinas;
