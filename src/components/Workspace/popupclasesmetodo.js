import React, { useState, useEffect } from 'react';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import "./PopupClasesMetodo.css";

const PopupClasesMetodo = ({ onClose }) => {
    const [cobroTipo, setCobroTipo] = useState('fijo');
    const [precio, setPrecio] = useState('');
    const [frecuenciaCobro, setFrecuenciaCobro] = useState('mensual');
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [duracionIndefinida, setDuracionIndefinida] = useState(false);
    const [duracionMeses, setDuracionMeses] = useState('');
    const [paqueteSesiones, setPaqueteSesiones] = useState(1);
    const [informacionPagos, setInformacionPagos] = useState([]);

    const handleTipoCobroChange = (tipo) => {
        setCobroTipo(tipo);
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
        <div className="Popupclasesmetodo-container">
            <h2>Opciones de Cobro</h2>
            <div className="Popupclasesmetodo-tipo-cobro-buttons">
                <Button
                    variant={cobroTipo === 'fijo' ? 'black' : 'white'}
                    onClick={() => handleTipoCobroChange('fijo')}
                >
                    Fijo
                </Button>
                <Button
                    variant={cobroTipo === 'por_sesion' ? 'black' : 'white'}
                    onClick={() => handleTipoCobroChange('por_sesion')}
                >
                    Por Sesión
                </Button>
                <Button
                    variant={cobroTipo === 'paquete_sesiones' ? 'black' : 'white'}
                    onClick={() => handleTipoCobroChange('paquete_sesiones')}
                >
                    Paquete de Sesiones
                </Button>
            </div>

            {cobroTipo === 'fijo' && (
                <>
                    <div className="Popupclasesmetodo-botones-duracion">
                        <Button
                            variant={!duracionIndefinida ? 'black' : 'white'}
                            onClick={() => setDuracionIndefinida(false)}
                        >
                            Duración Determinada
                        </Button>
                        <Button
                            variant={duracionIndefinida ? 'black' : 'white'}
                            onClick={() => setDuracionIndefinida(true)}
                        >
                            Duración Indeterminada
                        </Button>
                    </div>

                    {!duracionIndefinida && (
                        <div className="Popupclasesmetodo-field">
                            <label>Duración (en meses)</label>
                            <input
                                type="number"
                                value={duracionMeses}
                                onChange={(e) => setDuracionMeses(e.target.value)}
                                placeholder="Ejemplo: 3 meses"
                            />
                        </div>
                    )}

                    <div className="Popupclasesmetodo-field">
                        <label>Precio</label>
                        <input
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            placeholder="Ejemplo: 50€"
                        />
                    </div>

                    <div className="Popupclasesmetodo-field">
                        <label>Frecuencia de Cobro</label>
                        <select value={frecuenciaCobro} onChange={(e) => setFrecuenciaCobro(e.target.value)}>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                            <option value="3_meses">Cada 3 meses</option>
                            <option value="6_meses">Cada 6 meses</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>

                    <div className="Popupclasesmetodo-field">
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
                <div className="Popupclasesmetodo-field">
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
                    <div className="Popupclasesmetodo-field">
                        <label>Precio por Paquete</label>
                        <input
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            placeholder="Ejemplo: 80€ por 10 sesiones"
                        />
                    </div>
                    <div className="Popupclasesmetodo-field">
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

            <div className="Popupclasesmetodo-info-pagos">
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

            <div className="Popupclasesmetodo-crear-button-container">
                <Button
                    variant="black"
                    className="Popupclasesmetodo-crear-button"
                    onClick={onClose}
                >
                    Guardar Plan de Pago
                </Button>
            </div>
        </div>
    );
};

export default PopupClasesMetodo;
