// src/components/Sidebar.js
import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_text_format } from 'react-icons-kit/md/ic_text_format';
import { ic_layers } from 'react-icons-kit/md/ic_layers';
import { ic_brush } from 'react-icons-kit/md/ic_brush';
import { ic_lightbulb_outline } from 'react-icons-kit/md/ic_lightbulb_outline';
import { ic_settings } from 'react-icons-kit/md/ic_settings';

const Sidebar = ({ setActiveTool }) => {
  const [activeTool, setActiveToolState] = useState('text'); // Estado para la herramienta activa

  const handleToolClick = (tool) => {
    setActiveToolState(tool);
    setActiveTool(tool);
  };

  return (
    <div className="Canva-sidebar">
      <div
        className={`Canva-sidebar-icon ${activeTool === 'text' ? 'active' : ''}`}
        onClick={() => handleToolClick('text')}
      >
        <Icon icon={ic_text_format} size={24} />
      </div>
      <div
        className={`Canva-sidebar-icon ${activeTool === 'elements' ? 'active' : ''}`}
        onClick={() => handleToolClick('elements')}
      >
        <Icon icon={ic_layers} size={24} />
      </div>
      <div
        className={`Canva-sidebar-icon ${activeTool === 'draw' ? 'active' : ''}`}
        onClick={() => handleToolClick('draw')}
      >
        <Icon icon={ic_brush} size={24} />
      </div>
      <div
        className={`Canva-sidebar-icon ${activeTool === 'ia' ? 'active' : ''}`}
        onClick={() => handleToolClick('ia')}
      >
        <Icon icon={ic_lightbulb_outline} size={24} />
      </div>
      <div
        className={`Canva-sidebar-icon ${activeTool === 'control' ? 'active' : ''}`}
        onClick={() => handleToolClick('control')}
      >
        <Icon icon={ic_settings} size={24} />
      </div>
    </div>
  );
};

export default Sidebar;
