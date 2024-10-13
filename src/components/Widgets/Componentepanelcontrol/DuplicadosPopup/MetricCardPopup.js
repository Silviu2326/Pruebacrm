import React from 'react';
import './metriccardPopup.css';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'; // Importación de iconos de Lucide

function MetricCardPopup({ value, description, icon, valueClass, difference, isExpense = false, theme, setTheme }) {
  const differenceValue = difference.value;

  // Asignación de iconos en función del valor de difference
  const differenceIcon = differenceValue > 0
    ? <ArrowUp size={16} />
    : differenceValue < 0
    ? <ArrowDown size={16} />
    : <Minus size={16} />;

  const differenceClass = differenceValue > 0
    ? (isExpense ? 'difference-negative' : 'difference-positive')
    : differenceValue < 0
    ? (isExpense ? 'difference-positive' : 'difference-negative')
    : 'difference-neutral';

  return (
    <div className={`popup-metric-card ${theme}`}>
      <div className="popup-metric-header">
        <span className={`popup-metric-value ${valueClass}`}>{value}</span>
        <span className="popup-metric-icon">{icon}</span>
      </div>
      <div className="popup-metric-footer">
        <small className="popup-metric-description">{description}</small>
        <div className={`popup-metric-difference ${differenceClass}`}>
          <span className="difference-icon">{differenceIcon}</span> {Math.abs(differenceValue)}%
        </div>
      </div>
    </div>
  );
}

export default MetricCardPopup;
