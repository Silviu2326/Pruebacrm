// src/components/facturas/ModalDeEscaneoDeFacturas.js
import React, { useState } from 'react';
import './modal-de-escaneo-de-facturas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';const MAX_FILE_SIZE_MB = 15;

function ModalDeEscaneoDeFacturas({ isOpen, onClose, theme }) {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [totalFileSize, setTotalFileSize] = useState(0);
    const [responseData, setResponseData] = useState(null);

    const [companyName, setCompanyName] = useState('');
    const [total, setTotal] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = [];
        let newSize = totalFileSize;

        files.forEach(file => {
            const fileSizeMB = file.size / 1024 / 1024;
            if (newSize + fileSizeMB <= MAX_FILE_SIZE_MB) {
                newFiles.push(file);
                newSize += fileSizeMB;
            } else {
                alert('El tamaño total de los archivos no puede exceder 15 MB.');
            }
        });

        setUploadedFiles([...uploadedFiles, ...newFiles]);
        setTotalFileSize(newSize);
    };

    const handleRemoveFile = (index) => {
        const fileToRemove = uploadedFiles[index];
        const fileSizeMB = fileToRemove.size / 1024 / 1024;

        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
        setTotalFileSize(totalFileSize - fileSizeMB);
    };

    const handleScanInvoices = async () => {
        if (uploadedFiles.length > 0) {
            const reader = new FileReader();
            const file = uploadedFiles[0];
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Image = reader.result.split(',')[1];
                console.log('Base64 Image:', base64Image.substring(0, 100));

                try {
                    const response = await fetch(`${API_BASE_URL}/api/invoices/process`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ imageBase64: base64Image }),
                    });

                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }

                    const data = await response.json();
                    setResponseData(data);
                    setCompanyName(data.companyName);
                    setTotal(data.total);
                    setInvoiceDate(new Date(data.invoiceDate).toISOString().split('T')[0]);
                } catch (error) {
                    console.error('Error escaneando la factura:', error);
                    alert(`Error escaneando la factura: ${error.message}`);
                }
            };
        }
    };

    const handleSaveInvoice = async () => {
        console.log('Datos a enviar para guardar la factura:', {
            companyName,
            total,
            invoiceDate,
            type: 'received',
            services: []
        });

        try {
            const response = await fetch(`${API_BASE_URL}/api/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyName,
                    total: parseFloat(total),
                    invoiceDate,
                    type: 'received',
                    services: []
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            alert('Factura guardada correctamente');
            onClose();
        } catch (error) {
            console.error('Error guardando la factura:', error);
            alert(`Error guardando la factura: ${error.message}`);
        }
    };

    const progressBarWidth = (totalFileSize / MAX_FILE_SIZE_MB) * 100;

    return (
        <div className={`ModalDeEscaneoDeFacturas-overlay ${theme}`}>
            <div className={`ModalDeEscaneoDeFacturas-content ${theme}`}>
                <button onClick={onClose} className="ModalDeEscaneoDeFacturas-close-btn">Cerrar</button>
                <div className="scan-invoice-form">
                    <h1>Escanear Factura</h1>
                    <input type="file" multiple onChange={handleFileChange} />
                    <h2>Archivos Subidos</h2>
                    {uploadedFiles.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre del Archivo</th>
                                    <th>Tamaño</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uploadedFiles.map((file, index) => (
                                    <tr key={index}>
                                        <td>{file.name}</td>
                                        <td>{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                                        <td>
                                            <button onClick={() => handleRemoveFile(index)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No se han subido archivos.</p>
                    )}
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${progressBarWidth}%` }}></div>
                    </div>
                    <p>Total Subido: {totalFileSize.toFixed(2)} / 15 MB</p>
                    <button onClick={handleScanInvoices}
                    style={{
                        background:'var(--create-button-bg)', 
                        color:  'var(--button-text-dark)' ,
                        border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                        padding: '14px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'background 0.3s ease',
          }}
          >Comenzar Escaneo de Facturas</button>
                    <button onClick={onClose}
                    style={{
                        background: theme === 'dark' ? 'var(--button-bg-tres)' : 'var(--button-bg-filtro-dark)', 
                        color:  'var(--button-text-dark)' ,
                        border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'background 0.3s ease',
                      }}>Cancelar</button>
                    {responseData && (
                        <div>
                            <h2>Datos extraídos:</h2>
                            <form>
                                <div>
                                    <label>Nombre de la Compañía:</label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Total:</label>
                                    <input
                                        type="number"
                                        value={total}
                                        onChange={(e) => setTotal(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label>Fecha de la Factura:</label>
                                    <input
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                    />
                                </div>
                                <button type="button" onClick={handleSaveInvoice}>Guardar Factura</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModalDeEscaneoDeFacturas;
