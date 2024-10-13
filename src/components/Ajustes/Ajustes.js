import React, { useState } from 'react';
import './Ajustes.css';
import { 
  FaLanguage, 
  FaBell, 
  FaCreditCard, 
  FaCog, 
  FaShieldAlt, 
  FaQuestionCircle, 
  FaNewspaper, 
  FaSignOutAlt, 
  FaKey, 
  FaMoneyBillAlt, 
  FaCalendarCheck, 
  FaLock 
} from 'react-icons/fa';

const Ajustes = () => {
  const [language, setLanguage] = useState('es');
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: false });

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleNotificationsChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prevNotifications) => ({ ...prevNotifications, [name]: checked }));
  };

  const handleSave = () => {
    console.log("Datos guardados", { language, notifications });
    // Aquí puedes agregar la lógica para guardar los datos, como una llamada a una API
  };

  const handleLogout = () => {
    console.log("Cerrar sesión");
    // Aquí puedes agregar la lógica para cerrar sesión, como limpiar el estado del usuario o redirigir
  };

  const handleChangePassword = () => {
    console.log("Cambiar contraseña");
    // Aquí puedes agregar la lógica para cambiar la contraseña, como abrir un modal o redirigir a una página de cambio de contraseña
  };

  const handleManagePayments = () => {
    console.log("Gestionar métodos de pago");
    // Aquí puedes agregar la lógica para gestionar métodos de pago
  };

  const handleConnectIntegration = () => {
    console.log("Conectar integración");
    // Aquí puedes agregar la lógica para conectar integraciones
  };

  const handleContactSupport = () => {
    console.log("Contactar soporte");
    // Aquí puedes agregar la lógica para contactar soporte, como abrir un formulario de contacto
  };

  return (
    <div className="ajustes-container">
      <div className="header">
        <h1>Ajustes</h1>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="logout-icon" /> Cerrar Sesión
        </button>
      </div>

      {/* Configuración de Idioma */}
      <div className="ajustes-section">
        <div className="section-header">
          <FaLanguage className="section-icon" />
          <h2>Idioma</h2>
        </div>
        <label htmlFor="language-select" className="section-label">Selecciona tu idioma:</label>
        <select id="language-select" value={language} onChange={handleLanguageChange} className="section-select">
          <option value="es">Español</option>
          <option value="en">Inglés</option>
          <option value="fr">Francés</option>
          <option value="de">Alemán</option>
          {/* Agrega más idiomas según sea necesario */}
        </select>
      </div>

      {/* Configuración de Notificaciones */}
      <div className="ajustes-section">
        <div className="section-header">
          <FaBell className="section-icon" />
          <h2>Notificaciones</h2>
        </div>
        <div className="switch-container">
          <label className="switch">
            <input
              type="checkbox"
              name="email"
              checked={notifications.email}
              onChange={handleNotificationsChange}
              aria-label="Notificaciones por Correo Electrónico"
            />
            <span className="slider"></span>
            <span className="switch-label">Correo Electrónico</span>
          </label>
          <label className="switch">
            <input
              type="checkbox"
              name="sms"
              checked={notifications.sms}
              onChange={handleNotificationsChange}
              aria-label="Notificaciones por SMS"
            />
            <span className="slider"></span>
            <span className="switch-label">SMS</span>
          </label>
          <label className="switch">
            <input
              type="checkbox"
              name="push"
              checked={notifications.push}
              onChange={handleNotificationsChange}
              aria-label="Notificaciones Push"
            />
            <span className="slider"></span>
            <span className="switch-label">Push</span>
          </label>
        </div>
      </div>

      {/* Configuración de Facturación */}
      <div className="ajustes-section">
        <div className="section-header">
          <FaCreditCard className="section-icon" />
          <h2>Facturación</h2>
        </div>
        <p>Gestiona tus métodos de pago, visualiza tus facturas y suscripciones.</p>
        <button onClick={handleManagePayments} className="action-button">
          <FaMoneyBillAlt className="action-icon" /> Gestionar Métodos de Pago
        </button>
      </div>

      {/* Configuración de Integraciones */}
      <div className="ajustes-section">
        <div className="section-header">
          <FaCog className="section-icon" />
          <h2>Integraciones</h2>
        </div>
        <p>Aquí puedes conectar con tus herramientas favoritas como Google Calendar, plataformas de pago, etc.</p>
        <button onClick={handleConnectIntegration} className="action-button">
          <FaCalendarCheck className="action-icon" /> Conectar Google Calendar
        </button>
      </div>

      {/* Configuración de Preferencias de Comunicación */}
      <div className="ajustes-section">
        <div className="section-header">
          <FaCog className="section-icon" />
          <h2>Preferencias de Comunicación</h2>
        </div>
        <p>Ajusta cómo y cuándo deseas recibir comunicaciones.</p>
        {/* Puedes agregar más preferencias según sea necesario */}
      </div>

      {/* Configuración de Seguridad */}
      <div className="ajustes-section">
        <div className="section-header">
          <FaShieldAlt className="section-icon" />
          <h2>Seguridad</h2>
        </div>
        <p>Aquí puedes gestionar tu configuración de seguridad, como cambiar contraseña y activar 2FA.</p>
        <button onClick={handleChangePassword} className="action-button">
          <FaKey className="action-icon" /> Cambiar Contraseña
        </button>
        <button onClick={() => console.log("Activar 2FA")} className="action-button">
          <FaLock className="action-icon" /> Activar 2FA
        </button>
      </div>

      {/* Configuración de Soporte */}
      <div className="ajustes-section">
        <div className="section-header">
          <FaQuestionCircle className="section-icon" />
          <h2>Soporte</h2>
        </div>
        <p>Aquí puedes contactar con el soporte o acceder a recursos de ayuda.</p>
        <button onClick={handleContactSupport} className="action-button">
          <FaQuestionCircle className="action-icon" /> Contactar Soporte
        </button>
      </div>

      {/* Novedades */}
      <div className="ajustes-section">
        <div className="section-header">
          <FaNewspaper className="section-icon" />
          <h2>Novedades</h2>
        </div>
        <p>Aquí puedes ver las últimas novedades y actualizaciones.</p>
        {/* Puedes listar actualizaciones o enlaces a un blog de novedades */}
      </div>

      {/* Botón Guardar */}
      <div className="save-button-container">
        <button onClick={handleSave} className="save-button">Guardar Cambios</button>
      </div>
    </div>
  );
};

export default Ajustes;
