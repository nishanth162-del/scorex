import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { AuthContext } from "./AuthContext";

const PlayerProfile = () => {
  const { currentUser } = useContext(AuthContext); // Access current user from AuthContext
  const [profilePicURL, setProfilePicURL] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin"); // Redirect to sign-in if user is not authenticated
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        setName(currentUser.displayName || currentUser.email || "User");
        const db = getDatabase();
        const profilePicRef = ref(db, `users/${currentUser.uid}/profilePic`);

        const snapshot = await get(profilePicRef);
        if (snapshot.exists()) {
          setProfilePicURL(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser, navigate]);

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const storage = getStorage();
        const fileRef = storageRef(storage, `profilePics/${currentUser.uid}`);

        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        setProfilePicURL(url);

        const db = getDatabase();
        await set(ref(db, `users/${currentUser.uid}/profilePic`), url);
        console.log("Profile picture uploaded successfully");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileHeader}>
        {profilePicURL ? (
          <img src={profilePicURL} alt="Profile" style={styles.profilePic} />
        ) : (
          <div style={styles.placeholderPic}>No Profile Picture</div>
        )}
        <label style={styles.uploadLabel}>
          Change Picture
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleProfilePicUpload}
          />
        </label>
      </div>
      <h2 style={styles.name}>{loading ? "Loading..." : name}</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/dashboard")}>
          My Matches
        </button>
        <button style={styles.button} onClick={() => navigate("/history")}>
          My History
        </button>
        <button style={styles.signOutButton} onClick={handleSignOut}>
          <span style={styles.logoutSymbol}>🚪</span> Sign Out
        </button>
      </div>
      <footer style={styles.footer}>
        <p>Thank you for being part of our community!</p>
      </footer>
    </div>
  );
};
const styles = {
  container: {
    maxWidth: "600px",
    margin: "30px auto",
    padding: "30px",
    backgroundColor: "#f9f9f9",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "'Roboto', sans-serif",
  },
  profileHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  profilePic: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease-in-out",
  },
  placeholderPic: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#555",
  },
  uploadLabel: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "30px",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "background-color 0.3s",
  },
  name: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    fontFamily: "'Poppins', sans-serif",
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  buttonContainer: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  button: {
    padding: "12px 25px",
    backgroundColor: "#004085", // Dark Blue for primary buttons
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "0.3s",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  buttonHover: {
    backgroundColor: "#002752", // Hover effect for primary buttons
  },
  signOutButton: {
    padding: "12px 25px",
    backgroundColor: "#721c24", // Dark Red for the sign-out button
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "0.3s",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  logoutSymbol: {
    marginRight: "5px",
  },
  footer: {
    marginTop: "30px",
    padding: "15px",
    fontSize: "14px",
    color: "#777",
    borderTop: "1px solid #ddd",
    textAlign: "center",
  },
};
export default PlayerProfile;