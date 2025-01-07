import React, { useState, useEffect } from "react"; // Make sure useState is imported here
import { getDatabase, ref, onValue } from "firebase/database";
import { useParams } from "react-router-dom"; // For extracting matchId from the URL
import './LiveScoreBoard.css'; // Add custom styles for eye-catching design

const LiveScoreboard = () => {
  const { matchId } = useParams(); // Extract matchId from URL parameters
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const liveMatchRef = ref(db, `liveMatches/${matchId}`);

    const unsubscribe = onValue(liveMatchRef, (snapshot) => {
      if (snapshot.exists()) {
        setScoreData(snapshot.val());
      } else {
        setScoreData(null);
        alert("Match data not found or match has ended.");
      }
    });

    return () => unsubscribe();
  }, [matchId]);

  if (!scoreData) {
    return <p>Loading match details...</p>;
  }

  const { teamA, teamB, runs, wickets, overs, balls, status } = scoreData;

  return (
    <div className="scoreboard-container">
      <header className="scoreboard-header">
        <h2>{`${teamA} vs ${teamB}`}</h2>
        <p>Status: {status === "ongoing" ? "Live" : "Ended"}</p>
      </header>

      <div className="score-section">
        <div className="team-details">
          <h3>{teamA}</h3>
          <p>Batting</p>
        </div>
        <div className="score-details">
          <h1>
            {runs}/{wickets}
          </h1>
          <p>
            Overs: {overs}.{balls % 6}
          </p>
        </div>
        <div className="team-details">
          <h3>{teamB}</h3>
          <p>Bowling</p>
        </div>
      </div>

      <div className="event-section">
        <h4>Live Updates:</h4>
        <p>Keep an eye on the latest ball-by-ball action here!</p>
      </div>
    </div>
  );
};

export default LiveScoreboard;
