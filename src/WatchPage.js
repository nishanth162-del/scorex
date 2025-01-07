import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { motion } from "framer-motion"; // Animation library for React

const WatchPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const tournamentsRef = ref(db, "tournaments/");

    onValue(tournamentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedTournaments = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTournaments(formattedTournaments);
      }
    });
  }, []);

  const handleTournamentChange = (event) => {
    const tournamentId = event.target.value;
    const tournament = tournaments.find((t) => t.id === tournamentId);
    setSelectedTournament(tournament);
  };

  const calculatePointsTable = (teams, matches = []) => {
    if (!Array.isArray(matches)) {
      matches = Object.values(matches || {}); // Convert to array if it's an object
    }

    const pointsTable = teams.map((team) => ({
      name: team.name,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      points: 0,
    }));

    matches.forEach((match) => {
      const teamA = pointsTable.find((t) => t.name === match.teamA);
      const teamB = pointsTable.find((t) => t.name === match.teamB);

      if (!teamA || !teamB) return; // Skip if team data is missing

      if (match.status === "Completed") {
        teamA.played++;
        teamB.played++;
        if (match.winner === match.teamA) {
          teamA.won++;
          teamB.lost++;
          teamA.points += 3;
        } else if (match.winner === match.teamB) {
          teamB.won++;
          teamA.lost++;
          teamB.points += 3;
        }
      }
    });

    return pointsTable;
  };

  const getScheduledMatches = (matches) => {
    if (!Array.isArray(matches)) {
      matches = Object.values(matches || {}); // Convert to array if it's an object
    }
    return matches.filter((match) => match.status === "Scheduled");
  };

  return (
    <div style={styles.container}>
      <motion.h2
        style={styles.heading}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        🎮 Watch a Tournament 🏆
      </motion.h2>

      <label style={styles.selectLabel}>
        Select a Tournament:
        <select onChange={handleTournamentChange} defaultValue="" style={styles.select}>
          <option value="" disabled>
            -- Select a Tournament --
          </option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.tournamentName} - {tournament.gameType}
            </option>
          ))}
        </select>
      </label>

      {selectedTournament && (
        <div style={styles.tournamentDetails}>
          <h3 style={styles.tournamentName}>{selectedTournament.tournamentName}</h3>
          <p style={styles.gameType}>Game Type: {selectedTournament.gameType}</p>

          <h4 style={styles.sectionTitle}>Teams 🏅:</h4>
          <ul style={styles.teamList}>
            {selectedTournament.teams.map((team, index) => (
              <li key={index} style={styles.teamItem}>
                {team.name}
              </li>
            ))}
          </ul>

          <h4 style={styles.sectionTitle}>Points Table 📊:</h4>
          <table style={styles.pointsTable}>
            <thead>
              <tr>
                <th>Team</th>
                <th>Played</th>
                <th>Won</th>
                <th>Lost</th>
                <th>Tied</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {calculatePointsTable(
                selectedTournament.teams,
                selectedTournament.matches || []
              ).map((team, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td>{team.name}</td>
                  <td>{team.played}</td>
                  <td>{team.won}</td>
                  <td>{team.lost}</td>
                  <td>{team.tied}</td>
                  <td>{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 style={styles.sectionTitle}>Scheduled Matches 🗓️:</h4>
          <ul style={styles.scheduledMatches}>
            {getScheduledMatches(selectedTournament.matches || []).map(
              (match, index) => (
                <li key={index} style={styles.matchItem}>
                  {match.teamA} 🆚 {match.teamB} - {match.status}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#f8f9fa",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "40px",
    color: "#34495e",
    fontWeight: "700",
    marginBottom: "20px",
    letterSpacing: "1px",
  },
  selectLabel: {
    display: "block",
    fontSize: "18px",
    color: "#2c3e50",
    marginBottom: "15px",
    fontWeight: "500",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    fontWeight: "500",
    backgroundColor: "#ecf0f1",
    marginBottom: "30px",
    cursor: "pointer",
  },
  tournamentDetails: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  tournamentName: {
    fontSize: "28px",
    color: "#2c3e50",
    fontWeight: "600",
  },
  gameType: {
    fontSize: "18px",
    color: "#3498db",
    fontWeight: "500",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "22px",
    color: "#2ecc71",
    fontWeight: "600",
    marginBottom: "10px",
  },
  teamList: {
    listStyleType: "none",
    paddingLeft: "0",
    fontSize: "18px",
    color: "#2c3e50",
  },
  teamItem: {
    padding: "8px",
    borderBottom: "1px solid #ddd",
  },
  pointsTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    backgroundColor: "#2c3e50", // Dark background color for points table
    borderRadius: "8px",
  },
  pointsTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    backgroundColor: "#2c3e50", // Dark background color for points table
    borderRadius: "8px",
    th: {
      padding: "12px",
      backgroundColor: "#34495e", // Dark header background
      color: "#ffffff", // Light font color
      textAlign: "center",
      fontSize: "16px",
    },
    td: {
      padding: "12px",
      textAlign: "center",
      fontSize: "16px",
      border: "1px solid #ddd",
      color: "#ecf0f1", // Light font color for better visibility on dark background
    },
  },
  evenRow: {
    backgroundColor: "#3b4c5b", // Slightly lighter dark shade for even rows
  },
  oddRow: {
    backgroundColor: "#2c3e50", // Keep dark background for odd rows
  },
  scheduledMatches: {
    listStyleType: "none",
    paddingLeft: "0",
    fontSize: "18px",
    color: "#34495e",
  },
  matchItem: {
    padding: "8px",
    borderBottom: "1px solid #ddd",
    fontSize: "16px",
  },
};

export default WatchPage;
