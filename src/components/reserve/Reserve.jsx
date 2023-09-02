import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [bookingStatus, setBookingStatus] = useState("");
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const [username, setUsername] = useState("");
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    if (!roomNumber.bookings) {
      return true; // If there are no bookings, the room is available
    }
    const isFound = roomNumber.bookings.some((booking) =>
      booking.unavailableDates.some((date) =>
        alldates.includes(new Date(date).getTime())
      )
    );
    return !isFound;
  };



  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map(async (roomId) => {
          const res = await axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
            username: username,
          });
          return res.data;
        })
      );
      console.log("succccccess")
      setBookingStatus("success");
      
      setTimeout(() => {
        setOpen(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      setBookingStatus("error");
      // Handle the error appropriately
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}$</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room">
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={handleUsernameChange}
        />
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
        {bookingStatus === "success" && !loading && (
          <span className="successMessage">Your room booked successfully!</span>
        )}
        {bookingStatus === "error" && !loading && (
          <span className="errorMessage">There was an error booking the room.</span>
        )}
        {loading && (
          <span className="loadingMessage">Loading...</span>
        )}

      </div>
    </div>
  );
};

export default Reserve;

