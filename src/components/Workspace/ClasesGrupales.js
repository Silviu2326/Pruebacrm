import React, { useState, useEffect } from 'react';
import './ClasesGrupales.css';

const ClasesGrupales = () => {
    const [tipoCreacion, setTipoCreacion] = useState('nueva'); 
    const [claseSeleccionada, setClaseSeleccionada] = useState(''); 
    const [nombreClase, setNombreClase] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [maxParticipantes, setMaxParticipantes] = useState('');
    const [cobroTipo, setCobroTipo] = useState('fijo');
    const [precio, setPrecio] = useState('');
    const [frecuenciaCobro, setFrecuenciaCobro] = useState('mensual');
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [duracionIndefinida, setDuracionIndefinida] = useState(false);
    const [duracionMeses, setDuracionMeses] = useState('');
    const [paqueteSesiones, setPaqueteSesiones] = useState(1);
    const [informacionPagos, setInformacionPagos] = useState([]);

    const clasesDisponibles = [
        { id: 'clase1', nombre: 'Yoga Avanzado', descripcion: 'Clases intensivas de yoga avanzado', maxParticipantes: 20 },
        { id: 'clase2', nombre: 'Pilates Básico', descripcion: 'Curso de pilates para principiantes', maxParticipantes: 15 },
        { id: 'clase3', nombre: 'Crossfit', descripcion: 'Entrenamiento de alta intensidad en grupo', maxParticipantes: 25 }
    ];

    const handleTipoCobroChange = (tipo) => {
        setCobroTipo(tipo);
    };

    const handleClaseSeleccionada = (e) => {
        const seleccionada = clasesDisponibles.find(clase => clase.id === e.target.value);
        if (seleccionada) {
            setClaseSeleccionada(seleccionada.id);
            setNombreClase(seleccionada.nombre);
            setDescripcion(seleccionada.descripcion);
            setMaxParticipantes(seleccionada.maxParticipantes);
        }
    };

    useEffect(() => {
        const calcularInformacionPagos = () => {
            const pagos = [];
            const fecha = new Date(fechaInicio);
            let frecuenciaDias;

            switch (frecuenciaCobro) {
                case 'semanal':
                    frecuenciaDias = 7;
                    break;
                case 'mensual':
                    frecuenciaDias = 30;
                    break;
                case '3_meses':
                    frecuenciaDias = 90;
                    break;
                case '6_meses':
                    frecuenciaDias = 180;
                    break;
                case 'anual':
                    frecuenciaDias = 365;
                    break;
                default:
                    frecuenciaDias = 30;
            }

            if (cobroTipo === 'fijo') {
                const numeroPagos = duracionIndefinida 
                    ? 12 
                    : Math.ceil((parseInt(duracionMeses) || 0) / (frecuenciaDias / 30));
                
                for (let i = 0; i < numeroPagos; i++) { 
                    pagos.push({
                        fecha: new Date(fecha.getTime() + (frecuenciaDias * i * 24 * 60 * 60 * 1000)).toLocaleDateString(),
                        monto: `${precio}€`
                    });
                }
            } else if (cobroTipo === 'por_sesion') {
                pagos.push({ mensaje: `Cada sesión tiene un costo de ${precio}€` });
            } else if (cobroTipo === 'paquete_sesiones') {
                pagos.push({ mensaje: `El paquete de ${paqueteSesiones} sesiones cuesta ${precio}€` });
            }

            return pagos;
        };

        setInformacionPagos(calcularInformacionPagos());
    }, [cobroTipo, precio, frecuenciaCobro, fechaInicio, duracionIndefinida, duracionMeses, paqueteSesiones]);

    return (
        <div className="Clasegrupal-container">
            <h1>{tipoCreacion === 'nueva' ? 'Crear Clase Grupal' : 'Importar Clase Grupal'}</h1>
            
            <div className="Clasegrupal-field">
                <label>Tipo de Creación</label>
                <select value={tipoCreacion} onChange={(e) => setTipoCreacion(e.target.value)}>
                    <option value="nueva">Nueva Clase Grupal</option>
                    <option value="importar">Importar Clase Grupal</option>
                </select>
            </div>

            {tipoCreacion === 'nueva' ? (
                <>
                    <div className="Clasegrupal-field">
                        <label>Nombre de la Clase</label>
                        <input
                            type="text"
                            value={nombreClase}
                            onChange={(e) => setNombreClase(e.target.value)}
                            placeholder="Ingresa el nombre de la clase"
                        />
                    </div>

                    <div className="Clasegrupal-field">
                        <label>Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Ingresa una descripción de la clase"
                            rows="3"
                        />
                    </div>

                    <div className="Clasegrupal-field">
                        <label>Número Máximo de Participantes</label>
                        <input
                            type="number"
                            value={maxParticipantes}
                            onChange={(e) => setMaxParticipantes(e.target.value)}
                            placeholder="Máximo número de participantes"
                        />
                    </div>
                </>
            ) : (
                <div className="Clasegrupal-field">
                    <label>Seleccionar Clase para Importar</label>
                    <select value={claseSeleccionada} onChange={handleClaseSeleccionada}>
                        <option value="" disabled>Selecciona una clase</option>
                        {clasesDisponibles.map((clase) => (
                            <option key={clase.id} value={clase.id}>
                                {clase.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <h2>Opciones de Cobro</h2>
            <div className="Clasegrupal-tipo-cobro-buttons">
                <button
                    className={cobroTipo === 'fijo' ? "Clasegrupal-active" : ""}
                    onClick={() => handleTipoCobroChange('fijo')}
                >
                    Fijo
                </button>
                <button
                    className={cobroTipo === 'por_sesion' ? "Clasegrupal-active" : ""}
                    onClick={() => handleTipoCobroChange('por_sesion')}
                >
                    Por Sesión
                </button>
                <button
                    className={cobroTipo === 'paquete_sesiones' ? "Clasegrupal-active" : ""}
                    onClick={() => handleTipoCobroChange('paquete_sesiones')}
                >
                    Paquete de Sesiones
                </button>
            </div>

            {cobroTipo === 'fijo' && (
                <>
                    <div className="Clasegrupal-botones-duracion">
                        <button
                            className={!duracionIndefinida ? "Clasegrupal-active" : ""}
                            onClick={() => setDuracionIndefinida(false)}
                        >
                            Duración Determinada
                        </button>
                        <button
                            className={duracionIndefinida ? "Clasegrupal-active" : ""}
                            onClick={() => setDuracionIndefinida(true)}
                        >
                            Duración Indeterminada
                        </button>
                    </div>

                    {!duracionIndefinida && (
                        <div className="Clasegrupal-field">
                            <label>Duración (en meses)</label>
                            <input
                                type="number"
                                value={duracionMeses}
                                onChange={(e) => setDuracionMeses(e.target.value)}
                                placeholder="Ejemplo: 3 meses"
                            />
                        </div>
                    )}

                    <div className="Clasegrupal-field">
                        <label>Precio</label>
                        <input
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            placeholder="Ejemplo: 50€"
                        />
                    </div>

                    <div className="Clasegrupal-field">
                        <label>Frecuencia de Cobro</label>
                        <select value={frecuenciaCobro} onChange={(e) => setFrecuenciaCobro(e.target.value)}>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                            <option value="3_meses">Cada 3 meses</option>
                            <option value="6_meses">Cada 6 meses</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>

                    <div className="Clasegrupal-field">
                        <label>Fecha de Inicio</label>
                        <input
                            type="date"
                            value={fechaInicio.toISOString().split('T')[0]}
                            onChange={(e) => setFechaInicio(new Date(e.target.value))}
                        />
                    </div>
                </>
            )}

            {cobroTipo === 'por_sesion' && (
                <div className="Clasegrupal-field">
                    <label>Precio por Sesión</label>
                    <input
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        placeholder="Ejemplo: 10€/sesión"
                    />
                </div>
            )}

            {cobroTipo === 'paquete_sesiones' && (
                <>
                    <div className="Clasegrupal-field">
                        <label>Precio por Paquete</label>
                        <input
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            placeholder="Ejemplo: 80€ por 10 sesiones"
                        />
                    </div>
                    <div className="Clasegrupal-field">
                        <label>Sesiones por Paquete</label>
                        <input
                            type="number"
                            value={paqueteSesiones}
                            onChange={(e) => setPaqueteSesiones(e.target.value)}
                            placeholder="Ejemplo: 10 sesiones"
                        />
                    </div>
                </>
            )}

            {/* Información de los Pagos */}
            <div className="Clasegrupal-info-pagos">
                <h3>Información de Pagos</h3>
                {informacionPagos.length > 0 ? (
                    informacionPagos.map((pago, index) => (
                        <div key={index}>
                            {pago.fecha ? (
                                <p>Pago {index + 1}: {pago.fecha} - {pago.monto}</p>
                            ) : (
                                <p>{pago.mensaje}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No hay información de pagos disponible.</p>
                )}
            </div>

            <div className="Clasegrupal-crear-button-container">
                <button className="Clasegrupal-crear-button">
                    {tipoCreacion === 'nueva' ? 'Crear Clase Grupal' : 'Importar Clase'}
                </button>
            </div>
        </div>
    );
};

export default ClasesGrupales;
