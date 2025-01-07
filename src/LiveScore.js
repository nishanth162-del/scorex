import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Activity, Clock, Eye, Trophy } from 'lucide-react';

const LiveScores = () => {
  const [liveMatches, setLiveMatches] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const liveMatchesRef = ref(db, "liveMatches");

    onValue(liveMatchesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLiveMatches(data);
      } else {
        setLiveMatches({});
      }
    });
  }, []);

  const handleViewMatch = (matchId) => {
    console.log("matchId", matchId);
    if (matchId) {
      navigate(`/live/${matchId}`);
    } else {
      console.error("Invalid matchId, cannot navigate.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Activity size={32} style={styles.headerIcon} />
        <h1 style={styles.title}>Live Scores</h1>
      </div>

      <div style={styles.matchesContainer}>
        {Object.keys(liveMatches).length > 0 ? (
          Object.keys(liveMatches).map((matchId) => {
            const match = liveMatches[matchId];
            return (
              <div key={matchId} style={styles.card} className="match-card">
                <div style={styles.teamsSection}>
                  <Trophy size={24} style={styles.teamIcon} />
                  <div style={styles.teamNames}>
                    <span style={styles.teamName}>{match.teamA}</span>
                    <span style={styles.vsText}>vs</span>
                    <span style={styles.teamName}>{match.teamB}</span>
                  </div>
                </div>

                <div style={styles.scoreSection}>
                  <div style={styles.scoreDisplay}>
                    <span style={styles.score}>{match.runs}/{match.wickets}</span>
                    <span style={styles.overs}>({match.overs}.{match.balls % 6})</span>
                  </div>
                  <div style={styles.statusBadge}>
                    {match.status}
                  </div>
                </div>

                <div style={styles.timeSection}>
                  <Clock size={16} style={styles.clockIcon} />
                  <span style={styles.timeText}>
                    {new Date(match.lastUpdated).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => handleViewMatch(matchId)}
                  style={styles.viewButton}
                  className="view-button"
                >
                  <Eye size={16} style={styles.buttonIcon} />
                  View Match Live
                </button>
              </div>
            );
          })
        ) : (
          <div style={styles.noMatches}>
            <Activity size={48} style={styles.noMatchesIcon} />
            <p style={styles.noMatchesText}>No live matches at the moment.</p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes cardEntrance {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulseGlow {
            0% { box-shadow: 0 0 5px rgba(96, 239, 255, 0.2); }
            50% { box-shadow: 0 0 20px rgba(96, 239, 255, 0.4); }
            100% { box-shadow: 0 0 5px rgba(96, 239, 255, 0.2); }
          }

          .match-card {
            animation: cardEntrance 0.4s ease-out;
            animation-fill-mode: both;
          }

          .match-card:hover {
            transform: translateY(-5px);
            animation: pulseGlow 2s infinite;
          }

          .view-button:hover {
            background: linear-gradient(45deg, rgba(96, 239, 255, 0.2), rgba(26, 26, 46, 0.8));
            transform: scale(1.05);
          }

          .match-card:nth-child(1) { animation-delay: 0.1s; }
          .match-card:nth-child(2) { animation-delay: 0.2s; }
          .match-card:nth-child(3) { animation-delay: 0.3s; }
          .match-card:nth-child(4) { animation-delay: 0.4s; }
          .match-card:nth-child(5) { animation-delay: 0.5s; }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
    padding: "20px",
  },
  headerIcon: {
    color: "#60efff",
    marginRight: "15px",
  },
  title: {
    color: "#60efff",
    fontSize: "36px",
    fontFamily: "Orbitron, sans-serif",
    fontWeight: "600",
  },
  matchesContainer: {
    display: "grid",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    borderRadius: "15px",
    backgroundColor: "rgba(26, 26, 46, 0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(96, 239, 255, 0.1)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  teamsSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  teamIcon: {
    color: "#60efff",
    marginRight: "15px",
  },
  teamNames: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  teamName: {
    color: "#e0e0e0",
    fontSize: "18px",
    fontWeight: "600",
  },
  vsText: {
    color: "#60efff",
    fontSize: "16px",
    opacity: "0.8",
  },
  scoreSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  scoreDisplay: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
  },
  score: {
    color: "#60efff",
    fontSize: "24px",
    fontWeight: "bold",
  },
  overs: {
    color: "#e0e0e0",
    fontSize: "16px",
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: "20px",
    backgroundColor: "rgba(96, 239, 255, 0.1)",
    color: "#60efff",
    fontSize: "14px",
  },
  timeSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  clockIcon: {
    color: "#60efff",
  },
  timeText: {
    color: "#e0e0e0",
    fontSize: "14px",
  },
  viewButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "rgba(96, 239, 255, 0.1)",
    border: "1px solid rgba(96, 239, 255, 0.2)",
    borderRadius: "8px",
    color: "#60efff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "Orbitron, sans-serif",
    fontSize: "14px",
  },
  buttonIcon: {
    color: "#60efff",
  },
  noMatches: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    backgroundColor: "rgba(26, 26, 46, 0.8)",
    borderRadius: "15px",
    gap: "20px",
  },
  noMatchesIcon: {
    color: "#60efff",
    opacity: "0.5",
  },
  noMatchesText: {
    color: "#e0e0e0",
    fontSize: "18px",
    textAlign: "center",
  },
};

export default LiveScores;