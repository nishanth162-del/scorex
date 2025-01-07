import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const teamsRef = ref(db, "teams");

    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeams(Object.entries(data).map(([id, details]) => ({ id, ...details })));
      }
    });
  }, []);

  return (
    <div>
      <center>
        <h5>Teams and Players</h5>
        </center>
      {teams.map((team) => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          <ul>
            {team.players.map((player) => (
              <li key={player.id}>{player.name} (ID: {player.id})</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TeamsPage;
