import React, { useState } from 'react';
import axios from 'axios';
import './CrearCliente.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const CrearCliente = ({ onClose, onClienteCreado, theme }) => {
    const [cliente, setCliente] = useState({
        nombre: '',
        apellido: '',
        estado: '',
        telefono: '',
        email: '',
        tag: '',
        tipoDePlan: '',
        ultimoCheckin: '',
        clase: '',
        porcentajeCumplimiento: '',
        alertas: '',
        edad: '',
        genero: '',
        altura: '',
        peso: '',
        street: '',        // Calle
        number: '',        // Número
        city: '',          // Ciudad
        postalCode: '',    // Código Postal
        province: '',      // Provincia
        country: '',       // País de Residencia
        paymentMethod: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({
            ...cliente,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${API_BASE_URL}/api/clientes`, cliente)
            .then(response => {
                console.log('Cliente creado:', response.data);
                onClienteCreado();
                onClose();
            })
            .catch(error => {
                console.error('Hubo un error al crear el cliente:', error);
            });
    };

    return (
        <div className={`modalcrearcliente ${theme}`}>
            <div className={`modal-contentmodalcrearcliente ${theme}`}>
                <span className={`close ${theme}`} onClick={onClose}>&times;</span>
                <h2>Crear Cliente</h2>
                <form onSubmit={handleSubmit} className="form-grid">
                    <div>
                        <label className={theme}>Nombre<span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={cliente.nombre} 
                            onChange={handleChange} 
                            className={theme} 
                            required 
                        />
                    </div>
                    <div>
                        <label className={theme}>Apellido</label>
                        <input 
                            type="text" 
                            name="apellido" 
                            value={cliente.apellido} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Estado</label>
                        <input 
                            type="text" 
                            name="estado" 
                            value={cliente.estado} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Teléfono</label>
                        <input 
                            type="text" 
                            name="telefono" 
                            value={cliente.telefono} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Email<span className="required">*</span></label>
                        <input 
                            type="email" 
                            name="email" 
                            value={cliente.email} 
                            onChange={handleChange} 
                            className={theme} 
                            required 
                        />
                    </div>
                    <div>
                        <label className={theme}>Tag</label>
                        <input 
                            type="text" 
                            name="tag" 
                            value={cliente.tag} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Tipo de Plan</label>
                        <input 
                            type="text" 
                            name="tipoDePlan" 
                            value={cliente.tipoDePlan} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Último Checkin</label>
                        <input 
                            type="text" 
                            name="ultimoCheckin" 
                            value={cliente.ultimoCheckin} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Clase</label>
                        <input 
                            type="text" 
                            name="clase" 
                            value={cliente.clase} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Porcentaje de Cumplimiento</label>
                        <input 
                            type="text" 
                            name="porcentajeCumplimiento" 
                            value={cliente.porcentajeCumplimiento} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Alertas</label>
                        <input 
                            type="text" 
                            name="alertas" 
                            value={cliente.alertas} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Edad</label>
                        <input 
                            type="text" 
                            name="edad" 
                            value={cliente.edad} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Género</label>
                        <input 
                            type="text" 
                            name="genero" 
                            value={cliente.genero} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Altura</label>
                        <input 
                            type="text" 
                            name="altura" 
                            value={cliente.altura} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Peso</label>
                        <input 
                            type="text" 
                            name="peso" 
                            value={cliente.peso} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>

                    {/* Campos desglosados para la dirección */}
                    <div>
                        <label className={theme}>Calle</label>
                        <input 
                            type="text" 
                            name="street" 
                            value={cliente.street} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Número</label>
                        <input 
                            type="text" 
                            name="number" 
                            value={cliente.number} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Ciudad</label>
                        <input 
                            type="text" 
                            name="city" 
                            value={cliente.city} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Código Postal</label>
                        <input 
                            type="text" 
                            name="postalCode" 
                            value={cliente.postalCode} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>Provincia</label>
                        <input 
                            type="text" 
                            name="province" 
                            value={cliente.province} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>
                    <div>
                        <label className={theme}>País</label>
                        <input 
                            type="text" 
                            name="country" 
                            value={cliente.country} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>

                    <div>
                        <label className={theme}>Método de Pago</label>
                        <input 
                            type="text" 
                            name="paymentMethod" 
                            value={cliente.paymentMethod} 
                            onChange={handleChange} 
                            className={theme} 
                        />
                    </div>

                    <button type="submit" className={theme}>Crear</button>
                </form>
            </div>
        </div>
    );
};

export default CrearCliente;
