import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';
import Arrow from "../image/Arrow.png";
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="toggle-btn" onClick={toggleSidebar}>
                <img src={Arrow} alt="Toggle Sidebar" />
            </div>
            <div className="sidebar-content">
                <h2>편의점 찾기</h2>
                <div className="search-bar">
                    <input type="text" placeholder="Search" />
                    <button type="submit">Q</button>
                </div>
                <div className="filter-options">
                    <label>
                        <input type="checkbox" /> 오픈 / OPEN
                    </label>
                    <label>
                        <input type="checkbox" /> ATM
                    </label>
                    <label>
                        <input type="checkbox" /> My Favorites
                    </label>
                    <label>
                        <input type="checkbox" /> 2+1
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;