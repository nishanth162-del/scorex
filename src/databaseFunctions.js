import { ref, set, push,onValue ,remove } from "firebase/database";
import { database } from "./firebaseConfig";

// Function to add a new tournament
export const addTournament = async (tournamentData) => {
  try {
    const tournamentRef = push(ref(database, "tournaments"));
    await set(tournamentRef, tournamentData);
    console.log("Tournament added successfully!");
  } catch (error) {
    console.error("Error adding tournament: ", error);
  }
};

const handleAddTournament = () => {
    const tournamentData = {
      name: "Test Tournament",
      location: "Test Location",
      date: "2024-12-23",
    };
  
    addTournament(tournamentData);
  };
  
  handleAddTournament(); // Call this function from a button click or form submission
  
export const fetchTournaments = async () => {
    try {
      const tournamentsRef = ref(database, "tournaments");
      onValue(tournamentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log("Fetched tournaments: ", data);
        } else {
          console.log("No tournaments found.");
        }
      });
    } catch (error) {
      console.error("Error fetching tournaments: ", error);
    }
  };


const handleFetchTournaments = () => {
  fetchTournaments();
};

handleFetchTournaments(); // Call this on page load or a button click

// Function to update a specific tournament
export const updateTournament = async (tournamentId, updatedData) => {
    try {
      const tournamentRef = ref(database, `tournaments/${tournamentId}`);
      await set(tournamentRef, updatedData);
      console.log("Tournament updated successfully!");
    } catch (error) {
      console.error("Error updating tournament: ", error);
    }
  };

  

// Function to delete a specific tournament
export const deleteTournament = async (tournamentId) => {
  try {
    const tournamentRef = ref(database, `tournaments/${tournamentId}`);
    await remove(tournamentRef);
    console.log("Tournament deleted successfully!");
  } catch (error) {
    console.error("Error deleting tournament: ", error);
  }
};

// Function to listen for real-time updates
export const listenToTournaments = () => {
    const tournamentsRef = ref(database, "tournaments");
    onValue(tournamentsRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Real-time tournaments data: ", data);
      // Update your UI here based on `data`
    });
  };
  