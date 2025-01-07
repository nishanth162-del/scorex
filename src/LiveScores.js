import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

const LiveScores = () => {
  const [liveMatches, setLiveMatches] = useState({});
  const [showMessage, setShowMessage] = useState(false);
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
    if (matchId) {
      // Show the message temporarily
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false); // Hide the message
        navigate(`/live/${matchId}`); // Navigate to the new page
      }, 2000); // 2-second delay before navigating
    } else {
      console.error("Invalid matchId, cannot navigate.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-5 relative overflow-hidden text-white">
      <h2 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 text-center">
        Live Scores
      </h2>

      {showMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-400 animate-bounce">
              Yay! Let's Watch!
            </h1>
          </div>
        </div>
      )}

      {Object.keys(liveMatches).length > 0 ? (
        Object.keys(liveMatches).map((matchId) => {
          const match = liveMatches[matchId];
          return (
            <div
              key={matchId}
              className="flex flex-col items-center justify-center p-8 rounded-xl bg-opacity-80 backdrop-blur-md bg-gray-900 border border-blue-400/30 transition-all duration-300 cursor-pointer mb-5 relative overflow-hidden w-full max-w-2xl"
            >
              <h3 className="text-2xl font-semibold text-blue-400 mb-4 text-center">
                {match.teamA} vs {match.teamB}
              </h3>
              <p className="text-gray-200 text-center leading-relaxed">
                <strong>Score:</strong> {match.runs}/{match.wickets}
              </p>
              <p className="text-gray-200 text-center leading-relaxed">
                <strong>Overs:</strong> {match.overs}.{match.balls % 6}
              </p>
              <p className="text-gray-200 text-center leading-relaxed">
                <strong>Status:</strong> {match.status}
              </p>
              <p className="text-gray-200 text-center leading-relaxed">
                <strong>Last Updated:</strong>{" "}
                {new Date(match.lastUpdated).toLocaleString()}
              </p>
              <button
                onClick={() => handleViewMatch(matchId)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                View Match Live
              </button>
            </div>
          );
        })
      ) : (
        <p className="text-xl text-gray-200 mt-8 text-center">
          No live matches at the moment.
        </p>
      )}
    </div>
  );
};

export default LiveScores;
