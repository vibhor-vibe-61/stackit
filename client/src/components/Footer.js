import React from 'react';

const Footer = () => (
  <footer style={{
    width: '100%',
    background: '#e3f2fd',
    color: '#1976d2',
    textAlign: 'center',
    padding: '1.2rem 0 1.2rem 0',
    fontWeight: 600,
    fontSize: '1.05rem',
    borderTop: '2px solid #bbdefb',
    marginTop: '2rem',
    letterSpacing: '0.01em',
  }}>
    &copy; {new Date().getFullYear()} Empowering Collaborative Learning
  </footer>
);

export default Footer; 