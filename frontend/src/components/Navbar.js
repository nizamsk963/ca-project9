import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (

    <div className="navbar">

      <h2>CA Practice Manager</h2>

      <div className="navbar-actions">
        <span>{user?.name}</span>
        <button onClick={logout}>Logout</button>
      </div>

    </div>
  );
}

export default Navbar;
