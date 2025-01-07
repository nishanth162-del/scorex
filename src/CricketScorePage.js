import React, { useState, useEffect } from "react";
import { getDatabase, ref, update, set } from "firebase/database";

const CricketScorePage = ({ matchDetails }) => {
  const [runs, setRuns] = useState(matchDetails?.runs || 0);
  const [wickets, setWickets] = useState(matchDetails?.wickets || 0);
  const [balls, setBalls] = useState(matchDetails?.balls || 0);
  const [overs, setOvers] = useState(matchDetails?.overs || 0);
  const [currentInning, setCurrentInning] = useState(1); // 1 for first inning, 2 for second
  const [teamBatting, setTeamBatting] = useState(matchDetails?.teamA || "Team A");
  const [inningsEnded, setInningsEnded] = useState(false);
  const [firstInningScore, setFirstInningScore] = useState(null);
  const [matchEnded, setMatchEnded] = useState(false);  // Flag to track if match has ended

  const db = getDatabase();

  // Start the match and initialize the live match data
  const handleMatchStart = () => {
    const tournamentId = matchDetails?.tournamentId;
    const matchRef = ref(db, `tournaments/${tournamentId}/matches/${matchDetails.id}`);
    const liveMatchRef = ref(db, `liveMatches/${matchDetails.id}`);

    if (!tournamentId) {
      alert("Tournament ID is missing. Please check your setup.");
      return;
    }

    const matchData = {
      teamA: matchDetails?.teamA,
      teamB: matchDetails?.teamB,
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      status: "started",
      lastUpdated: Date.now(),
    };

    // Update match status in tournament and live matches nodes
    update(matchRef, { status: "started" });
    set(liveMatchRef, matchData);
  };

  // Handle scoring events (e.g., single, boundary, wicket, etc.)
  const handleAction = (action) => {
    const tournamentId = matchDetails?.tournamentId;

    if (!tournamentId) {
      alert("Tournament ID is missing. Please check your setup.");
      return;
    }

    let newRuns = runs;
    let newWickets = wickets;
    let newBalls = balls + 1;
    let newOvers = Math.floor(newBalls / 6);

    switch (action) {
      case "Single":
        newRuns += 1;
        break;
      case "Double":
        newRuns += 2;
        break;
      case "Boundary":
        newRuns += 4;
        break;
      case "Six":
        newRuns += 6;
        break;
      case "Wicket":
        newWickets += 1;
        break;
      case "Dot Ball":
        break;
      case "Wide":
        newRuns += 1;
        newBalls -= 1; // Wide does not count as a ball.
        break;
      default:
        break;
    }

    // Update state
    setRuns(newRuns);
    setWickets(newWickets);
    setBalls(newBalls);
    setOvers(newOvers);

    // Update Firebase with the current scores
    updateMatchStats(newRuns, newWickets, newBalls, newOvers);
  };

  // Update both match-specific and live match data in Firebase
  const updateMatchStats = (newRuns, newWickets, newBalls, newOvers) => {
    const tournamentId = matchDetails?.tournamentId;
    const matchRef = ref(db, `tournaments/${tournamentId}/matches/${matchDetails.id}`);
    const liveMatchRef = ref(db, `liveMatches/${matchDetails.id}`);

    const matchData = {
      runs: newRuns,
      wickets: newWickets,
      balls: newBalls,
      overs: newOvers,
      status: "ongoing", // Status remains "ongoing" during the match
      lastUpdated: Date.now(),
    };

    update(matchRef, matchData);
    update(liveMatchRef, matchData);
  };

  // End the current innings and update Firebase
  const handleEndInnings = () => {
    const tournamentId = matchDetails?.tournamentId;
    const matchRef = ref(db, `tournaments/${tournamentId}/matches/${matchDetails.id}`);
    const liveMatchRef = ref(db, `liveMatches/${matchDetails.id}`);

    if (!tournamentId) {
      alert("Tournament ID is missing. Please check your setup.");
      return;
    }

    update(matchRef, {
      [`innings${currentInning}`]: {
        runs,
        wickets,
        balls,
        overs,
      },
    });

    if (currentInning === 1) {
      setFirstInningScore({ runs, wickets, overs, balls });
      setCurrentInning(2);
      setTeamBatting(matchDetails?.teamB || "Team B");
      resetScore();
    } else {
      setInningsEnded(true);
    }

    // Reset the live match stats for the second inning
    update(liveMatchRef, {
      teamA: matchDetails?.teamA,
      teamB: matchDetails?.teamB,
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      status: "ongoing",
      lastUpdated: Date.now(),
    });
  };

  // End the match, compare scores, and update results
  const handleEndMatch = () => {
    const tournamentId = matchDetails?.tournamentId;
    const liveMatchRef = ref(db, `liveMatches/${matchDetails.id}`);
    const completedMatchRef = ref(db, `tournaments/${tournamentId}/completedMatches/${matchDetails.id}`);
    const resultsRef = ref(db, `results/${tournamentId}/${matchDetails.id}`);

    if (!tournamentId) {
      alert("Tournament ID is missing. Please check your setup.");
      return;
    }

    const teamAScore = firstInningScore?.runs || 0;
    const teamBScore = runs;

    const winner =
      teamAScore > teamBScore
        ? matchDetails?.teamA
        : teamBScore > teamAScore
        ? matchDetails?.teamB
        : "Tie";

    const resultsData = {
      teamA: matchDetails?.teamA,
      teamB: matchDetails?.teamB,
      firstInning: firstInningScore,
      secondInning: { runs, wickets, overs, balls },
      winner,
      status: "completed", // Indicating the match has ended
      timestamp: Date.now(),
    };

    // Save match result to 'results' collection
    set(resultsRef, resultsData)
      .then(() => {
        alert(`Match has ended! Winner: ${winner}`);
        updatePointsTable(winner, teamAScore, teamBScore);
      })
      .catch((error) => {
        console.error("Error saving completed match data:", error);
        alert("Failed to archive match data. Please try again.");
      });

    // Save results to the completed match section
    set(completedMatchRef, resultsData)
      .then(() => {
        console.log("Match completed data saved.");
      })
      .catch((error) => {
        console.error("Error saving completed match data:", error);
      });

    // Remove the live match data
    set(liveMatchRef, null)
      .then(() => {
        console.log("Live match data successfully removed.");
      })
      .catch((error) => {
        console.error("Error removing live match data:", error);
      });

    // Optionally reset the score for future matches
    resetScore();
    setMatchEnded(true);
  };

  // Update points table based on winner
  const updatePointsTable = (winner, teamAScore, teamBScore) => {
    const tournamentId = matchDetails?.tournamentId;
    const pointsRef = ref(db, `tournaments/${tournamentId}/pointsTable`);

    const pointsData = {
      [matchDetails?.teamA]: {
        points: winner === matchDetails?.teamA ? 2 : 0,
        runs: teamAScore,
      },
      [matchDetails?.teamB]: {
        points: winner === matchDetails?.teamB ? 2 : 0,
        runs: teamBScore,
      },
    };

    update(pointsRef, pointsData)
      .then(() => {
        console.log("Points table updated.");
      })
      .catch((error) => {
        console.error("Error updating points table:", error);
      });
  };

  // Reset the score for the next inning or match
  const resetScore = () => {
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setOvers(0);
  };

  return (
    <div>
      <h3>Scoring for {teamBatting}</h3>
      <p>Inning: {currentInning}</p>
      <p>Runs: {runs}</p>
      <p>Wickets: {wickets}</p>
      <p>Overs: {overs}.{balls % 6}</p>

      <div>
        <h4>What happened on this ball?</h4>
        <button onClick={() => handleAction("Single")}>Single</button>
        <button onClick={() => handleAction("Double")}>Double</button>
        <button onClick={() => handleAction("Boundary")}>Boundary</button>
        <button onClick={() => handleAction("Six")}>Six</button>
        <button onClick={() => handleAction("Wicket")}>Wicket</button>
        <button onClick={() => handleAction("Dot Ball")}>Dot Ball</button>
        <button onClick={() => handleAction("Wide")}>Wide</button>
      </div>

      <button onClick={handleMatchStart} style={{ marginTop: "20px" }}>
        Start Match
      </button>

      {!inningsEnded && (
        <button onClick={handleEndInnings} style={{ marginTop: "20px" }}>
          End Innings
        </button>
      )}
      {inningsEnded && currentInning === 2 && !matchEnded && (
        <button onClick={handleEndMatch} style={{ marginTop: "20px" }}>
          End Match
        </button>
      )}
    </div>
  );
};

export default CricketScorePage;
