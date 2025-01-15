import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Reserva from './Reserva';
import Admin from './Admin';
import { supabase } from './lib/supabaseClient';

const NavBar = () => {
  const location = useLocation();

  if (location.pathname !== '/admin') {
    return null;
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>Fazer Reserva</Link>
      <Link to="/admin" style={styles.link}>Admin</Link>
    </nav>
  );
};

const App = () => {
  const [fontSizePopup, setFontSizePopup] = useState(16); // Add state for font size

  useEffect(() => {
    fetchFontSize();
  }, []);

  const fetchFontSize = async () => {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('fontSizePopup')
      .single();

    if (!error && data) {
      setFontSizePopup(data.fontSizePopup);
    }
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Reserva fontSize={fontSizePopup} />} /> {/* Pass fontSize to Reserva */}
        <Route path="/admin" element={<Admin setFontSizePopup={setFontSizePopup} />} /> {/* Pass function to Admin */}
      </Routes>
    </Router>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#8B4513' 
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

export default App;
