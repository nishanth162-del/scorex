import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { getDatabase, ref, push } from "firebase/database";
import { auth } from "./firebaseConfig";
import { 
  FaBaseballBall, 
  FaRunning, 
  FaTableTennis, 
  FaBasketballBall,
  FaLock,
  FaUsers,
  FaTrophy,
  FaKey
} from 'react-icons/fa';

const HostPage = () => {
  const [gameType, setGameType] = useState("Cricket");
  const [tournamentName, setTournamentName] = useState("");
  const [teams, setTeams] = useState([{ name: "", players: [] }]);
  const [scheduleType, setScheduleType] = useState("Round Robin");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  const navigate = useNavigate(); // Navigation hook

  const generatePasscode = () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setPasscode(code);
    setShowPasscode(true);
    setTimeout(() => {
      setShowPasscode(false);
    }, 5000);
  };

  const handleAddTeam = () => {
    setTeams([...teams, { name: "", players: [] }]);
  };

  const handleTeamNameChange = (index, value) => {
    const updatedTeams = [...teams];
    updatedTeams[index].name = value;
    setTeams(updatedTeams);
  };

  const generateSchedule = (teams, scheduleType) => {
    const matches = [];
    let matchID = 1;

    if (scheduleType === "Round Robin") {
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          matches.push({
            matchID: `match_${matchID++}`,
            teamA: teams[i].name,
            teamB: teams[j].name,
            teamAPlayers: teams[i].players,
            teamBPlayers: teams[j].players,
            status: "Scheduled",
            winner: null,
          });
        }
      }
    } else if (scheduleType === "Knockout") {
      for (let i = 0; i < teams.length; i += 2) {
        if (i + 1 < teams.length) {
          matches.push({
            matchID: `match_${matchID++}`,
            teamA: teams[i].name,
            teamB: teams[i + 1].name,
            teamAPlayers: teams[i].players,
            teamBPlayers: teams[i + 1].players,
            status: "Scheduled",
            winner: null,
          });
        }
      }
    }
    return matches;
  };

  const getGameIcon = (type) => {
    switch (type) {
      case "Cricket":
        return <FaBaseballBall className="text-2xl text-blue-400" />;
      case "Kabaddi":
        return <FaRunning className="text-2xl text-green-400" />;
      case "Badminton":
        return <FaTableTennis className="text-2xl text-yellow-400" />;
      case "Basketball":
        return <FaBasketballBall className="text-2xl text-orange-400" />;
      default:
        return null;
    }
  };

  const handleHostTournament = () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to host a tournament.");
      return;
    }

    if (teams.length < 2) {
      alert("At least 2 teams are required to host a tournament.");
      return;
    }

    const db = getDatabase();
    const matches = generateSchedule(teams, scheduleType);
    const tournamentData = {
      tournamentName,
      gameType,
      teams,
      scheduleType,
      matches,
      hostID: user.uid,
      createdAt: new Date().toISOString(),
      passcode,
    };

    push(ref(db, "tournaments/"), tournamentData)
      .then(() => {
        alert(`Tournament hosted successfully!`);
        navigate("/"); // Navigate to LandingPage.js
      })
      .catch((error) => {
        console.error("Error hosting tournament:", error);
        alert("Failed to host the tournament. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-5 text-white">
      <h2 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 text-center font-['Orbitron']">
        Host a Tournament
        <FaTrophy className="inline-block ml-4 text-4xl text-yellow-400 animate-bounce" />
      </h2>

      <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-2xl bg-gray-900 bg-opacity-80 backdrop-blur-md p-8 rounded-xl border border-blue-400/30">
        <div className="mb-6">
          <label className="block text-lg mb-2">
            Tournament Name
            <input
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-800 border border-blue-400/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-lg mb-2">
            Select Game
            <div className="relative">
              <select 
                value={gameType} 
                onChange={(e) => setGameType(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-gray-800 border border-blue-400/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
              >
                <option value="Cricket">Cricket 🏏</option>
                <option value="Kabaddi">Kabaddi 🏃</option>
                <option value="Badminton">Badminton 🏸</option>
                <option value="Basketball">Basketball 🏀</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getGameIcon(gameType)}
              </div>
            </div>
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-lg mb-2">
            Schedule Type
            <select 
              value={scheduleType} 
              onChange={(e) => setScheduleType(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-gray-800 border border-blue-400/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Round Robin">Round Robin 🔄</option>
              <option value="Knockout">Knockout 🏆</option>
            </select>
          </label>
        </div>

        <div className="mb-6">
          <h3 className="text-xl mb-4 flex items-center">
            Teams <FaUsers className="ml-2 text-blue-400" />
          </h3>
          {teams.map((team, index) => (
            <div key={index} className="mb-4">
              <label className="block">
                Team {index + 1}
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-gray-800 border border-blue-400/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </label>
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddTeam}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add Team +
          </button>
        </div>

        <div className="mb-6">
          <button 
            type="button" 
            onClick={generatePasscode}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center"
          >
            <FaKey className="mr-2" /> Generate Passcode
          </button>
          {showPasscode && (
            <div className="mt-4 p-4 bg-purple-900 rounded-md animate-pulse">
              <div className="flex items-center justify-center">
                <FaLock className="text-2xl mr-2 text-yellow-400" />
                <span className="text-lg font-semibold">{passcode}</span>
              </div>
              <button
                onClick={() => setShowPasscode(false)}
                className="mt-2 bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          )}
        </div>

        <button 
          type="button" 
          onClick={handleHostTournament}
          className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity duration-200 font-bold text-lg"
        >
          Host Tournament 🎮
        </button>
      </form>
    </div>
  );
};

export default HostPage;
