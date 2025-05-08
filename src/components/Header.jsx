import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>AI Academy</h1>
          </Link>
        </div>
        <nav>
          <ul>
            <li><NavLink to="/" end>Accueil</NavLink></li>
            <li><NavLink to="/about">À propos</NavLink></li>
            <li><NavLink to="/courses">Cours</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/member">Espace Membre</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;