import React, { useState } from 'react';
import './ListadePublicaciones.css'; // Importar estilos CSS
import {
  Grid,
  List as ListIcon,
  Calendar,
  Edit3,
  Trash2,
  Instagram,
  Youtube,
  Search,
  Music2,
} from 'lucide-react';

// Importar los componentes de pestañas personalizados
import { Tabs, TabsList, TabsTrigger } from '../ComponentsReutilizables/tabs.tsx';
import PopupNuevaPublicacion from './PopupNuevaPublicacion'; // Popup para una nueva publicación
import PopupSubidaVideo from './PopupSubidaVideo'; // Popup para subir video a YouTube
import PopupSubidaInstagram from './PopupSubidaInstagram'; // Nuevo Popup para Instagram
import PopupSubidaTikTok from './PopupSubidaTikTok'; // Nuevo Popup para TikTok

const ListadePublicaciones = () => {
  // Estado para filtros y vista
  const [redSocial, setRedSocial] = useState('Todas');
  const [vista, setVista] = useState('cuadricula');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el popup de nueva publicación
  const [showVideoPopup, setShowVideoPopup] = useState(false); // Estado para controlar el popup de video de YouTube
  const [showInstagramPopup, setShowInstagramPopup] = useState(false); // Estado para controlar el popup de Instagram
  const [showTikTokPopup, setShowTikTokPopup] = useState(false); // Estado para controlar el popup de TikTok

  // Datos de ejemplo de publicaciones
  const publicaciones = [
    {
      id: 1,
      titulo: 'Mi primer video de TikTok',
      fecha: '2023-10-01 10:00',
      estado: 'Programada',
      plataforma: 'TikTok',
    },
    {
      id: 2,
      titulo: 'Nuevo post en Instagram',
      fecha: '2023-10-02 12:00',
      estado: 'Publicada',
      plataforma: 'Instagram',
    },
    {
      id: 3,
      titulo: 'Tutorial de React en YouTube',
      fecha: '2023-10-03 15:00',
      estado: 'En Cola',
      plataforma: 'YouTube',
    },
    // ...más publicaciones
  ];

  // Funciones para manejar eventos
  const manejarRedSocial = (red) => setRedSocial(red);
  const manejarVista = (tipoVista) => setVista(tipoVista);
  const manejarEstadoFiltro = (estado) => setEstadoFiltro(estado);
  const manejarBusqueda = (e) => setBusqueda(e.target.value);

  const editarPublicacion = (id) => {
    console.log(`Editar publicación con ID: ${id}`);
  };

  const eliminarPublicacion = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      console.log(`Eliminar publicación con ID: ${id}`);
    }
  };

  // Funciones para controlar los popups
  const abrirPopup = () => setShowPopup(true);
  const cerrarPopup = () => setShowPopup(false);

  const abrirVideoPopup = () => setShowVideoPopup(true);
  const cerrarVideoPopup = () => setShowVideoPopup(false);

  const abrirInstagramPopup = () => setShowInstagramPopup(true);
  const cerrarInstagramPopup = () => setShowInstagramPopup(false);

  const abrirTikTokPopup = () => setShowTikTokPopup(true);
  const cerrarTikTokPopup = () => setShowTikTokPopup(false);

  // Filtrar publicaciones según los filtros aplicados
  const publicacionesFiltradas = publicaciones.filter((pub) => {
    const coincideRedSocial = redSocial === 'Todas' || pub.plataforma === redSocial;
    const coincideEstado = estadoFiltro === 'Todos' || pub.estado === estadoFiltro;
    const coincideBusqueda = pub.titulo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideRedSocial && coincideEstado && coincideBusqueda;
  });

  return (
    <div className="contenedor-publicaciones">
      <h1>Gestión de Publicaciones</h1>
      <div className="filtros-superiores">
        <Tabs value={redSocial} onValueChange={manejarRedSocial}>
          <TabsList>
            <TabsTrigger value="Todas">Todas</TabsTrigger>
            <TabsTrigger value="Instagram">Instagram</TabsTrigger>
            <TabsTrigger value="TikTok">TikTok</TabsTrigger>
            <TabsTrigger value="YouTube">YouTube</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="campo-busqueda">
          <Search />
          <input
            type="text"
            placeholder="Buscar publicaciones..."
            value={busqueda}
            onChange={manejarBusqueda}
          />
        </div>
        <div className="botones-nueva-publicacion">
          <button className="btn-nueva-publicacion" onClick={abrirPopup}>
            + Nueva Publicación
          </button>
          <button className="btn-nueva-publicacion" onClick={abrirVideoPopup}>
            + Subir Video a YouTube
          </button>
          <button className="btn-nueva-publicacion" onClick={abrirInstagramPopup}>
            + Subir Publicación a Instagram
          </button>
          <button className="btn-nueva-publicacion" onClick={abrirTikTokPopup}>
            + Subir Video a TikTok
          </button>
        </div>
      </div>
      <div className="controles-vista">
        <div className="vista-iconos">
          <Grid className={vista === 'cuadricula' ? 'activo' : ''} onClick={() => manejarVista('cuadricula')} />
          <ListIcon className={vista === 'lista' ? 'activo' : ''} onClick={() => manejarVista('lista')} />
          <Calendar className={vista === 'calendario' ? 'activo' : ''} onClick={() => manejarVista('calendario')} />
        </div>
        <div className="filtro-estado">
          <select onChange={(e) => manejarEstadoFiltro(e.target.value)}>
            <option value="Todos">Todos los Estados</option>
            <option value="Programada">Programada</option>
            <option value="En Cola">En Cola</option>
            <option value="Publicada">Publicada</option>
          </select>
        </div>
      </div>
      {vista === 'calendario' ? (
        <div className="vista-calendario">
          <p>Vista de calendario en construcción.</p>
        </div>
      ) : (
        <div className={`lista-publicaciones ${vista}`}>
          {publicacionesFiltradas.map((pub) => (
            <div key={pub.id} className="tarjeta-publicacion">
              <div className="info-publicacion">
                <h3>{pub.titulo}</h3>
                <p>{pub.fecha}</p>
                <span className={`estado ${pub.estado.toLowerCase().replace(' ', '-')}`}>
                  {pub.estado}
                </span>
              </div>
              <div className="icono-plataforma">
                {pub.plataforma === 'Instagram' && <Instagram />}
                {pub.plataforma === 'TikTok' && <Music2 />}
                {pub.plataforma === 'YouTube' && <Youtube />}
              </div>
              <div className="acciones">
                <Edit3 onClick={() => editarPublicacion(pub.id)} />
                <Trash2 onClick={() => eliminarPublicacion(pub.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
      {showPopup && <PopupNuevaPublicacion onClose={cerrarPopup} />}
      {showVideoPopup && <PopupSubidaVideo onClose={cerrarVideoPopup} />}
      {showInstagramPopup && <PopupSubidaInstagram onClose={cerrarInstagramPopup} />}
      {showTikTokPopup && <PopupSubidaTikTok onClose={cerrarTikTokPopup} />}
    </div>
  );
};

export default ListadePublicaciones;
