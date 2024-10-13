import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import './OverviewChart.css';
import WidgetRemoveButton from './ComponentesReutilizables/WidgetRemoveButton';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5005';
// Función para calcular las semanas del mes
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
      endDate = lastDayOfMonth;
    }

    weeks.push({
      start: currentStartDate.toLocaleDateString(),
      end: endDate.toLocaleDateString(),
    });

    currentStartDate.setDate(currentStartDate.getDate() + 7);
  }

  return weeks;
};

const getCurrentWeekNumber = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
};

function useIncomeData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/incomes/`)
      .then(response => {
        console.log('Total Ingresos Response:', response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching total ingresos:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

function OverviewChart({ onTitleClick, isEditMode, handleRemoveItem, theme }) {
  const [view, setView] = useState('anual');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [weekIndex, setWeekIndex] = useState(0);
  const [weeks, setWeeks] = useState([]);

  // Llamada al hook personalizado para obtener los datos
  const { data } = useIncomeData();

  useEffect(() => {
    setWeeks(getWeeksInMonth(month, year));
    setWeekIndex(0);  // Reset al cambiar el mes o año
  }, [month, year]);

  const handleNextYear = () => setYear(year + 1);
  const handlePreviousYear = () => setYear(year - 1);

  const handleNextMonth = () => setMonth((prevMonth) => (prevMonth + 1) % 12);
  const handlePreviousMonth = () => setMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));

  const handleNextWeek = () => {
    if (weekIndex < weeks.length - 1) setWeekIndex(weekIndex + 1);
  };

  const handlePreviousWeek = () => {
    if (weekIndex > 0) setWeekIndex(weekIndex - 1);
  };

  const getDaysArray = (month, year) => {
    const days = [];
    const numDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }
    return days;
  };

  const getChartData = () => {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue(
      theme === 'dark' ? '--text-dark' : '--text-light'
    );
  
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(
      theme === 'dark' ? '--text-dark' : '--text-light'
    );
  
    switch (view) {
      case 'semanal':
        const weeklyData = Array(7).fill(0);
        data.forEach(item => {
          const dayOfWeek = new Date(item.fecha).getDay(); 
          weeklyData[dayOfWeek] += item.cantidad;
        });
        return {
          labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: [
            {
              label: 'Revenue',
              data: weeklyData,
              backgroundColor,
            },
          ],
        };
      case 'mensual':
        const days = getDaysArray(month, year);
        const monthlyData = Array(days.length).fill(0);
        data.forEach(item => {
          const day = new Date(item.fecha).getDate();
          monthlyData[day - 1] += item.cantidad;
        });
        return {
          labels: days,
          datasets: [
            {
              label: 'Revenue',
              data: monthlyData,
              backgroundColor: monthlyData.map(value => value >= 2500 ? backgroundColor : '#FF0000'),
            },
          ],
        };
      case 'anual':
      default:
        const monthlyTotals = Array(12).fill(0);
        data.forEach(item => {
          const monthIndex = new Date(item.fecha).getMonth();
          monthlyTotals[monthIndex] += item.cantidad;
        });
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: `Revenue ${year}`,
              data: monthlyTotals,
              backgroundColor,
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
          ),
        },
      },
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            theme === 'dark' ? '--text-dark' : '--text-light'
          ),
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            theme === 'dark' ? '--text-dark' : '--text-light'
          ),
        },
      },
    },
  };

  return (
    <div className={`panelcontrol-overview ${theme}`}>
      <WidgetRemoveButton isEditMode={isEditMode} handleRemoveItem={handleRemoveItem} itemId="overviewChart" />
      <div className="panelcontrol-top">
        <div className="title-header">
          <h3 onClick={onTitleClick}>Ingresos</h3>
        </div>
        <div className="panelcontrol-header">
          <select onChange={(e) => setView(e.target.value)} value={view} className={`panelcontrol-dropdown-grafico ${theme}`}>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
          {view === 'anual' && (
            <div className="year-navigation">
              <button
                onClick={handlePreviousYear}
                className={`panelcontrol-nav-button ${theme}`}
                style={{
                  background: 'transparent',
                  color:  theme === 'dark' ? ' var(--button-border-dark)' : ' var(--button-border-light)',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  padding: '5px 5px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginRight: '8px',
                  transition: 'background 0.3s ease',
                }}>
                &lt;
              </button>
              <span>{year}</span>
              <button
                onClick={handleNextYear}
                className={`panelcontrol-nav-button ${theme}`}
                style={{
                  background: 'transparent',
                  color:  theme === 'dark' ? ' var(--button-border-dark)' : ' var(--button-border-light)',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  padding: '5px 5px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginLeft: '8px',
                  transition: 'background 0.3s ease',
                }}>
                &gt;
              </button>
            </div>
          )}
          {view === 'mensual' && (
            <div className="month-navigation">
              <button
                onClick={handlePreviousMonth}
                className={`panelcontrol-nav-button ${theme}`}
                style={{
                  background: 'transparent',
                  color:  theme === 'dark' ? ' var(--button-border-dark)' : ' var(--button-border-light)',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  padding: '5px 5px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginRight: '8px',
                  transition: 'background 0.3s ease',
                }}>
                &lt;
              </button>
              <span>{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <button
                onClick={handleNextMonth}
                className={`panelcontrol-nav-button ${theme}`}
                style={{
                  background: 'transparent',
                  color:  theme === 'dark' ? ' var(--button-border-dark)' : ' var(--button-border-light)',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  padding: '5px 5px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginLeft: '8px',
                  transition: 'background 0.3s ease',
                }}>
                &gt;
              </button>
            </div>
          )}
          {view === 'semanal' && (
            <div className="week-navigation">
              <button
                onClick={handlePreviousWeek}
                className={`panelcontrol-nav-button ${theme}`}
                style={{
                  background: 'transparent',
                  color:  theme === 'dark' ? ' var(--button-border-dark)' : ' var(--button-border-light)',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  padding: '5px 5px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginRight: '8px',
                  transition: 'background 0.3s ease',
                }}>
                &lt;
              </button>
              <span>{`${weeks[weekIndex]?.start || ''} - ${weeks[weekIndex]?.end || ''}`}</span>
              <button
                onClick={handleNextWeek}
                className={`panelcontrol-nav-button ${theme}`}
                style={{
                  background: 'transparent',
                  color:  theme === 'dark' ? ' var(--button-border-dark)' : ' var(--button-border-light)',
                  border: theme === 'dark' ? '1px solid var(--button-border-dark)' : '1px solid var(--button-border-light)',
                  padding: '5px 5px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginLeft: '8px',
                  transition: 'background 0.3s ease',
                }}>
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
      <Bar data={getChartData()} options={options} className="panelcontrol-overview-chart" />
    </div>
  );
}

export default OverviewChart;
