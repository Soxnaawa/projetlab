import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/about">À propos</Link>
          <Link to="/courses">Cours</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <p className="copyright">
          &copy; {new Date().getFullYear()} AI Academy. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;