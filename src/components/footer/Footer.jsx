import "./footer.css";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    console.log("heeeeeeeeeelo")
    navigate("/"); // Navigate to the root route ("/")
  };
  return (
    <div className="footer">
      <div className="fLists">
        <ul className="fList">
          <li className="fListItem" onClick={handleHomeClick}>Home</li>
        </ul>
        <ul className="fList">
          <li className="fListItem">
            <a href="https://techiebutler.com/" target="_blank">About Us</a>
          </li>
        </ul>
        <ul className="fList">
          <li className="fListItem">Contact Us</li>
        </ul>
        <ul className="fList">
          <li className="fListItem">Customer Service</li>
        </ul>
      </div>
      <div className="fText">Copyright © 2022 BookMyStay.</div>
    </div>
  );
};

export default Footer;
