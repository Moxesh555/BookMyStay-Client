import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./register.css";
import {gapi} from 'gapi-script'
const Register = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    country: '',
    img: '',
    city: '',
    phone: '',
    password: '',
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      console.log("Registering user");
      const res = await axios.post("/auth/register", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response });
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      console.log(gapi.auth2.getAuthInstance());
      const authInstance = gapi.auth2.getAuthInstance();
      const googleUser = await authInstance.signIn();
      console.log(googleUser.getBasicProfile().getName());
      const googleCredentials = {
        username: googleUser.getBasicProfile().getName(),
        email: googleUser.getBasicProfile().getEmail(),
      };
      console.log(googleUser.getBasicProfile().getName());
      setCredentials(googleCredentials);
      // Handle the rest of the process, similar to your existing code
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };
  return (
    <div className="register">
      <div className="rContainer">
        <input
          type="text"
          placeholder="Username*"
          id="username"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="email"
          placeholder="Email-id*"
          id="email"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="text"
          placeholder="Country*"
          id="country"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="text"
          placeholder="Image URL"
          id="img"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="text"
          placeholder="City*"
          id="city"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="text"
          placeholder="Phone*"
          id="phone"
          onChange={handleChange}
          className="rInput"
        />
        <input
          type="password"
          placeholder=" Create Password*"
          id="password"
          onChange={handleChange}
          className="rInput"
        />
        <button disabled={loading} onClick={handleClick} className="rButton">
          Register
        </button>
        {error && (
          <span className="errorMessage">
            {error.status === 409
              ? "Username already exists"
              : error.status === 408
              ? "Email already exists"
              : error.status === 400
              ?"Enter a Valid Phone Number."
              :"An error occurred. Please try again later."
              }
          </span>
        )}
        <button onClick={handleGoogleSignIn} className="googleButton">
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Register;
