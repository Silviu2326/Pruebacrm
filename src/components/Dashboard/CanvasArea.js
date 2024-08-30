// src/components/CanvasArea.js
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Rect, Circle, Triangle, Text } from 'fabric';

const CanvasArea = ({ canvasSize, zoom, addTextToCanvas, addElementToCanvas }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null); // Ref para almacenar la instancia de fabric.Canvas
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, target: null });

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose(); // Dispose the previous instance before creating a new one
    }

    const canvas = new Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
    });

    fabricCanvasRef.current = canvas; // Guardar la instancia de fabric.Canvas

    // Asegurarse de que el canvas esté ajustado al contenedor
    canvas.setWidth(canvasSize.width);
    canvas.setHeight(canvasSize.height);

    // Prevenir el menú contextual predeterminado
    canvas.on('mouse:down', (options) => {
      if (options.button === 3 && options.target) {
        // Mostrar el menú contextual personalizado
        setContextMenu({
          visible: true,
          x: options.e.clientX,
          y: options.e.clientY,
          target: options.target,
        });
        options.e.preventDefault(); // Prevenir el menú contextual predeterminado
      } else {
        // Ocultar el menú si se hace clic en cualquier otra parte
        setContextMenu({ ...contextMenu, visible: false });
      }
    });

    canvas.on('mouse:up', (options) => {
      if (options.e.button === 2) {
        options.e.preventDefault();
      }
    });

    // Función para añadir texto al canvas
    addTextToCanvas.current = (text) => {
      const textObject = new Text(text, {
        left: 50,
        top: 50,
        fill: 'black',
        fontSize: 20,
      });
      canvas.add(textObject);
    };

    // Función para añadir elementos al canvas
    addElementToCanvas.current = (element) => {
      let shape;
      switch (element) {
        case 'square':
          shape = new Rect({
            left: 50,
            top: 50,
            fill: 'red',
            width: 100,
            height: 100,
          });
          break;
        case 'circle':
          shape = new Circle({
            left: 100,
            top: 100,
            fill: 'green',
            radius: 50,
          });
          break;
        case 'triangle':
          shape = new Triangle({
            left: 150,
            top: 150,
            fill: 'blue',
            width: 100,
            height: 100,
          });
          break;
        default:
          break;
      }
      if (shape) {
        canvas.add(shape);
      }
    };

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose(); // Limpiar el canvas al desmontar
        fabricCanvasRef.current = null; // Evitar posibles fugas de memoria
      }
    };
  }, [canvasSize]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.transform = `scale(${zoom / 100})`;
    }
  }, [zoom]);
  const handleMenuAction = (action) => {
    const { target } = contextMenu;
    switch (action) {
      case 'delete':
        fabricCanvasRef.current.remove(target);
        break;
      case 'bringToFront':
        target.bringToFront();
        break;
      case 'sendToBack':
        target.sendToBack();
        break;
      default:
        break;
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <div className="Canva-canvas-area" style={{ position: 'relative' }}>
      <div className="canvas-container">
        <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
        {contextMenu.visible && (
          <div
            className="custom-context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <ul className="menu">
              <li onClick={() => handleMenuAction('delete')}>Eliminar</li>
              <li onClick={() => handleMenuAction('bringToFront')}>Traer al frente</li>
              <li onClick={() => handleMenuAction('sendToBack')}>Enviar atrás</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasArea;
