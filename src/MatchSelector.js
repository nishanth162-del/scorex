import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const MatchSelector = ({ onMatchSelect }) => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const matchesRef = ref(db, "tournaments");
    onValue(matchesRef, (snapshot) => {
      const data = snapshot.val();
      const matchList = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setMatches(matchList);
    });
  }, []);

  const handleMatchChange = (event) => {
    const matchId = event.target.value;
    setSelectedMatch(matchId);
    const matchDetails = matches.find((match) => match.id === matchId);
    onMatchSelect(matchDetails);
  };

  return (
    <div>
      <h3>Select a Match</h3>
      <select value={selectedMatch} onChange={handleMatchChange}>
        <option value="" disabled>
          Choose a match
        </option>
        {matches.map((match) => (
          <option key={match.id} value={match.id}>
            {match.teams[0].name} vs {match.teams[1].name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MatchSelector;
