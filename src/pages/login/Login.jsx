import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import {gapi} from 'gapi-script'
const Login = () => {
  const [credentials, setCredentials] = useState({
    username: 'undefined',
    password: 'undefined',
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      console.log("Logged in");
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/")
    } catch (err) {
      console.log(err.message);
      console.log(err.response.status);
      dispatch({ type: "LOGIN_FAILURE", payload: err.response });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const googleUser = await authInstance.signIn();

      const googleCredentials = {
        username: googleUser.getBasicProfile().getName(),
        email: googleUser.getBasicProfile().getEmail(),
        // ... other fields as needed ...
      };
      setCredentials(googleCredentials);
      console.log(googleUser.getBasicProfile().getName());

      // Handle the rest of the process, similar to your existing code
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };


  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        {error && (
          <span className="errorMessage">
            {error.status === 404
              ? "User not found":
              error.status === 400 
              ? "Invalid credentials"
              : "An error occurred. Please try again later."}
          </span>
        )}
        <button onClick={handleGoogleSignIn} className="googleButton">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;