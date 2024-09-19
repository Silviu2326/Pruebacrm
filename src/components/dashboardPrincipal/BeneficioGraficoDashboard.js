import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import './BeneficioGraficoDashboard.css';

const getWeeksInMonth = (month, year) => {
  const weeks = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let currentStartDate = new Date(firstDayOfMonth);
  currentStartDate.setDate(currentStartDate.getDate() - (currentStartDate.getDay() === 0 ? 6 : currentStartDate.getDay() - 1));

  while (currentStartDate <= lastDayOfMonth) {
    let endDate = new Date(currentStartDate);
    endDate.setDate(endDate.getDate() + 6);

    if (endDate > lastDayOfMonth) {
      endDate = new Date(lastDayOfMonth);
    }

    weeks.push({
      start: currentStartDate.toLocaleDateString(),
      end: endDate.toLocaleDateString(),
    });

    currentStartDate.setDate(currentStartDate.getDate() + 7);
  }

  return weeks;
};

const BeneficioGraficoDashboard = ({ theme }) => {
  const [view, setView] = useState('anual');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [weekIndex, setWeekIndex] = useState(0);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    setWeeks(getWeeksInMonth(month, year));
    setWeekIndex(0);
  }, [month, year]);

  const handleNextYear = () => {
    setYear(year + 1);
  };

  const handlePreviousYear = () => {
    setYear(year - 1);
  };

  const handleNextMonth = () => {
    setMonth((prevMonth) => (prevMonth + 1) % 12);
    if (month === 11) setYear(year + 1);
    setWeekIndex(0);
  };

  const handlePreviousMonth = () => {
    setMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    if (month === 0) setYear(year - 1);
    setWeekIndex(0);
  };

  const handleNextWeek = () => {
    if (weekIndex < weeks.length - 1) {
      setWeekIndex(weekIndex + 1);
    }
  };

  const handlePreviousWeek = () => {
    if (weekIndex > 0) {
      setWeekIndex(weekIndex - 1);
    }
  };

  const getDaysArray = (month, year) => {
    const days = [];
    const numDays = new Date(year, month + 1, 0).getDate();
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
          color: theme === 'dark' ? '#FFFFFF' : '#000000',
        },
      },
      x: {
        ticks: {
          color: theme === 'dark' ? '#FFFFFF' : '#000000',
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: function(context) {
            if (context.length > 0) {
              return context[0].label || '';
            }
            return '';
          },
          label: function(context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.raw !== undefined ? context.raw : '';
            return `${datasetLabel}: $${value}`;
          },
        }
      },
      legend: {
        labels: {
          color: theme === 'dark' ? '#FFFFFF' : '#000000',
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={`dashboard-beneficio-popup ${theme}`}>
      <div className="dashboard-beneficio-header">
        <h3>Cash Flow</h3>
        <div className="dashboard-beneficio-controls">
          <select onChange={(e) => setView(e.target.value)} value={view} className="dashboard-dropdown-grafico">
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
          {view === 'anual' && (
            <div className="year-navigation">
              <button className="widget-button" onClick={handlePreviousYear}>Anterior</button>
              <span>{year}</span>
              <button className="widget-button" onClick={handleNextYear}>Siguiente</button>
            </div>
          )}
          {view === 'mensual' && (
            <div className="month-navigation">
              <button className="widget-button" onClick={handlePreviousMonth}>Anterior</button>
              <span>{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <button className="widget-button" onClick={handleNextMonth}>Siguiente</button>
            </div>
          )}
          {view === 'semanal' && (
            <div className="week-navigation">
              <button className="widget-button" onClick={handlePreviousWeek}>Anterior</button>
              <span>{`${weeks[weekIndex]?.start} - ${weeks[weekIndex]?.end}`}</span>
              <button className="widget-button" onClick={handleNextWeek}>Siguiente</button>
            </div>
          )}
        </div>
      </div>
      <div className="dashboard-beneficio-chart-wrapper">
        {view === 'mensual' ? (
          <Line data={getData()} options={options} />
        ) : (
          <Bar data={getData()} options={options} />
        )}
      </div>
    </div>
  );
};

export default BeneficioGraficoDashboard;
