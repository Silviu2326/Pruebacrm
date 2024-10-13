import React from 'react';
import './Tab.css';

const Tab = ({ label, isActive, onClick, theme}) => {
    return (
        <button className={`tablinks ${theme} ${isActive ? 'active' : ''} draggable-handle`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Tab;
