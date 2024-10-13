import React, { useState } from 'react';
import axios from 'axios';
import './CrearCliente.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
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
                <span className={`close ${theme}`} onClick={onClose}
                style={{
                    background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                    color:  'var(--button-text-dark)' ,
                    border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'background 0.3s ease',
                  }}>&times;</span>
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
                        />
                    </div>
                    <div>
                        <label className={theme}>Fecha de Nacimiento</label> {/* Cambiado de Edad a Fecha de Nacimiento */}
                        <input 
                            type="date"  // Cambiado de text a date
                            name="fechaDeNacimiento" 
                            value={cliente.fechaDeNacimiento} 
                            onChange={handleChange} 
                            className={theme} 
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                            }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
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
                            style={{
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background 0.3s ease',  
                                width: '230px',
                                height: '44px',
                    }}
                        />
                    </div>

                    <button 
type="submit" className={theme} style={{
    background:'var(--create-button-bg)', 
    color:  'var(--button-text-dark)' ,
    border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
    padding: '14px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background 0.3s ease',
}} >Crear</button>
                </form>
            </div>
        </div>
    );
};

export default CrearCliente;
