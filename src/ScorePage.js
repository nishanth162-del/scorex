import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import CricketScorePage from "./CricketScorePage";
import { getDatabase, ref, onValue, update, push } from "firebase/database";

const ScorePage = () => {
  const { tournamentId } = useParams();
  const { state } = useLocation();
  const { gameType } = state || {}; // Safely retrieve gameType
  const [tournament, setTournament] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scheduledMatches, setScheduledMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    if (!tournamentId) {
      console.error("Tournament ID is missing.");
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const tournamentRef = ref(db, `tournaments/${tournamentId}`);

    onValue(
      tournamentRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTournament(data);

          const matchesArray = Array.isArray(data.matches)
            ? data.matches
            : Object.values(data.matches || {});
          const scheduled = matchesArray.filter((match) => match.status === "Scheduled");
          const live = matchesArray.filter((match) => match.status === "Live");
          const completed = matchesArray.filter((match) => match.status === "Completed");

          setScheduledMatches(scheduled);
          setLiveMatches(live);
          setCompletedMatches(completed);
        } else {
          console.warn("No tournament data found.");
          setTournament(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tournament data:", error);
        setLoading(false);
      }
    );
  }, [tournamentId]);

  const handleMatchSelect = (match) => {
    setSelectedMatch({ ...match, tournamentId }); 
  };

  const handleStartMatch = (match) => {
    const db = getDatabase();
    const matchRef = ref(db, `tournaments/${tournamentId}/matches/${match.id}`);
    
    // Check if match already has an ID
    if (!match.id) {
      const newMatchRef = push(ref(db, `tournaments/${tournamentId}/matches`)); // Generate a new match ID if it doesn't exist
      match.id = newMatchRef.key;  // Assign the new match ID
    }

    update(matchRef, { status: "Live" })
      .then(() => {
        setSelectedMatch({ ...match, tournamentId });
      })
      .catch((error) => console.error("Error starting the match:", error));
  };

  const handleAction = (action) => {
    switch (action) {
      case "single":
        setPopupMessage("Yay! It's a Single!");
        break;
      case "wicket":
        setPopupMessage("Oh no! It's a Wicket!");
        break;
      case "boundary":
        setPopupMessage("Yay! It's a Boundary!");
        break;
      case "six":
        setPopupMessage("Yay! It's a Six!");
        break;
      case "double":
        setPopupMessage("Yay! It's a Double!");
        break;
      default:
        setPopupMessage('');
    }

    setTimeout(() => {
      setPopupMessage('');
    }, 2000); // Hide message after 2 seconds
  };

  const renderMatchList = (matches, label, actionButton = false) => {
    if (!matches || matches.length === 0) {
      return <p>No {label} matches available for this tournament.</p>;
    }

    return matches.map((match, index) => (
      <div key={match.id || index} style={{ marginBottom: "10px" }}>
        <p>{match.teamA} vs {match.teamB}</p>
        {actionButton && (
          <button onClick={() => handleStartMatch(match)}>Start Match</button>
        )}
        {!actionButton && (
          <button onClick={() => handleMatchSelect(match)}>View Match</button>
        )}
      </div>
    ));
  };

  const renderGameComponent = () => {
    if (!selectedMatch) {
      return (
        <div>
          <h4>Scheduled Matches</h4>
          {renderMatchList(scheduledMatches, "scheduled", true)}

          <h4>Live Matches</h4>
          {renderMatchList(liveMatches, "live")}

          <h4>Completed Matches</h4>
          {renderMatchList(completedMatches, "completed")}
        </div>
      );
    }

    switch (gameType || selectedMatch?.gameType) {
      case "Cricket":
        return <CricketScorePage matchDetails={selectedMatch} handleAction={handleAction} />;
      default:
        return <p>Scoring for this game type is not yet implemented.</p>;
    }
  };

  if (loading) {
    return <p>Loading tournament details...</p>;
  }

  if (!tournament) {
    return <p>Unable to fetch tournament details. Please try again later.</p>;
  }

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}>Scoring Page</h2>
      <h3>{tournament.tournamentName || "Tournament"}</h3>
      <h4>Game: {gameType || "Unknown"}</h4>
      {renderGameComponent()}

      {popupMessage && (
        <div style={styles.popup}>
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    fontFamily: 'Orbitron, sans-serif',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '48px',
    fontWeight: '900',
    background: 'linear-gradient(45deg, #00ff87 0%, #60efff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '30px',
    textAlign: 'center',
  },
  popup: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '15px 30px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '18px',
    textAlign: 'center',
    animation: 'fadeIn 0.5s ease-out',
  },
};

export default ScorePage;
