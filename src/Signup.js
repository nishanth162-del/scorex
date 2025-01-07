import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { AuthContext } from "./AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate(); // Correctly use useNavigate

  if (currentUser) {
    navigate("/"); // Redirect to profile page if already signed in
    return null;
  }

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info in the database
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), { name, email });

      navigate("/"); // Redirect to profile page after signup
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text" color="black" bgcolor="white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button onClick={handleSignUp}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
