import React, { useState, useEffect, useRef } from 'react';
import './Chatesqueleto.css'; // Importamos el archivo de estilos

const Chatesqueleto = ({ onClose, onSubmit }) => {
  const [numPeriods, setNumPeriods] = useState('');
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
  const [periods, setPeriods] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentStart, setCurrentStart] = useState({ weekIndex: '', dayIndex: '' });
  const [currentEnd, setCurrentEnd] = useState({ weekIndex: '', dayIndex: '' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Iniciar la conversación
    setMessages([
      { sender: 'bot', text: 'Hola, te ayudaré a configurar tus periodos. ¿Cuántos periodos quieres tener?' },
    ]);
  }, []);

  useEffect(() => {
    // Desplazar hacia el último mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    if (text.trim() === '') return;

    setMessages([...messages, { sender: 'user', text }]);

    if (periods.length === 0) {
      // Usuario ingresa el número de periodos
      const num = parseInt(text);
      if (isNaN(num) || num <= 0) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Por favor, ingresa un número válido de periodos.' },
        ]);
      } else {
        setNumPeriods(num);
        setPeriods(Array.from({ length: num }, () => ({ start: null, end: null })));
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: `Perfecto, configuraremos ${num} periodos.` },
          { sender: 'bot', text: `Periodo 1: Ingresa la semana de inicio (número).` },
        ]);
      }
    } else {
      // Configurando periodos
      const currentPeriod = periods[currentPeriodIndex];

      if (currentStart.weekIndex === '') {
        // Esperando semana de inicio
        const weekIndex = parseInt(text);
        if (isNaN(weekIndex) || weekIndex <= 0) {
          setMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Por favor, ingresa una semana de inicio válida (número).' },
          ]);
        } else {
          setCurrentStart({ ...currentStart, weekIndex: weekIndex - 1 });
          setMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Ahora, ingresa el día de inicio (1-7).' },
          ]);
        }
      } else if (currentStart.dayIndex === '') {
        // Esperando día de inicio
        const dayIndex = parseInt(text);
        if (isNaN(dayIndex) || dayIndex < 1 || dayIndex > 7) {
          setMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Por favor, ingresa un día de inicio válido (1-7).' },
          ]);
        } else {
          setCurrentStart({ ...currentStart, dayIndex: dayIndex - 1 });
          setMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Ingresa la semana de fin (número).' },
          ]);
        }
      } else if (currentEnd.weekIndex === '') {
        // Esperando semana de fin
        const weekIndex = parseInt(text);
        if (isNaN(weekIndex) || weekIndex <= 0) {
          setMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Por favor, ingresa una semana de fin válida (número).' },
          ]);
        } else {
          setCurrentEnd({ ...currentEnd, weekIndex: weekIndex - 1 });
          setMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Ahora, ingresa el día de fin (1-7).' },
          ]);
        }
      } else if (currentEnd.dayIndex === '') {
        // Esperando día de fin
        const dayIndex = parseInt(text);
        if (isNaN(dayIndex) || dayIndex < 1 || dayIndex > 7) {
          setMessages((prev) => [
            ...prev,
            { sender: 'bot', text: 'Por favor, ingresa un día de fin válido (1-7).' },
          ]);
        } else {
          setCurrentEnd({ ...currentEnd, dayIndex: dayIndex - 1 });
          // Guardamos el periodo
          const newPeriods = [...periods];
          newPeriods[currentPeriodIndex] = {
            start: { ...currentStart },
            end: { ...currentEnd },
            color: null, // El color se asignará en Esqueletopopup
          };
          setPeriods(newPeriods);

          // Reiniciamos los estados temporales
          setCurrentStart({ weekIndex: '', dayIndex: '' });
          setCurrentEnd({ weekIndex: '', dayIndex: '' });

          if (currentPeriodIndex + 1 < numPeriods) {
            // Pasamos al siguiente periodo
            setCurrentPeriodIndex(currentPeriodIndex + 1);
            setMessages((prev) => [
              ...prev,
              { sender: 'bot', text: `Periodo ${currentPeriodIndex + 2}: Ingresa la semana de inicio (número).` },
            ]);
          } else {
            // Todos los periodos han sido ingresados
            setMessages((prev) => [
              ...prev,
              { sender: 'bot', text: '¡Listo! Hemos configurado todos tus periodos.' },
            ]);
            // Enviamos los periodos al componente padre usando newPeriods
            setTimeout(() => {
              onSubmit(newPeriods); // Usamos newPeriods en lugar de periods
              onClose();
            }, 2000);
          }
        }
      }
    }
  };

  return (
    <div className="chat-overlay">
      <div className="chat-container" style={{height:'80%',
        width:'66%'
      }}>
        <div className="chat-header" style={{
          backgroundColor:'#236dc9',
          color:'white',
        }}>
          <h2>Asistente de Configuración</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.sender === 'user' ? 'user' : 'bot'}`}
            >
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
};

const ChatInput = ({ onSend }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(inputText);
    setInputText('');
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Escribe tu respuesta..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button type="submit"
      style={{position: 'static'}}
      >Enviar</button>
    </form>
  );
};

export default Chatesqueleto;
