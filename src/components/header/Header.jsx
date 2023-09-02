import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Fuse from "fuse.js";
import useFetch from "../../hooks/useFetch";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);


  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const { dispatch } = useContext(SearchContext);

  const handleSearch = () => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    navigate("/hotels", { state: { destination, dates, options } });
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination}&min=${min || 20}&max=${max || 9999}`
  );

  const handleClick = () => {
    reFetch();
  };
  const { data: citiesData, loading: citiesLoading } = useFetch("/hotels/city/all");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (citiesData) {
      console.log(citiesData); // Log the cityNames array
      setCities(citiesData);
    }
  }, [citiesData]);


  // Set up fuse.js for fuzzy search
  const fuseOptions = {
    keys: ["name"],
    includeScore: true,
    threshold: 0.6, // Try adjusting this value for better partial matches
  };


  const fuse = new Fuse(cities, fuseOptions);

  const [suggestedCities, setSuggestedCities] = useState([]);

  const handleDestinationChange = (inputValue) => {
    const input = inputValue.toLowerCase();
    setDestination(inputValue);

    if (inputValue.trim() === "") {
      setSuggestedCities([]); // Clear suggestions when input is empty
      return;
    }
    console.log(citiesData);
    const matchedCities = cities.filter(city => city.toLowerCase().includes(input));
    console.log(matchedCities);
    setSuggestedCities(matchedCities);
  };

  const handleSuggestionClick = (city) => {
    console.log(city);
    setDestination(city);
    setSuggestedCities([]); // Clear the suggestions
  };

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          <div className="headerListItem">
            <FontAwesomeIcon icon={faBed} />
            <span><b>Stays</b></span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faPlane} />
            <span><b>Flights</b></span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span><b>Car rentals</b></span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faBed} />
            <span><b>Attractions</b></span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faTaxi} />
            <span><b>Airport taxis</b></span>
          </div>
        </div>
        {type !== "list" && (
          <>
            <h1 className="headerTitle">
              A lifetime of discounts? It's Genius.
            </h1>
            <p className="headerDesc">
              Get rewarded for your travels – unlock instant savings of 10% or
              more with a free <b>BookMyStay</b> account.
            </p>
            {/* {!user && <button className="headerBtn">Sign in / Register</button>} */}
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBed} className="headerIcon" />
                <input
                  type="text"
                  value={destination}
                  placeholder="Where are you going?"
                  className="headerSearchInput"
                  onChange={(e) => handleDestinationChange(e.target.value)}
                />
                {suggestedCities.length > 0 && (
                  <ul className="suggestions">
                    {suggestedCities.map((city, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(city)}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="headerSearchText"
                >{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}</span>
                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDates([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    className="date"
                    minDate={new Date()}
                  />
                )}
              </div>
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="headerSearchText"
                >{`${options.adult} adult · ${options.children} children · ${options.room} room`}</span>
                {openOptions && (
                  <div className="options">
                    <div className="optionItem">
                      <span className="optionText">Adult</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Children</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Room</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.room <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.room}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="headerSearchItem">
                <button className="headerBtn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
