import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
    import Reserva from './Reserva';
    import Admin from './Admin';

    export default function App() {
      return (
        <Router>
          <nav style={styles.nav}>
            <Link to="/" style={styles.link}>Fazer Reserva</Link>
            <Link to="/admin" style={styles.link}>Admin</Link>
          </nav>
          <Routes>
            <Route path="/" element={<Reserva />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      );
    }

    const styles = {
      nav: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#8B4513' // Marrom terracota
      },
      link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    };
