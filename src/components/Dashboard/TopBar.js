// src/components/TopBar.js
import React, { useState } from 'react';

const TopBar = ({ fileName, setFileName, setZoom, setCanvasSize, downloadCanvas }) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomChange = () => {
    const newZoom = prompt('Ingrese el nuevo nivel de zoom (%)', zoomLevel);
    if (newZoom) {
      setZoomLevel(newZoom);
      setZoom(newZoom);
    }
  };

  const handleCanvasSizeChange = (event) => {
    const selectedSize = event.target.value;

    switch (selectedSize) {
      case '9:16':
        setCanvasSize(720, 1280);
        break;
      case '16:9':
        setCanvasSize(1280, 720);
        break;
      case 'square':
        setCanvasSize(800, 800);
        break;
      default:
        break;
    }
  };

  return (
    <div className="Canva-topbar">
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Nombre del archivo"
        className="Canva-filename-input"
      />
      <button onClick={handleZoomChange}>Zoom: {zoomLevel}%</button>
      <select onChange={handleCanvasSizeChange} className="Canva-canvas-size-dropdown">
        <option value="default">Tamaño del Canva</option>
        <option value="9:16">9:16</option>
        <option value="16:9">16:9</option>
        <option value="square">Cuadrado</option>
      </select>
      <button onClick={downloadCanvas}>Descargar</button>
    </div>
  );
};

export default TopBar;
