import "./mailList.css"
import { useState } from "react";
import axios from "axios";
const MailList = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/mail/subscribe", { email, message });
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  return (
    <div className="mail">
      <h1 className="mailTitle">Save time, save money!</h1>
      <span className="mailDesc">We'll send the best deals to you</span>
      <div className="mailInputContainer">
        <input
          type="text"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSubmit}>Subscribe</button>
      </div>
    </div>
  );
};

export default MailList;
