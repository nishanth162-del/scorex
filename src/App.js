import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from "./AuthContext"; // Import AuthProvider
import CricketScorePage from "./CricketScorePage";
import HostPage from './HostPage';  // Example of another page
import WatchPage from './WatchPage'; // Example of another page
import PlayerProfile from './PlayerProfile';
import Signin from './Signin';
import Signup from './Signup';
import LandingPage from './LandingPage';
import TeamsPage from './TeamsPage';
import PlayerDashboard from './PlayerDashboard';
import ScorePage from './ScorePage';
import LiveScores from './LiveScores';
import LiveScoreboard from './LiveScoreBoard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/live" element={<LiveScores />} />
          
          {/* Corrected route for CricketScorePage */}
          <Route path="/live-match/:matchId" element={<CricketScorePage />} />
          <Route path="/live/:matchId" element={<LiveScoreboard />} />
          <Route path="/score/:tournamentId" element={<ScorePage />} />
          <Route path="/dashboard" element={<PlayerDashboard />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/profile" element={<PlayerProfile />} />
          
          {/* Uncommented routes */}
          {/* <Route path="/score/:matchID" element={<ScorePage />} /> */}
          {/* <Route path="/hostmatch" element={<RequireAuth><HostMatch /></RequireAuth>} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
