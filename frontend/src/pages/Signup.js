import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to create account");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <p>Create an admin account for your CA project.</p>
        {error && <div className="auth-error">{error}</div>}
        <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Create Account</button>
        <span>Already registered? <Link to="/login">Login</Link></span>
      </form>
    </div>
  );
}

export default Signup;
