import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './CreacionDeFacturas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
const CreacionDeFacturas = ({ isOpen, onClose, client, invoice, onAddFactura, theme}) => {
    const [formType, setFormType] = useState('simple');
    const [services, setServices] = useState(invoice ? invoice.services : [{ serviceCode: '', vat: '', quantity: '', unitPrice: '', discount: '' }]);
    const [formData, setFormData] = useState({
        invoiceYear: '2024',
        invoiceNumber: '',
        invoiceDate: '',
        paymentMethod: '',
        personType: '',
        name: '',
        surname: '',
        phone: '',
        email: '',
        street: '',
        number: '',
        city: '',
        postalCode: '',
        province: '',
        country: '',
        nif: '',
        companyName: '',
        companyNif: '',
        companyEmail: '',
        companyLogo: '',
        comment: '',
        type: 'made',
        ...invoice // Overwrite with invoice data if present
    });
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [pdfPath, setPdfPath] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/clients`);
                setClients(response.data);
            } catch (error) {
                console.error('Error al obtener los clientes:', error);
            }
        };

        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/invoices`);
                const invoices = response.data;

                if (invoices.length > 0 && !invoice) {
                    const lastInvoice = invoices.sort((a, b) => {
                        const aNumber = a.invoiceNumber ? parseInt(a.invoiceNumber.split('-')[1]) : 0;
                        const bNumber = b.invoiceNumber ? parseInt(b.invoiceNumber.split('-')[1]) : 0;
                        return bNumber - aNumber;
                    })[0];
                    const lastInvoiceNumber = lastInvoice.invoiceNumber ? parseInt(lastInvoice.invoiceNumber.split('-')[1]) : 0;
                    const newInvoiceNumber = (lastInvoiceNumber + 1).toString().padStart(2, '0');
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        invoiceNumber: newInvoiceNumber
                    }));
                } else if (!invoice) {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        invoiceNumber: '01'
                    }));
                }
            } catch (error) {
                console.error('Error al obtener las facturas:', error);
            }
        };

        fetchClients();
        fetchInvoices();

        if (client) {
            handleClientSelect(client);
        }
    }, [client, invoice]);

    useEffect(() => {
        if (invoice) {
            setFormData({
                ...invoice,
                invoiceDate: invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split('T')[0] : ''
            });
        }
    }, [invoice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setFormData({
            ...formData,
            name: client.firstName,
            surname: client.lastName,
            email: client.email,
            personType: 'individual'
        });
        setFormType('complex');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, companyLogo: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleServiceChange = (index, e) => {
        const { name, value } = e.target;
        const newServices = [...services];
        newServices[index][name] = value;
        setServices(newServices);
    };

    const addService = () => {
        setServices([...services, { serviceCode: '', vat: '', quantity: '', unitPrice: '', discount: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const total = services.reduce((acc, service) => {
            const serviceTotal = (service.unitPrice * service.quantity) - (service.discount * service.quantity);
            const serviceTotalWithVAT = serviceTotal + (serviceTotal * (service.vat / 100));
            return acc + serviceTotalWithVAT;
        }, 0);
        const invoiceNumberFormatted = `${formData.invoiceYear}-${formData.invoiceNumber.padStart(2, '0')}`;
        const invoiceData = { ...formData, invoiceNumber: invoiceNumberFormatted, services, total };
        console.log(invoiceData);

        try {
            const response = invoice
                ? await axios.put(`${API_BASE_URL}/api/invoices/${invoice._id}`, invoiceData)
                : await axios.post(`${API_BASE_URL}/api/invoices`, invoiceData);
            setPdfPath(`${API_BASE_URL}${response.data.pdfPath}`);
            onAddFactura(invoiceData);
            onClose();
        } catch (error) {
            console.error('Error al crear la factura:', error.response?.data || error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="CreacionDeFacturasModal-modal">
            <div className="CreacionDeFacturasModal-modal-content">
                <span className="CreacionDeFacturasModal-close" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit} className="CreacionDeFacturasModal-form">
                    <h1>{invoice ? 'Editar Factura' : 'Crear Factura'}</h1>
                    <div className="CreacionDeFacturasModal-gridContainer">
                        <div className="CreacionDeFacturasModal-leftColumn">
                            <h2>Datos Clave de Factura</h2>
                            <div className="CreacionDeFacturasModal-invoiceNumberContainer">
                                <input type="text" name="invoiceYear" placeholder="Año" value={formData.invoiceYear} onChange={handleChange} required className="CreacionDeFacturasModal-invoiceYear" />
                                <input type="text" name="invoiceNumber" placeholder="Número de Factura" value={formData.invoiceNumber} onChange={handleChange} required className="CreacionDeFacturasModal-invoiceNumber" />
                            </div>
                            <input type="date" name="invoiceDate" placeholder="Fecha de la Factura" value={formData.invoiceDate} onChange={handleChange} required className="CreacionDeFacturasModal-date" />
                            <input type="text" name="paymentMethod" placeholder="Método de Pago" value={formData.paymentMethod} onChange={handleChange} required className="CreacionDeFacturasModal-paymentMethod" />
                        </div>
                        <div className="CreacionDeFacturasModal-rightColumn">
                            <h2>Servicios</h2>
                            {services.map((service, index) => (
                                <div key={index} className="CreacionDeFacturasModal-serviceField">
                                    <input type="text" name="serviceCode" placeholder="Código de Servicio" value={service.serviceCode} onChange={(e) => handleServiceChange(index, e)} required className="CreacionDeFacturasModal-serviceCode" />
                                    <input type="number" name="vat" placeholder="IVA" value={service.vat} onChange={(e) => handleServiceChange(index, e)} required className="CreacionDeFacturasModal-vat" />
                                    <input type="number" name="quantity" placeholder="Cantidad" value={service.quantity} onChange={(e) => handleServiceChange(index, e)} required className="CreacionDeFacturasModal-quantity" />
                                    <input type="number" name="unitPrice" placeholder="Precio Unitario" value={service.unitPrice} onChange={(e) => handleServiceChange(index, e)} required className="CreacionDeFacturasModal-unitPrice" />
                                    <input type="number" name="discount" placeholder="Descuento por Unidad" value={service.discount} onChange={(e) => handleServiceChange(index, e)} required className="CreacionDeFacturasModal-discount" />
                                </div>
                            ))}
                            <button type="button" onClick={addService} className="CreacionDeFacturasModal-addService"
                            style={{
                                background: 'var(--create-button-bg)',
                                color: 'var(--button-text-dark)',
                                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                                padding: '14px 20px',
                                width: '100%',
                                marginTop: '0',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: 'background 0.3s ease',
                            }}>Añadir Servicio</button>
                        </div>
                    </div>
                    <h2>Tipo de Factura</h2>
                    <select onChange={(e) => setFormType(e.target.value)} value={formType} className="CreacionDeFacturasModal-formType">
                        <option value="simple">Factura Simple</option>
                        <option value="complex">Factura Completa</option>
                    </select>
                    {formType === 'complex' && (
                        <>
                            <h2>Factura Compuesta</h2>
                            <select name="personType" onChange={handleChange} value={formData.personType} className="CreacionDeFacturasModal-personType">
                                <option value="individual">Persona Física</option>
                                <option value="company">Persona Jurídica</option>
                            </select>
                            <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} className="CreacionDeFacturasModal-name" />
                            <input type="text" name="surname" placeholder="Apellidos" value={formData.surname} onChange={handleChange} className="CreacionDeFacturasModal-surname" />
                            <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} className="CreacionDeFacturasModal-phone" />
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="CreacionDeFacturasModal-email" />
                            <input type="text" name="street" placeholder="Calle" value={formData.street} onChange={handleChange} className="CreacionDeFacturasModal-street" />
                            <input type="text" name="number" placeholder="Número" value={formData.number} onChange={handleChange} className="CreacionDeFacturasModal-number" />
                            <input type="text" name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} className="CreacionDeFacturasModal-city" />
                            <input type="text" name="postalCode" placeholder="Código Postal" value={formData.postalCode} onChange={handleChange} className="CreacionDeFacturasModal-postalCode" />
                            <input type="text" name="province" placeholder="Provincia" value={formData.province} onChange={handleChange} className="CreacionDeFacturasModal-province" />
                            <input type="text" name="country" placeholder="País de Residencia" value={formData.country} onChange={handleChange} className="CreacionDeFacturasModal-country" />
                            <input type="text" name="nif" placeholder="NIF" value={formData.nif} onChange={handleChange} className="CreacionDeFacturasModal-nif" />
                        </>
                    )}
                    <h2>Datos de la Empresa Emisora</h2>
                    <input type="text" name="companyName" placeholder="Nombre de la Empresa" value={formData.companyName} onChange={handleChange} required className="CreacionDeFacturasModal-companyName" />
                    <input type="text" name="companyNif" placeholder="NIF de la Empresa" value={formData.companyNif} onChange={handleChange} required className="CreacionDeFacturasModal-companyNif" />
                    <input type="email" name="companyEmail" placeholder="Email de la Empresa" value={formData.companyEmail} onChange={handleChange} required className="CreacionDeFacturasModal-companyEmail" />
                    <input type="file" name="companyLogo" placeholder="Logotipo de la Empresa" onChange={handleFileChange} className="CreacionDeFacturasModal-companyLogo" />
                    <h2>Comentario</h2>
                    <textarea name="comment" placeholder="Comentario" value={formData.comment} onChange={handleChange} className="CreacionDeFacturasModal-comment"></textarea>
                    <input type="hidden" name="type" value={formData.type} className="CreacionDeFacturasModal-type" />
                    <h2>Seleccionar Cliente</h2>
                    <select onChange={(e) => handleClientSelect(clients.find(client => client._id === e.target.value))} className="CreacionDeFacturasModal-clientSelect">
                        <option value="">Seleccione un cliente</option>
                        {clients.map(client => (
                            <option key={client._id} value={client._id}>{client.firstName} {client.lastName}</option>
                        ))}
                    </select>
                    <button type="submit" className="CreacionDeFacturasModal-submitButton">{invoice ? 'Guardar Cambios' : 'Crear Factura'}</button>
                    <button type="button" onClick={onClose} className="CreacionDeFacturasModal-cancelButton" style={{
                                    background: '#F44336',
                                }}>Cancelar</button>
    
                    {pdfPath && (
                        <div className="CreacionDeFacturasModal-pdfPreview">
                            <h2>Factura Generada</h2>
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}>
                                <Viewer fileUrl={pdfPath} />
                            </Worker>
                            <a href={pdfPath} download={`Factura-${formData.invoiceYear}-${formData.invoiceNumber.padStart(2, '0')}.pdf`} className="CreacionDeFacturasModal-downloadPDF">Descargar PDF</a>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
    
};

export default CreacionDeFacturas;
