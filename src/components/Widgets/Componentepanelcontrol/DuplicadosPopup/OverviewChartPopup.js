import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import './OverviewChartPopup.css';

const getCurrentWeekNumber = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
};

const getWeekRange = (week, year) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const days = (week - 1) * 7;
  const startDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + days));
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const options = { day: '2-digit', month: 'short' };
  return `${startDate.toLocaleDateString('es-ES', options)} - ${endDate.toLocaleDateString('es-ES', options)}`;
};

function OverviewChartPopup({ detailed, theme, setTheme }) {
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
    const revenueColor = getComputedStyle(document.documentElement).getPropertyValue(
      theme === 'dark' ? '--text-dark' : '--text-light'
    ).trim();

    switch (view) {
      case 'semanal':
        return {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [
            {
              label: 'Revenue',
              data: [300, 500, 700, 400, 600, 800, 900],
              backgroundColor: revenueColor,
            },
          ],
        };
      case 'mensual':
        const days = getDaysArray(month, year);
        const monthlyData = Array(days.length).fill(0).map(() => Math.floor(Math.random() * 10000));
        return {
          labels: days,
          datasets: [
            {
              label: 'Revenue',
              data: monthlyData,
              backgroundColor: monthlyData.map(() => revenueColor),
            },
          ],
        };
      case 'anual':
      default:
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: `Revenue ${year}`,
              data: [1500, 6000, 2000, 3000, 4500, 2500, 3200, 2000, 5000, 5800, 4700, 3000],
              backgroundColor: revenueColor,
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
          color: getComputedStyle(document.documentElement).getPropertyValue(
            theme === 'dark' ? '--text-dark' : '--text-light'
          ).trim(),
        },
      },
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            theme === 'dark' ? '--text-dark' : '--text-light'
          ).trim(),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`panelcontrol-overview-popup ${detailed ? 'detailed' : ''} ${theme}`}>
      <h3>Ingresos</h3>
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
            }}
>Anterior</button>
            <span>{getWeekRange(week, year)}</span>
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
            }}
>Siguiente</button>
          </div>
        )}
      </div>
      <div className="panelcontrol-overview-popup-chart-wrapper">
        <Bar data={getData()} options={options} />
      </div>
    </div>
  );
}

export default OverviewChartPopup;
