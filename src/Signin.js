import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Use Link for navigation
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setErrorMessage(""); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Navigate to the main page on successful login
    } catch (error) {
      // Handle common Firebase authentication errors
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("No account found for this email. Please sign up.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email format. Please check your email.");
          break;
        default:
          setErrorMessage("Error signing in: " + error.message);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9", // Light gray background
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#ffffff", // White card
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Sign In</h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <label
            style={{
              textAlign: "left",
              fontWeight: "500",
              color: "#555",
            }}
          >
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
                outlineColor: "#007bff",
              }}
            />
          </label>
          <label
            style={{
              textAlign: "left",
              fontWeight: "500",
              color: "#555",
            }}
          >
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "16px",
                outlineColor: "#007bff",
              }}
            />
          </label>
          <button
            onClick={handleSignIn}
            style={{
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Sign In
          </button>
        </form>
        {errorMessage && (
          <p
            style={{
              color: "red",
              marginTop: "15px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {errorMessage}
          </p>
        )}
        <p style={{ marginTop: "20px", color: "#555" }}>
          New user?{" "}
          <Link
            to="/signup"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
