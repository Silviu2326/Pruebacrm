import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Filter } from 'lucide-react'; // Importamos el ícono de lucide-react
import './ClientFilterDropdown.css';

const ClientFilterDropdown = ({ onFilterChange, theme, clientes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
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
        alertas: ''
    });

    const [dropdownsOpen, setDropdownsOpen] = useState({});
    const itemRefs = useRef({});

    useEffect(() => {
        if (isOpen) {
            Object.keys(filters).forEach((key) => {
                const item = itemRefs.current[key];
                if (item) {
                    const labelWidth = item.querySelector('.cc-client-filter-label').offsetWidth;
                    const inputWidth = item.querySelector('.cc-client-filter-input').offsetWidth;
                    if (labelWidth + inputWidth + 5 > item.offsetWidth) {
                        item.classList.add('to-column');
                    } else {
                        item.classList.remove('to-column');
                    }
                }
            });
        }
    }, [isOpen, filters]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleDropdownChange = (key, selectedValues) => {
        setFilters({ ...filters, [key]: selectedValues.join(', ') });
    };

    const toggleDropdown = (key) => {
        setDropdownsOpen({ ...dropdownsOpen, [key]: !dropdownsOpen[key] });
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
        setIsOpen(false);
    };

    const generateOptions = (key) => {
        const uniqueValues = [...new Set(clientes.map(cliente => cliente[key]).filter(Boolean))];
        return uniqueValues;
    };

    return (
        <div className={`cc-client-filter-dropdown ${theme}`}>
            <button
                className={`cliente-action-btn ${theme}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    backgroundColor: '#335484', // Cambiado a color de fondo #3d8bfd
                    border: 'none',
                    cursor: 'pointer',
                    padding: '16px',
                    color: '#fff', // Color del texto cambiado a blanco
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(130deg, rgba(214,71,94,1) 9%, rgba(238,85,133,1) 33%)'
                }}
            >
                <Filter size={16} color="white" /> {/* Icono de filtro */}
                
            </button>
            {isOpen && (
                <div className={`cc-cliente-dropdown-content ${theme}`}>
                    {Object.keys(filters).map((key) => (
                        <div
                            key={key}
                            className="cc-client-filter-item"
                            ref={(el) => itemRefs.current[key] = el}
                        >
                            <label className={`cc-client-filter-label ${theme}`} style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="text"
                                    name={key}
                                    value={filters[key]}
                                    onChange={handleInputChange}
                                    className={`cc-client-filter-input ${theme}`}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: '8px',
                                        border: '1px solid #ccc',
                                        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                <button
                                    onClick={() => toggleDropdown(key)}
                                    style={{
                                        backgroundColor: '#f0f0f0',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        padding: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <ChevronDown size={16} color="black" /> {/* Cambiamos el color a negro */}
                                </button>
                            </div>
                            {dropdownsOpen[key] && (
                                <div
                                    className="dropdown-options"
                                    style={{
                                        padding: '8px',
                                        marginTop: '4px',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        backgroundColor: '#fff',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                                    }}
                                >
                                    {generateOptions(key).map((option) => (
                                        <label key={option} style={{ display: 'block', padding: '4px' }}>
                                            <input
                                                type="checkbox"
                                                value={option}
                                                onChange={(e) => {
                                                    const selected = filters[key] ? filters[key].split(', ') : [];
                                                    if (e.target.checked) {
                                                        selected.push(option);
                                                    } else {
                                                        const index = selected.indexOf(option);
                                                        if (index > -1) {
                                                            selected.splice(index, 1);
                                                        }
                                                    }
                                                    handleDropdownChange(key, selected);
                                                }}
                                                style={{ marginRight: '8px' }}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button
                        className={`cc-apply-filters-button ${theme}`}
                        onClick={handleApplyFilters}
                        style={{
                            backgroundColor: '#007bff',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            marginTop: '16px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        Aplicar Filtros
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientFilterDropdown;
