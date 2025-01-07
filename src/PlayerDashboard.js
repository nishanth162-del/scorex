import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useNavigate } from "react-router-dom"; // Updated to useNavigate
import { motion } from "framer-motion"; // Animation library for React

const PlayerDashboard = () => {
  const [hostedMatches, setHostedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Using useNavigate instead of useHistory

  useEffect(() => {
    const fetchAllMatches = () => {
      const db = getDatabase();
      const tournamentsRef = ref(db, "tournaments/");

      onValue(tournamentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const allTournaments = Object.entries(data).map(([id, tournament]) => ({
            id,
            ...tournament,
          }));

          setHostedMatches(allTournaments);
        } else {
          setHostedMatches([]);
        }
        setLoading(false);
      });
    };

    fetchAllMatches();
  }, []);

  const handleStartMatch = (tournamentId, passcode, tournamentDetails) => {
    const enteredPasscode = prompt("Enter Passcode to Start the Match");

    if (enteredPasscode === passcode) {
      // Update the match status to "ongoing"
      const db = getDatabase();
      const tournamentRef = ref(db, `tournaments/${tournamentId}`);

      update(tournamentRef, { status: "ongoing" })
        .then(() => {
          // Redirect to the score page with the tournamentId
          navigate(`/score/${tournamentId}`, { state: { gameType: tournamentDetails.gameType } });
        })
        .catch((error) => {
          console.error("Error updating tournament status:", error);
          alert("There was an issue starting the match. Try again.");
        });
    } else {
      alert("Incorrect Passcode. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <motion.h2 style={styles.heading} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        All Tournaments <span role="img" aria-label="trophy">🏆</span>
      </motion.h2>
      {loading ? (
        <p style={styles.loadingText}>Loading...</p>
      ) : hostedMatches.length === 0 ? (
        <p style={styles.noTournamentsText}>No tournaments found. Create one to get started!</p>
      ) : (
        <motion.ul style={styles.matchesList} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          {hostedMatches.map((match) => (
            <motion.li
              key={match.id}
              style={styles.matchCard}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={styles.matchTitle}>{match.tournamentName}</h3>
              <p style={styles.gameType}>Game: {match.gameType}</p>
              <p style={styles.scheduleType}>Schedule: {match.scheduleType}</p>
              <p style={styles.teamsTitle}>Teams:</p>
              <ul style={styles.teamsList}>
                {match.teams.map((team, index) => (
                  <li key={index} style={styles.teamItem}>{team.name}</li>
                ))}
              </ul>
              <motion.button
                onClick={() => handleStartMatch(match.id, match.passcode, match)}
                style={styles.startButton}
                whileHover={{ backgroundColor: "#1f6ed4" }}
                whileTap={{ scale: 0.95 }}
              >
                Start Match
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {/* Removed motion from image as it's not visible */}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Poppins', sans-serif", // New font family for a clean and modern look
  },
  heading: {
    textAlign: "center",
    fontSize: "36px",
    color: "#34495e",
    fontWeight: "700",
    marginBottom: "20px",
    letterSpacing: "1px",
    fontFamily: "'Lobster', cursive", // Stylish font for the heading
  },
  loadingText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#7f8c8d",
  },
  noTournamentsText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#e74c3c",
    fontWeight: "600",
  },
  matchesList: {
    listStyleType: "none",
    padding: "0",
  },
  matchCard: {
    backgroundColor: "#ecf0f1",
    marginBottom: "20px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  matchTitle: {
    fontSize: "24px",
    color: "#2c3e50",
    fontWeight: "600",
    marginBottom: "10px",
  },
  gameType: {
    fontSize: "18px",
    color: "#3498db", // New blue shade
    fontWeight: "500",
  },
  scheduleType: {
    fontSize: "18px",
    color: "#9b59b6",
  },
  teamsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2ecc71",
    marginTop: "10px",
  },
  teamsList: {
    listStyleType: "none",
    paddingLeft: "0",
    marginTop: "5px",
  },
  teamItem: {
    fontSize: "16px",
    color: "#2c3e50",
    fontWeight: "500",
  },
  startButton: {
    backgroundColor: "#2980b9", // New deeper blue shade for the button
    color: "#fff",
    border: "none",
    padding: "12px 25px",
    borderRadius: "30px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.3s",
    marginTop: "15px",
  },
};

export default PlayerDashboard;
