import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import styles from '../pages/EditRoutinePage.module.css';

const MenuEjercicio = ({ mostrar, manejarCierre, alAgregarEjercicio,theme }) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
  const [nuevoTituloEjercicio, setNuevoTituloEjercicio] = useState('');
  const [nuevoGrupoEjercicio, setNuevoGrupoEjercicio] = useState('');

  useEffect(() => {
    const obtenerEjercicios = async () => {
      try {
        const respuesta = await fetch('/api/exercises');
        const datos = await respuesta.json();
        setEjercicios(datos);
        setEjerciciosFiltrados(datos);
      } catch (error) {
        console.error('Error al obtener ejercicios:', error);
      }
    };

    obtenerEjercicios();
  }, []);

  useEffect(() => {
    filtrarEjercicios();
  }, [terminoBusqueda, grupoSeleccionado, ejercicios]);

  const filtrarEjercicios = () => {
    let filtrados = ejercicios;

    if (terminoBusqueda) {
      filtrados = filtrados.filter(ejercicio =>
        ejercicio.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
    }

    if (grupoSeleccionado) {
      filtrados = filtrados.filter(ejercicio =>
        ejercicio.grupoMuscular.includes(grupoSeleccionado)
      );
    }

    setEjerciciosFiltrados(filtrados);
  };

  const manejarCambioBusqueda = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  const manejarCambioGrupo = (e) => {
    setGrupoSeleccionado(e.target.value);
  };

  const manejarCambioNuevoGrupoEjercicio = (e) => {
    setNuevoGrupoEjercicio(e.target.value);
  };

  const manejarClickAgregarEjercicio = (ejercicio) => {
    alAgregarEjercicio(ejercicio);
    manejarCierre();
  };

  const manejarCrearEjercicio = () => {
    if (nuevoTituloEjercicio.trim() && nuevoGrupoEjercicio) {
      const nuevoEjercicio = {
        _id: `nuevo-${Math.random().toString(36).substr(2, 9)}`,
        nombre: nuevoTituloEjercicio,
        grupoMuscular: [nuevoGrupoEjercicio],
        imgUrl: '',
        descripcion: '',
        equipamiento: [],
        videoTutorial: '',
        autor: 'Usuario'
      };
      alAgregarEjercicio(nuevoEjercicio);
      manejarCierre();
    }
  };

  const obtenerGruposMusculares = () => {
    const grupos = new Set();
    ejercicios.forEach(ejercicio => {
      ejercicio.grupoMuscular.forEach(grupo => grupos.add(grupo));
    });
    return Array.from(grupos);
  };

  return (
    <Modal show={mostrar} onHide={manejarCierre}>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Ejercicio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="terminoBusqueda">
            <Form.Label>Buscar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar un ejercicio"
              value={terminoBusqueda}
              onChange={manejarCambioBusqueda}
            />
          </Form.Group>
          <Form.Group controlId="grupoSeleccionado">
            <Form.Label>Grupo Muscular</Form.Label>
            <Form.Control as="select" value={grupoSeleccionado} onChange={manejarCambioGrupo}>
              <option value="">Todos</option>
              {obtenerGruposMusculares().map(grupo => (
                <option key={grupo} value={grupo}>{grupo}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="nuevoTituloEjercicio">
            <Form.Label>Crear Nuevo Ejercicio</Form.Label>
            <Row>
              <Col xs={8}>
                <Form.Control
                  type="text"
                  placeholder="Título del ejercicio"
                  value={nuevoTituloEjercicio}
                  onChange={(e) => setNuevoTituloEjercicio(e.target.value)}
                />
              </Col>
              <Col xs={4}>
                <Form.Control as="select" value={nuevoGrupoEjercicio} onChange={manejarCambioNuevoGrupoEjercicio}>
                  <option value="">Seleccionar Grupo Muscular</option>
                  {obtenerGruposMusculares().map(grupo => (
                    <option key={grupo} value={grupo}>{grupo}</option>
                  ))}
                </Form.Control>
              </Col>
            </Row>
            <Button variant="primary" onClick={manejarCrearEjercicio} className="mt-2"
            style={{
              background:'var(--create-button-bg)', 
              color:  'var(--button-text-dark)' ,
              border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background 0.3s ease',
            }}
>Crear</Button>
          </Form.Group>
        </Form>
        {ejerciciosFiltrados.map((ejercicio) => (
          <div key={ejercicio._id}>
            <h5>{ejercicio.grupoMuscular.join(', ')}</h5>
            <div className={styles.exerciseItem} onClick={() => manejarClickAgregarEjercicio(ejercicio)}>
              <img src={ejercicio.imgUrl} alt={ejercicio.nombre} />
              <span>{ejercicio.nombre}</span>
            </div>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={manejarCierre}
        style={{
          background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
          color:  'var(--button-text-dark)' ,
          border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background 0.3s ease',
        }}
        >Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MenuEjercicio;
