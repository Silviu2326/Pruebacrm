import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import './BeneficioChartPopup.css';

const getCurrentWeekNumber = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
};

const getWeeksInMonth = (month, year) => {
  const weeks = [];
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let start = 1;
  let end = 7 - firstDayOfMonth;
  while (start <= daysInMonth) {
    weeks.push({ start, end: end > daysInMonth ? daysInMonth : end });
    start = end + 1;
    end += 7;
  }
  return weeks;
};

const BeneficioChartPopup = ({ onTitleClick, theme }) => {
  const [view, setView] = useState('anual');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [week, setWeek] = useState(getCurrentWeekNumber());

  const handleNextYear = () => {
    setYear(year + 1);
  };

  const handlePreviousYear = () => {
    setYear(year - 1);
  };

  const handleNextMonth = () => {
    setMonth((prevMonth) => (prevMonth + 1) % 12);
  };

  const handlePreviousMonth = () => {
    setMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const handleNextWeek = () => {
    setWeek(week + 1);
  };

  const handlePreviousWeek = () => {
    setWeek(week - 1);
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getDaysArray = (month, year) => {
    const days = [];
    const numDays = daysInMonth(month, year);
    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }
    return days;
  };

  const getData = () => {
    switch (view) {
      case 'semanal':
        return {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [
            {
              type: 'bar',
              label: 'Ingresos',
              data: [300, 500, 700, 400, 600, 800, 900],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              type: 'bar',
              label: 'Gastos',
              data: [150, 200, 180, 230, 210, 220, 260],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              type: 'line',
              label: 'Beneficio',
              data: [150, 300, 520, 170, 390, 580, 640],
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              fill: false,
            },
          ],
        };
      case 'mensual':
        const days = getDaysArray(month, year);
        const monthlyIngresos = Array(days.length).fill(0).map(() => Math.floor(Math.random() * 10000));
        const monthlyGastos = Array(days.length).fill(0).map(() => Math.floor(Math.random() * 5000));
        const monthlyBeneficio = monthlyIngresos.map((ingreso, index) => ingreso - monthlyGastos[index]);
        return {
          labels: days,
          datasets: [
            {
              type: 'line',
              label: 'Ingresos',
              data: monthlyIngresos,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
              tension: 0.4,
            },
            {
              type: 'line',
              label: 'Gastos',
              data: monthlyGastos,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              fill: false,
              tension: 0.4,
            },
            {
              type: 'line',
              label: 'Beneficio',
              data: monthlyBeneficio,
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              fill: false,
              tension: 0.4,
            },
          ],
        };
      case 'anual':
      default:
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              type: 'bar',
              label: 'Ingresos',
              data: [3000, 4000, 3200, 5000, 4500, 4800, 5200, 4300, 4100, 3900, 5600, 5800],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              type: 'bar',
              label: 'Gastos',
              data: [1500, 2000, 1800, 2300, 2100, 2200, 2600, 2100, 2000, 1900, 2700, 2900],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              type: 'line',
              label: 'Beneficio',
              data: [1500, 2000, 1400, 2700, 2400, 2600, 2600, 2200, 2100, 2000, 2900, 2900],
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              fill: false,
            },
          ],
        };
    }
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === 'dark' ? 'var(--text-light)' : 'var(--text-dark)',
        },
      },
      x: {
        ticks: {
          color: theme === 'dark' ? 'var(--text-light)' : 'var(--text-dark)',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? 'var(--text-light)' : 'var(--text-dark)',
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={`panelcontrol-beneficio-popup ${theme}`}>
      <div className="panelcontrol-top">
        <div className="title-header">
          <h3 onClick={onTitleClick}>Ingresos, Gastos y Beneficio</h3>
        </div>
        <div className="panelcontrol-header">
          <select onChange={(e) => setView(e.target.value)} value={view} className={`panelcontrol-dropdown-grafico ${theme}`}>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
          {view === 'anual' && (
            <div className="year-navigation">
              <button onClick={handlePreviousYear}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>Anterior</button>
              <span>{year}</span>
              <button onClick={handleNextYear}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>Siguiente</button>
            </div>
          )}
          {view === 'mensual' && (
            <div className="month-navigation">
              <button onClick={handlePreviousMonth}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>Anterior</button>
              <span>{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <button onClick={handleNextMonth}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>Siguiente</button>
            </div>
          )}
          {view === 'semanal' && (
            <div className="week-navigation">
              <button onClick={handlePreviousWeek}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>Anterior</button>
              <span>{`Semana ${week}`}</span>
              <button onClick={handleNextWeek}
              style={{
                background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)', 
                color:  'var(--button-text-dark)' ,
                border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.3s ease',
              }}>Siguiente</button>
            </div>
          )}
        </div>
      </div>
      <div className="panelcontrol-beneficio-popup-chart-wrapper">
        {view === 'mensual' ? (
          <Line data={getData()} options={options} />
        ) : (
          <Bar data={getData()} options={options} />
        )}
      </div>
    </div>
  );
};

export default BeneficioChartPopup;
