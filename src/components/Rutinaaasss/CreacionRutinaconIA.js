import React, { useState, useEffect } from 'react';
import './CreacionRutinaconIA.css'; // Importamos el CSS correspondiente

const CreacionRutinaconIA = ({ onClose, theme }) => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [sexo, setSexo] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [nivel, setNivel] = useState('principiante');
  const [lesiones, setLesiones] = useState('');
  const [preferencias, setPreferencias] = useState('');
  const [espacio, setEspacio] = useState('gimnasio');
  const [equipo, setEquipo] = useState('');
  const [dias, setDias] = useState(3);
  const [duracion, setDuracion] = useState(60);
  const [intensidad, setIntensidad] = useState('moderada');
  const [horario, setHorario] = useState('mañana');

  useEffect(() => {
    // Llamada a la API para obtener la lista de clientes
    fetch('http://localhost:5005/api/clientes')
      .then(response => response.json())
      .then(data => setClientes(data))
      .catch(error => console.error('Error al cargar los datos de los clientes:', error));
  }, []);

  const handleClienteSeleccionado = (e) => {
    const clienteId = e.target.value;
    const cliente = clientes.find(cli => cli._id === clienteId);
    setClienteSeleccionado(cliente);
    if (cliente) {
      setSexo(cliente.genero === 'Masculino' ? 'hombre' : 'mujer');
      setEdad(cliente.edad);
      setPeso(cliente.peso);
      setAltura(cliente.altura);
      // Aquí podrías mapear el objetivo si está disponible
      setObjetivo(cliente.objetivos.length > 0 ? cliente.objetivos[0] : '');
    }
  };

  const handleGenerateRoutine = () => {
    const rutina = {
      sexo,
      edad,
      peso,
      altura,
      objetivo,
      nivel,
      lesiones,
      preferencias,
      espacio,
      equipo,
      dias,
      duracion,
      intensidad,
      horario,
    };
    console.log('Generando rutina con IA...', rutina);
    onClose();
  };

  return (
    <div className={`ia-modal ${theme}`}>
      <div className={`ia-modal-content ${theme}`}>
        <button className="close" onClick={onClose}>&times;</button>
        <h2>Crear Rutina con IA</h2>

        <div className="form-group">
          <label>Seleccionar Cliente:</label>
          <select onChange={handleClienteSeleccionado}>
            <option value="">Selecciona un cliente</option>
            {clientes.map(cliente => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* No renderizamos los campos de Sexo, Edad, Peso, Altura y Objetivo */}
        
        <div className="form-group">
          <label>Nivel de Experiencia:</label>
          <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>

        <div className="form-group">
          <label>Historial de Lesiones o Problemas de Salud:</label>
          <textarea 
            value={lesiones} 
            onChange={(e) => setLesiones(e.target.value)}
            placeholder="Ej. Problemas de rodilla, hipertensión..."
          ></textarea>
        </div>

        <div className="form-group">
          <label>Preferencias de Entrenamiento:</label>
          <textarea 
            value={preferencias} 
            onChange={(e) => setPreferencias(e.target.value)}
            placeholder="Ej. No hacer ejercicios de pierna..."
          ></textarea>
        </div>

        <div className="form-group">
          <label>Acceso a Espacios de Entrenamiento:</label>
          <select value={espacio} onChange={(e) => setEspacio(e.target.value)}>
            <option value="gimnasio">Gimnasio</option>
            <option value="casa">Casa</option>
            <option value="parque">Parque</option>
            <option value="estudio">Estudio de Yoga</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tipo de Equipo Disponible:</label>
          <textarea 
            value={equipo} 
            onChange={(e) => setEquipo(e.target.value)}
            placeholder="Ej. Mancuernas, bandas elásticas..."
          ></textarea>
        </div>

  

        <div className="form-group">
          <label>Duración de la Sesión (minutos):</label>
          <input 
            type="number" 
            value={duracion} 
            onChange={(e) => setDuracion(e.target.value)} 
            min="10" 
            max="120" 
          />
        </div>

        <div className="form-group">
          <label>Nivel de Intensidad:</label>
          <select value={intensidad} onChange={(e) => setIntensidad(e.target.value)}>
            <option value="baja">Baja</option>
            <option value="moderada">Moderada</option>
            <option value="alta">Alta</option>
          </select>
        </div>

       

        <button className="generate-btn" onClick={handleGenerateRoutine}>
          Generar Rutina
        </button>
      </div>
    </div>
  );
};

export default CreacionRutinaconIA;
