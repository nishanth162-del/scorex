import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue, update } from "firebase/database";

const KabaddiScorePage = () => {
  const { tournamentId } = useParams();
  const [matchDetails, setMatchDetails] = useState(null);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [teamARaids, setTeamARaids] = useState(0);
  const [teamBRaids, setTeamBRaids] = useState(0);
  const [teamATackles, setTeamATackles] = useState(0);
  const [teamBTackles, setTeamBTackles] = useState(0);
  const [currentRaid, setCurrentRaid] = useState("A");  // "A" or "B" (current raiding team)

  useEffect(() => {
    const db = getDatabase();
    const tournamentRef = ref(db, "tournaments/" + tournamentId);

    onValue(tournamentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMatchDetails(data);
      }
    });
  }, [tournamentId]);

  const handleRaid = (team) => {
    const db = getDatabase();
    const matchRef = ref(db, "tournaments/" + tournamentId);

    // Update score and raids based on raiding team
    if (team === "A") {
      setTeamARaids(teamARaids + 1);
      setTeamAScore(teamAScore + 2);  // 2 points for successful raid
      setCurrentRaid("B");
      update(matchRef, {
        teamA_score: teamAScore + 2,
        teamA_raids: teamARaids + 1,
        teamB_score: teamBScore,
        teamB_raids: teamBRaids,
        currentRaid: "B"
      });
    } else {
      setTeamBRaids(teamBRaids + 1);
      setTeamBScore(teamBScore + 2);  // 2 points for successful raid
      setCurrentRaid("A");
      update(matchRef, {
        teamA_score: teamAScore,
        teamA_raids: teamARaids,
        teamB_score: teamBScore + 2,
        teamB_raids: teamBRaids + 1,
        currentRaid: "A"
      });
    }
  };

  const handleTackle = (team) => {
    const db = getDatabase();
    const matchRef = ref(db, "tournaments/" + tournamentId);

    // Update score for successful tackle
    if (team === "A") {
      setTeamATackles(teamATackles + 1);
      setTeamBScore(teamBScore - 1);  // 1 point to team A for successful tackle
      update(matchRef, {
        teamA_score: teamAScore + 1,
        teamA_tackles: teamATackles + 1,
        teamB_score: teamBScore - 1,
        teamB_tackles: teamBTackles
      });
    } else {
      setTeamBTackles(teamBTackles + 1);
      setTeamAScore(teamAScore - 1);  // 1 point to team B for successful tackle
      update(matchRef, {
        teamA_score: teamAScore - 1,
        teamA_tackles: teamATackles,
        teamB_score: teamBScore + 1,
        teamB_tackles: teamBTackles + 1
      });
    }
  };

  return (
    <div>
      <h2>Kabaddi Match</h2>
      <h3>{matchDetails && matchDetails.tournamentName}</h3>
      <h3>Team A: {matchDetails && matchDetails.teams[0].name}</h3>
      <h3>Team B: {matchDetails && matchDetails.teams[1].name}</h3>

      <div>
        <h4>Team A Scoring</h4>
        <p>Score: {teamAScore}</p>
        <p>Raids: {teamARaids}</p>
        <button onClick={() => handleRaid("A")}>Team A Raid</button>
        <button onClick={() => handleTackle("A")}>Team A Tackle</button>
      </div>

      <div>
        <h4>Team B Scoring</h4>
        <p>Score: {teamBScore}</p>
        <p>Raids: {teamBRaids}</p>
        <button onClick={() => handleRaid("B")}>Team B Raid</button>
        <button onClick={() => handleTackle("B")}>Team B Tackle</button>
      </div>
    </div>
  );
};

export default KabaddiScorePage;
