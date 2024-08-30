import React, { useState } from 'react';
import './PaymentPlansAsesoriapopup.css'; // Importa el archivo CSS

const PaymentPlansAsesoriapopup = ({ service, onClose }) => {
    const [planName, setPlanName] = useState('');
    const [frequency, setFrequency] = useState('');
    const [durationValue, setDurationValue] = useState('');
    const [durationUnit, setDurationUnit] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState(0);

    const handleCreatePlan = () => {
        const newPlan = {
            planName,
            frequency,
            durationValue,
            durationUnit,
            price,
            discount,
        };
        console.log("Nuevo Plan de Pago:", newPlan);
        onClose();
    };

    return (
        <div className="PaymentPlansAsesoriapopup-dialog">
            <div className="PaymentPlansAsesoriapopup-title">
                Crear Plan de Pago
            </div>
            <div className="PaymentPlansAsesoriapopup-content">
                <label>Nombre del Plan</label>
                <input
                    type="text"
                    placeholder="Nombre del Plan"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="PaymentPlansAsesoriapopup-textField"
                />
                <label>Frecuencia</label>
                <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="PaymentPlansAsesoriapopup-textField"
                >
                    <option value="" disabled>Seleccione la frecuencia</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="yearly">Anual</option>
                </select>
                <label>Duración</label>
                <input
                    type="number"
                    placeholder="Duración"
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    className="PaymentPlansAsesoriapopup-textField"
                />
                <label>Unidad de Duración</label>
                <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="PaymentPlansAsesoriapopup-textField"
                >
                    <option value="" disabled>Seleccione la unidad</option>
                    <option value="days">Días</option>
                    <option value="weeks">Semanas</option>
                    <option value="months">Meses</option>
                    <option value="years">Años</option>
                </select>
                <label>Precio</label>
                <input
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="PaymentPlansAsesoriapopup-textField"
                />
                <label>Descuento (%)</label>
                <input
                    type="number"
                    placeholder="Descuento"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="PaymentPlansAsesoriapopup-textField"
                />
            </div>
            <div className="PaymentPlansAsesoriapopup-actions">
                <button onClick={onClose} className="PaymentPlansAsesoriapopup-button PaymentPlansAsesoriapopup-cancelButton">
                    Cancelar
                </button>
                <button onClick={handleCreatePlan} className="PaymentPlansAsesoriapopup-button PaymentPlansAsesoriapopup-createButton">
                    Crear Plan
                </button>
            </div>
        </div>
    );
};

export default PaymentPlansAsesoriapopup;
