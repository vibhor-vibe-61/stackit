import React, { useState, useEffect } from 'react';

const banners = [
  {
    text: 'Welcome to StackIt! Ask and answer questions, share knowledge, and grow together.',
    bg: '#1976d2',
    color: '#fff',
  },
  {
    text: 'Join our community and start building your reputation today!',
    bg: '#fffde7',
    color: '#1976d2',
  },
  {
    text: 'Tip: Use tags to help others find your questions faster.',
    bg: '#e3f2fd',
    color: '#111',
  },
];

const SliderBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100%',
      minHeight: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: banners[current].bg,
      color: banners[current].color,
      fontWeight: 700,
      fontSize: '1.1rem',
      letterSpacing: '0.01em',
      transition: 'background 0.5s, color 0.5s',
      borderRadius: '0 0 1.5rem 1.5rem',
      boxShadow: '0 2px 8px 0 rgba(33, 150, 243, 0.08)',
      marginBottom: '1.5rem',
      padding: '0.7rem 1.5rem',
      textAlign: 'center',
      zIndex: 10,
      position: 'relative',
    }}>
      {banners[current].text}
    </div>
  );
};

export default SliderBanner; 