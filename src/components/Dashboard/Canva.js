// src/components/Canva.js
import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CanvasArea from './CanvasArea';
import ToolPanel from './ToolPanel';
import "./canva.css"

const Canva = () => {
  const [fileName, setFileName] = useState('Diseño sin título');
  const [zoom, setZoom] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [activeTool, setActiveTool] = useState('text');

  const addTextToCanvas = useRef(null); // Ref para la función de añadir texto
  const addElementToCanvas = useRef(null); // Ref para la función de añadir elementos

  const handleSetZoom = (newZoom) => {
    setZoom(newZoom);
  };

  const handleSetCanvasSize = (width, height) => {
    setCanvasSize({ width, height });
  };

  const handleDownloadCanvas = () => {
    console.log('Descargando el canvas...');
  };

  return (
    <div className="Canva-container">
      <TopBar
        fileName={fileName}
        setFileName={setFileName}
        setZoom={handleSetZoom}
        setCanvasSize={handleSetCanvasSize}
        downloadCanvas={handleDownloadCanvas}
      />
      <div className="Canva-main-content">
        <Sidebar setActiveTool={setActiveTool} />
        <CanvasArea
          canvasSize={canvasSize}
          zoom={zoom}
          addTextToCanvas={addTextToCanvas}
          addElementToCanvas={addElementToCanvas}
        />
        <ToolPanel
          activeTool={activeTool}
          addTextToCanvas={(text) => addTextToCanvas.current(text)}
          addElementToCanvas={(element) => addElementToCanvas.current(element)}
        />
      </div>
    </div>
  );
};

export default Canva;
