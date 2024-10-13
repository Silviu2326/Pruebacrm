import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ComponentsReutilizables/tabs.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import './CommandPopup.css';

const CommandPopup = ({ setRoutineName }) => {  
  const [commandMessages, setCommandMessages] = useState([]);
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("comandos");
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingRoutineName, setAwaitingRoutineName] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [theme, setTheme] = useState('light');  // Estado para manejar el tema (default: light)
  const navigate = useNavigate();
  const location = useLocation();

  // Función para actualizar el tema basado en las clases del contenedor App
  const updateTheme = () => {
    const appElement = document.querySelector('.App');
    if (appElement) {
      console.log('App classes detected:', appElement.classList);
      if (appElement.classList.contains('dark-mode')) {
        console.log('Theme set to dark');
        setTheme('dark');
      } else if (appElement.classList.contains('light')) {
        console.log('Theme set to light');
        setTheme('light');
      }
    }
  };

  // Detectar el tema inicial y suscribirse a los cambios en las clases del contenedor App
  useEffect(() => {
    const appElement = document.querySelector('.App');
    if (appElement) {
      updateTheme();  // Configuración inicial del tema

      // Configuración del MutationObserver para detectar cambios en las clases de App
      const observer = new MutationObserver(() => {
        updateTheme();
      });

      // Configuramos el observer para monitorear cambios en los atributos
      observer.observe(appElement, { attributes: true, attributeFilter: ['class'] });

      // Cleanup cuando se desmonta el componente
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = { text: inputValue, sender: "user" };
      setCommandMessages((prevMessages) => [...prevMessages, newMessage]);

      if (activeTab === "comandos") {
        if (awaitingRoutineName) {
          const routineName = inputValue.trim();
          setRoutineName(routineName);
          setCommandMessages((prevMessages) => [...prevMessages, { text: `Nombre de rutina establecido: ${routineName}`, sender: "system" }]);
          setAwaitingRoutineName(false);
          setInputValue("");
          return;
        }

        if (inputValue.toLowerCase() === "vamos a rutinas") {
          setCommandMessages((prevMessages) => [...prevMessages, { text: "Navegando a Crear Rutina", sender: "system" }]);
          setIsLoading(true);

          setTimeout(() => {
            setIsLoading(false);
            navigate("/rutinaaasss", { state: { keepCommandPopup: true } });
            setTimeout(() => {
              const createRoutineButton = document.querySelector('.Rutinaaaasss-btn-create');
              if (createRoutineButton) {
                createRoutineButton.click();
                setAwaitingRoutineName(true);
                setCommandMessages((prevMessages) => [...prevMessages, { text: "¿Cómo quieres llamar a la rutina?", sender: "system" }]);
              }
            }, 500);
          }, 2000);
        }
      } else {
        setAssistantMessages((prevMessages) => [...prevMessages, newMessage]);
        if (inputValue.toLowerCase() === "hola") {
          setAssistantMessages((prevMessages) => [...prevMessages, { text: "Muy bien, esta es la sección de clientes", sender: "assistant" }]);
        } else {
          setTimeout(() => {
            const assistantMessage = { text: "Este es un mensaje automático del asistente.", sender: "assistant" };
            setAssistantMessages((prevMessages) => [...prevMessages, assistantMessage]);
          }, 1000);
        }
      }
      setInputValue("");
    }
  };

  useEffect(() => {
    const handlePopstate = () => {
      const commandPopup = document.querySelector('#command-popup');
      if (commandPopup) {
        commandPopup.style.display = 'block';
      }
    };

    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  return (
    <CSSTransition in={showPopup} timeout={500} classNames="CommandPopup-transition" unmountOnExit>
      <div id="command-popup" className={`CommandPopup-container ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
        {/* Botón de cerrar */}
        <button 
          className="CommandPopup-closeButton" 
          onClick={() => setShowPopup(false)}
        >
          &times;
        </button>
        <Tabs defaultValue="comandos" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="CommandPopup-tabsList">
            <TabsTrigger value="comandos" className="CommandPopup-tabTrigger">Comandos</TabsTrigger>
            <TabsTrigger value="asistente" className="CommandPopup-tabTrigger">Asistente</TabsTrigger>
          </TabsList>
          <TabsContent value="comandos">
            <div className="CommandPopup-messagesContainer">
              {commandMessages.map((message, index) => (
                <div
                  key={index}
                  className={`CommandPopup-message ${message.sender === "user" ? "CommandPopup-userMessage" : "CommandPopup-systemMessage"}`}
                >
                  {message.text}
                </div>
              ))}
              {isLoading && <div className="CommandPopup-loadingMessage">Cargando...</div>}
            </div>
            <div className="CommandPopup-inputContainer">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={awaitingRoutineName ? "Ingresa el nombre de la rutina..." : "Ingrese un comando..."}
                className="CommandPopup-inputField"
              />
              <button
                onClick={handleSend}
                style={{
                  background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)',
                  color: 'var(--button-text-dark)',
                  border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginLeft: '10px',
                  transition: 'background 0.3s ease',
                }}
              >
                Enviar
              </button>
            </div>
          </TabsContent>
          <TabsContent value="asistente">
            <div className="CommandPopup-messagesContainer">
              {assistantMessages.map((message, index) => (
                <div
                  key={index}
                  className={`CommandPopup-message ${message.sender === "user" ? "CommandPopup-userMessage" : "CommandPopup-assistantMessage"}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="CommandPopup-inputContainer">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ingrese su consulta..."
                className="CommandPopup-inputField"
              />
              <button
                onClick={handleSend}
                style={{
                  background: theme === 'dark' ? 'var(--button-bg-darkk)' : 'var(--button-bg-light)',
                  color: 'var(--button-text-dark)',
                  border: theme === 'dark' ? 'var(--button-border-dark)' : 'var(--button-border-light)',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginLeft: '10px',
                  transition: 'background 0.3s ease',
                }}
              >
                Enviar
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CSSTransition>
  );
};

export default CommandPopup;
