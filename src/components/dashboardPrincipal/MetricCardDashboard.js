import React from 'react';
import './MetricCardDashboard.css';

function MetricCardDashboard({ title, value, description, icon, valueClass, onClick, titleColor }) {
  return (
    <div className="dashboard-metric-card" onClick={onClick}>
      <div className="dashboard-metric-header">
        <span style={{ color: titleColor }}>{title}</span>
        <span className="dashboard-metric-icon">{icon}</span>
      </div>
      <p className={`dashboard-metric-value ${valueClass}`}>{value}</p>
      <small className="dashboard-metric-description">{description}</small>
    </div>
  );
}

export default MetricCardDashboard;
