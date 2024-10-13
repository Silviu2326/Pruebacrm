// C:\Users\usuario\Downloads\crmworkspaceEspacial\crm-frontend\src\components\NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import { MdBrightness3, MdWbSunny, MdMenu, MdClose, MdPeople, MdPersonAdd, MdFitnessCenter, MdFastfood, MdLibraryBooks, MdEventNote, MdMonetizationOn, MdDashboard, MdCreate, MdCampaign, MdAdb, MdFormatListBulleted, MdListAlt, MdSettings } from 'react-icons/md'; // Importar MdSettings
import { Icon } from 'react-icons-kit';
import { arrowDown } from 'react-icons-kit/fa/arrowDown';
import { sunO } from 'react-icons-kit/fa/sunO';
import { moonO } from 'react-icons-kit/fa/moonO';
import './NavBar.css';

const NavBar = ({ theme, toggleTheme, isCollapsed, toggleCollapse }) => {
  return (
    <div className={`Elnav-navbar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <nav className="Elnav-navbar">
        <ul>
        <li><Link to="/dashboard-principal"><MdDashboard size={20} /> <span>Dashboard Principal</span></Link></li>
          <li><Link to="/"><MdPeople size={20} /> <span>Clientes</span></Link></li>
          <li><Link to="/crear-cliente"><MdPersonAdd size={20} /> <span>Crear Cliente</span></Link></li>
           {/* <li><Link to="/crear-ejercicio"><MdFitnessCenter size={20} /> <span>Crear Ejercicio</span></Link></li>*/}
           {/*<li><Link to="/crear-rutina"><MdEventNote size={20} /> <span>Planificaciones</span></Link></li>*/}
          <li><Link to="/ColecRutina"><MdEventNote size={20} /> <span>Planificaciones</span></Link></li>
          <li><Link to="/crear-dieta"><MdFastfood size={20} /> <span>Crear Dieta</span></Link></li>
          <li><Link to="/lista-clases"><MdLibraryBooks size={20} /> <span>Lista de Clases</span></Link></li>
          <li><Link to="/economia"><MdMonetizationOn size={20} /> <span>Economia</span></Link></li>
          <li><Link to="/dashboard"><MdDashboard size={20} /> <span>Dashboard</span></Link></li>
          <li><Link to="/content-creation"><MdCreate size={20} /> <span>Content Creation</span></Link></li>
           {/*<li><Link to="/rutinaaasss"><MdListAlt size={20} /> <span>Rutinas</span></Link></li>*/}
          <li><Link to="/login"><MdPersonAdd size={20} /> <span>Login</span></Link></li>
          <li><Link to="/publicaciones"><MdListAlt size={20} /> <span>Publicaciones</span></Link></li>
          <li><Link to="/ajustes"><MdSettings size={20} /> <span>Ajustes</span></Link></li> {/* Agregar el enlace Ajustes */}
          <li>
            <button className="Elnav-theme-toggle-btn" onClick={toggleTheme}>
              {theme === 'light' ? <Icon icon={moonO} size={20} /> : <Icon icon={sunO} size={20} />}
              <span>Cambiar a {theme === 'light' ? 'Tema Oscuro' : 'Tema Claro'}</span>
            </button>
          </li>
        </ul>
        <button className="Elnav-collapse-btn" onClick={toggleCollapse}>
        {isCollapsed ? <MdMenu size={24} /> : <MdClose size={24} />}
      </button>
      </nav>
    </div>
  );
};

export default NavBar;
