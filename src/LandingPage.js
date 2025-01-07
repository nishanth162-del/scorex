import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Eye, Users, Activity, User } from 'lucide-react';

// Splash Screen Component
const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
      zIndex: 50,
      animation: 'fadeOut 0.5s ease-in-out forwards',
      animationDelay: '1.5s',
    }}>
      <h1 style={{
        fontSize: '72px',
        fontFamily: 'Orbitron, sans-serif',
        background: 'linear-gradient(45deg, #00ff87 0%, #60efff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'scaleIn 0.5s ease-in-out forwards',
        opacity: 0,
        transform: 'scale(0.3)',
        textShadow: '0 0 20px rgba(0, 255, 135, 0.5)',
      }}>
        ScoreX
      </h1>
    </div>
  );
};

const CardIcon = ({ type }) => {
  const iconProps = {
    size: 48,
    style: { 
      marginBottom: '20px',
      filter: 'drop-shadow(0 0 8px rgba(96, 239, 255, 0.3))',
      color: '#60efff'
    }
  };

  switch (type) {
    case 'host':
      return <Trophy {...iconProps} />;
    case 'watch':
      return <Eye {...iconProps} />;
    case 'teams':
      return <Users {...iconProps} />;
    case 'live':
      return <Activity {...iconProps} />;
    case 'profile':
      return <User {...iconProps} />;
    default:
      return null;
  }
};

const LandingPage = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome to ScoreX</h1>
        <div style={styles.buttonContainer}>
          {/* Host a Tournament */}
          <Link to="/host" style={styles.link}>
            <div style={styles.card}>
              <CardIcon type="host" />
              <h2 style={styles.cardTitle}>Host a Tournament</h2>
              <p style={styles.cardDescription}>
                Plan and manage tournaments, matches, and schedules for your favorite games.
              </p>
            </div>
          </Link>

          {/* Watch a Tournament */}
          <Link to="/watch" style={styles.link}>
            <div style={styles.card}>
              <CardIcon type="watch" />
              <h2 style={styles.cardTitle}>Watch a Tournament</h2>
              <p style={styles.cardDescription}>
                Follow live matches, check scores, and stay updated with ongoing tournaments.
              </p>
            </div>
          </Link>

          {/* View Teams and Players */}
          <Link to="/teams" style={styles.link}>
            <div style={styles.card}>
              <CardIcon type="teams" />
              <h2 style={styles.cardTitle}>View Teams & Players</h2>
              <p style={styles.cardDescription}>
                Browse through registered teams and players competing in the tournaments.
              </p>
            </div>
          </Link>

          <Link to="/live" style={styles.link}>
            <div style={styles.card}>
              <CardIcon type="live" />
              <h2 style={styles.cardTitle}>See Live Matches</h2>
              <p style={styles.cardDescription}>
                Browse through the live matches which are going on and watch the scores.
              </p>
            </div>
          </Link>

          {/* My Profile */}
          <Link to="/profile" style={styles.link}>
            <div style={styles.card}>
              <CardIcon type="profile" />
              <h2 style={styles.cardTitle}>My Profile</h2>
              <p style={styles.cardDescription}>
                Manage your profile, check tournament history, and access personal settings.
              </p>
            </div>
          </Link>
        </div>
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&display=swap');
          
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          
          @keyframes scaleIn {
            from { 
              opacity: 0;
              transform: scale(0.3);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }
          
          ${styles.card}:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 32px rgba(96, 239, 255, 0.2);
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.9));
            border: 1px solid rgba(96, 239, 255, 0.3);
          }
        `}
      </style>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  title: {
    fontSize: "48px",
    fontWeight: "900",
    background: 'linear-gradient(45deg, #00ff87 0%, #60efff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: "30px",
    fontFamily: "Orbitron, sans-serif",
    textAlign: "center",
    textShadow: "0 0 20px rgba(96, 239, 255, 0.3)",
  },
  buttonContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "1200px",
    position: "relative",
    zIndex: 1,
  },
  link: {
    textDecoration: "none",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    borderRadius: "15px",
    backgroundColor: "rgba(26, 26, 46, 0.8)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "1px solid rgba(96, 239, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#60efff",
    marginBottom: "15px",
    textAlign: "center",
    fontFamily: "Orbitron, sans-serif",
  },
  cardDescription: {
    fontSize: "16px",
    color: "#e0e0e0",
    textAlign: "center",
    lineHeight: "1.5",
  },
};

export default LandingPage;