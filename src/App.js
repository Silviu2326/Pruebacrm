import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientesLista from './components/Workspace/ClientesLista';
import CrearCliente from './components/Workspace/CrearCliente';
import ExerciseList from './components/Ejercicios/ExerciseList';
import CreateRoutine from './components/Rutinas/Listaderutinas';
import EditRoutinePage from './components/Rutinas/pages/EditRoutinePage';
import Listadedietas from './components/Dietas/Listadedietas';
import Pageediciondieta from './components/Dietas/Pages/Pageediciondieta';
import Listadeclases from './components/Clases/Listadeclases';
import Plans from './components/planes/Plans';
import Forecasts from './components/Previsiones/Forecasts';
import Expenses from './components/Previsiones/Expenses';
import IncomeExpenses from './components/Previsiones/IncomeExpenses';
import Bonos from './components/Bonos/Bonos';
import Incomes from './components/Previsiones/Incomes';
import Pestañaeconomiapage from './components/Widgets/Pestañaeconomiapage';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard/Dashboard';
import ContentCreation from './components/ContentCreation/ContentCreation';
import Campaigns from './components/Campaigns/Campaigns';
import Ads from './components/Ads/Ads';
import FunnelsList from './components/FunnelsList/FunnelsList';
import Rutinaaasss from './components/Rutinaaasss/Rutinaaaasss'; // Rutinaaasss contiene CreacionDeRutina
import Login from './components/Login/login';
import Ajustes from './components/Ajustes/Ajustes';
import './styles.css';
import ListadePublicaciones from './components/Publicaciondecontenido/listadepublicaciones';
import DashboardPrincipal from './components/dashboardPrincipal/DashboardPrincipal';
import CommandPopup from './components/Workspace/CommandPopup';  // Importa CommandPopup
import ColecRutina from './components/ColecRutina/ColecRutina';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [trainerId, setTrainerId] = useState(null);
  const [routineName, setRoutineName] = useState(''); // Estado del nombre de la rutina

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    document.body.className = theme;

    // Recuperar el trainerId del localStorage
    const storedTrainerId = localStorage.getItem('trainerId');
    if (storedTrainerId) {
      setTrainerId(storedTrainerId);
    }
  }, [theme]);

  return (
    <Router>
      <div className={`App ${theme} ${theme === 'dark' ? 'dark-mode' : ''}`}>
        <NavBar 
          theme={theme} 
          toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
        <div className={`main-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          <Routes>
            <Route path="/" element={<ClientesLista theme={theme} setTheme={setTheme} />} />
            <Route path="/crear-cliente" element={<CrearCliente theme={theme} setTheme={setTheme}/>} />
            <Route path="/crear-ejercicio" element={<ExerciseList theme={theme} setTheme={setTheme}/>} />
            <Route path="/crear-rutina" element={<CreateRoutine theme={theme} setTheme={setTheme} />} />
            <Route path="/edit-routine/:id" element={<EditRoutinePage theme={theme} setTheme={setTheme}/>} />
            <Route path="/crear-dieta" element={<Listadedietas theme={theme} setTheme={setTheme} />} />
            <Route path="/edit-dieta/:id" element={<Pageediciondieta theme={theme} setTheme={setTheme}/>} />
            <Route path="/lista-clases" element={<Listadeclases theme={theme} setTheme={setTheme}/>} />
            <Route path="/plans" element={<Plans theme={theme} setTheme={setTheme}/>} />
            <Route path="/dashboard-principal" element={<DashboardPrincipal theme={theme} setTheme={setTheme}/>} />
            <Route path="/forecasts" element={<Forecasts theme={theme} setTheme={setTheme}/>} />
            <Route path="/expenses" element={<Expenses theme={theme} setTheme={setTheme}/>} />
            <Route path="/income-expenses" element={<IncomeExpenses theme={theme} setTheme={setTheme}/>} />
            <Route path="/bonos" element={<Bonos theme={theme} setTheme={setTheme}/>} />
            <Route path="/incomes" element={<Incomes theme={theme} setTheme={setTheme}/>} />
            <Route path="/economia" element={<Pestañaeconomiapage theme={theme} setTheme={setTheme} userId={trainerId} />} />
            <Route path="/dashboard" element={<Dashboard theme={theme} setTheme={setTheme}/>} />
            <Route path="/content-creation" element={<ContentCreation theme={theme} setTheme={setTheme}/>} />
            <Route path="/campaigns" element={<Campaigns theme={theme} setTheme={setTheme}/>} />
            <Route path="/ads" element={<Ads theme={theme} setTheme={setTheme}/>} />
            <Route path="/funnels" element={<FunnelsList theme={theme} setTheme={setTheme}/>} />
            <Route path="/rutinaaasss" element={<Rutinaaasss theme={theme} setTheme={setTheme} routineName={routineName} setRoutineName={setRoutineName} />} /> {/* Pasamos routineName como prop */}
            <Route path="/login" element={<Login />} />
            <Route path="/publicaciones" element={<ListadePublicaciones theme={theme} setTheme={setTheme}/>} />
            <Route path="/ajustes" element={<Ajustes theme={theme} setTheme={setTheme}/>} />
            <Route path="/ColecRutina" element={<ColecRutina theme={theme} setTheme={setTheme}/>} />
          </Routes>
        </div>
        
        {/* Pasamos setRoutineName como prop al CommandPopup */}
        <CommandPopup setRoutineName={setRoutineName} />
      </div>
    </Router>
  );
}

export default App;
