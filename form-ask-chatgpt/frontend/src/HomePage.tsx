import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const styles = {
    app: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#000000',  
      fontFamily: 'Arial, sans-serif',
    },
    chatFormContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContainer: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap' as 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: '#2B004A', 
      borderRadius: '15px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      textDecoration: 'none',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      width: '300px',
      margin: '20px',
      color: 'white',
    },
    cardContent: {
      padding: '20px',
      textAlign: 'center' as const,
    },
    cardTitle: {
      fontSize: '1.5rem',
      marginBottom: '10px',
      color: 'white', 
    },
    cardDescription: {
      fontSize: '1rem',
      color: '#d3d3d3', 
    },
  };

  return (
    <div style={styles.app}>
      <div style={styles.chatFormContainer}>
        <div style={styles.cardContainer}>
          <Link to="/specific-video" style={styles.card}>
            <div style={styles.cardContent}>
              <h2 style={styles.cardTitle}>Consultar un video específico</h2>
              <p style={styles.cardDescription}>
                Haz clic aquí para buscar un video específico en la base de datos.
              </p>
            </div>
          </Link>
          <Link to="/general" style={styles.card}>
            <div style={styles.cardContent}>
              <h2 style={styles.cardTitle}>Consultar en todos los videos</h2>
              <p style={styles.cardDescription}>
                Encuentra información en todos los videos de nuestra colección.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
