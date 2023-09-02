import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions, such as clearing user data and redirecting
    dispatch({ type: "LOGOUT" }); // Assuming you have a "LOGOUT" action in your AuthContext reducer
    navigate("/"); // Redirect to the homepage or any other appropriate page
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">Relax, We are here for you.</span>
        </Link>
        {user ? (
          <div className="navItems">
            <span className="welcome">
              <span className="welcome-text">Welcome, {user.username}!</span>
              <img
                src={user.img} // Assuming user.img is the URL string of the user's photo
                
                className="userPhoto"
              />
            </span>
            <button className="navButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            <button className="navButton" onClick={() => navigate("/register")}>Register</button>
            <button className="navButton" onClick={() => navigate("/login")}>Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
