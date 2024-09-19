import React, { useState, useEffect } from 'react';
import './ModalCreacionEjercicio.css';
import { toast } from 'react-toastify';

const ModalCreacionEjercicio = ({ isOpen, onClose, addExercise, updateExercise, currentExercise, theme }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [grupoMuscular, setGrupoMuscular] = useState([]);
  const [equipamiento, setEquipamiento] = useState([]);
  const [videoTutorial, setVideoTutorial] = useState('');
  const [autor, setAutor] = useState('');

  useEffect(() => {
    if (currentExercise) {
      setNombre(currentExercise.nombre);
      setDescripcion(currentExercise.descripcion);
      setGrupoMuscular(currentExercise.grupoMuscular);
      setEquipamiento(currentExercise.equipamiento);
      setVideoTutorial(currentExercise.videoTutorial);
      setAutor(currentExercise.autor);
    } else {
      setNombre('');
      setDescripcion('');
      setGrupoMuscular([]);
      setEquipamiento([]);
      setVideoTutorial('');
      setAutor('');
    }
  }, [currentExercise]);

  if (!isOpen) return null;

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };

  const handleGrupoMuscularChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setGrupoMuscular([...grupoMuscular, value]);
    } else {
      setGrupoMuscular(grupoMuscular.filter((grupo) => grupo !== value));
    }
  };

  const handleEquipamientoChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEquipamiento([...equipamiento, value]);
    } else {
      setEquipamiento(equipamiento.filter((item) => item !== value));
    }
  };

  const handleVideoTutorialChange = (e) => {
    setVideoTutorial(e.target.value);
  };

  const handleAutorChange = (e) => {
    setAutor(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExercise = { nombre, descripcion, grupoMuscular, equipamiento, videoTutorial, autor };

    try {
      const response = await fetch(currentExercise ? `/api/exercises/${currentExercise._id}` : '/api/exercises', {
        method: currentExercise ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExercise),
      });

      if (response.ok) {
        const createdOrUpdatedExercise = await response.json();
        if (currentExercise) {
          updateExercise(createdOrUpdatedExercise);
        } else {
          addExercise(createdOrUpdatedExercise);
        }
        onClose();
      } else {
        console.error('Failed to save exercise');
        toast.error('Error al guardar el ejercicio');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el ejercicio');
    }
  };

  return (
    <div className="modal-creacion-ejercicio-overlay">
      <div className={`modal-creacion-ejercicio ${theme}`}>
        <h2 className={theme}>{currentExercise ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className={theme}>Nombre del ejercicio</label>
            <input type="text" value={nombre} onChange={handleNombreChange} className={theme} />
          </div>
          <div>
            <label className={theme}>Descripción</label>
            <textarea value={descripcion} onChange={handleDescripcionChange} className={theme}></textarea>
          </div>
          <div>
  <label className={theme}>Grupo Muscular</label>
  <div className="checkbox-group single-column">
    <label className={theme}>
      <input
        type="checkbox"
        value="Soleo"
        checked={grupoMuscular.includes('Soleo')}
        onChange={handleGrupoMuscularChange}
      />
      Soleo
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Gemelo"
        checked={grupoMuscular.includes('Gemelo')}
        onChange={handleGrupoMuscularChange}
      />
      Gemelo
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Triceps femoral"
        checked={grupoMuscular.includes('Triceps femoral')}
        onChange={handleGrupoMuscularChange}
      />
      Triceps femoral
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Abductor"
        checked={grupoMuscular.includes('Abductor')}
        onChange={handleGrupoMuscularChange}
      />
      Abductor
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Gluteo"
        checked={grupoMuscular.includes('Gluteo')}
        onChange={handleGrupoMuscularChange}
      />
      Gluteo
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Abdominales"
        checked={grupoMuscular.includes('Abdominales')}
        onChange={handleGrupoMuscularChange}
      />
      Abdominales
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Lumbar"
        checked={grupoMuscular.includes('Lumbar')}
        onChange={handleGrupoMuscularChange}
      />
      Lumbar
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Dorsales"
        checked={grupoMuscular.includes('Dorsales')}
        onChange={handleGrupoMuscularChange}
      />
      Dorsales
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Trapecio"
        checked={grupoMuscular.includes('Trapecio')}
        onChange={handleGrupoMuscularChange}
      />
      Trapecio
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Hombro"
        checked={grupoMuscular.includes('Hombro')}
        onChange={handleGrupoMuscularChange}
      />
      Hombro
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Hombro anterior"
        checked={grupoMuscular.includes('Hombro anterior')}
        onChange={handleGrupoMuscularChange}
      />
      Hombro anterior
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Hombro lateral"
        checked={grupoMuscular.includes('Hombro lateral')}
        onChange={handleGrupoMuscularChange}
      />
      Hombro lateral
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Hombro posterior"
        checked={grupoMuscular.includes('Hombro posterior')}
        onChange={handleGrupoMuscularChange}
      />
      Hombro posterior
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Pecho"
        checked={grupoMuscular.includes('Pecho')}
        onChange={handleGrupoMuscularChange}
      />
      Pecho
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Triceps"
        checked={grupoMuscular.includes('Triceps')}
        onChange={handleGrupoMuscularChange}
      />
      Triceps
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Biceps"
        checked={grupoMuscular.includes('Biceps')}
        onChange={handleGrupoMuscularChange}
      />
      Biceps
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Cuello"
        checked={grupoMuscular.includes('Cuello')}
        onChange={handleGrupoMuscularChange}
      />
      Cuello
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Antebrazo"
        checked={grupoMuscular.includes('Antebrazo')}
        onChange={handleGrupoMuscularChange}
      />
      Antebrazo
    </label>
  </div>
</div>










<div>
  <label className={theme}>Equipamiento Necesario</label>
  <div className={`checkbox-group ${theme}`}>
    <label className={theme}>
      <input
        type="checkbox"
        value="Pesas"
        checked={equipamiento.includes('Pesas')}
        onChange={handleEquipamientoChange}
      />
      Pesas
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Mancuernas"
        checked={equipamiento.includes('Mancuernas')}
        onChange={handleEquipamientoChange}
      />
      Mancuernas
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Barra"
        checked={equipamiento.includes('Barra')}
        onChange={handleEquipamientoChange}
      />
      Barra
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Kettlebell"
        checked={equipamiento.includes('Kettlebell')}
        onChange={handleEquipamientoChange}
      />
      Kettlebell
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Banda de resistencia"
        checked={equipamiento.includes('Banda de resistencia')}
        onChange={handleEquipamientoChange}
      />
      Banda de resistencia
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Esterilla"
        checked={equipamiento.includes('Esterilla')}
        onChange={handleEquipamientoChange}
      />
      Esterilla
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Banco"
        checked={equipamiento.includes('Banco')}
        onChange={handleEquipamientoChange}
      />
      Banco
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Máquina de cable"
        checked={equipamiento.includes('Máquina de cable')}
        onChange={handleEquipamientoChange}
      />
      Máquina de cable
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="TRX"
        checked={equipamiento.includes('TRX')}
        onChange={handleEquipamientoChange}
      />
      TRX
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Rueda de abdominales"
        checked={equipamiento.includes('Rueda de abdominales')}
        onChange={handleEquipamientoChange}
      />
      Rueda de abdominales
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Cuerda para saltar"
        checked={equipamiento.includes('Cuerda para saltar')}
        onChange={handleEquipamientoChange}
      />
      Cuerda para saltar
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Balón medicinal"
        checked={equipamiento.includes('Balón medicinal')}
        onChange={handleEquipamientoChange}
      />
      Balón medicinal
    </label>
    <label className={theme}>
      <input
        type="checkbox"
        value="Plataforma de step"
        checked={equipamiento.includes('Plataforma de step')}
        onChange={handleEquipamientoChange}
      />
      Plataforma de step
    </label>
  </div>
</div>








          <div>
  <label className={theme}>Link video tutorial</label>
  <input type="url" value={videoTutorial} onChange={handleVideoTutorialChange} className={theme} />
</div>

<div className="button-group">
  <button type="submit" className={`crear-btn ${theme}`}>{currentExercise ? 'Guardar Cambios' : 'Crear'}</button>
  <button onClick={onClose} className={`cerrar-btn ${theme}`}>Cerrar</button>
</div>
        </form>

      </div>
    </div>
  );
};

export default ModalCreacionEjercicio;
