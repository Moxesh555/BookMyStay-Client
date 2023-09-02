import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import Fuse from "fuse.js";

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);

  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination}&min=${min || 20}&max=${max || 9999}`
  );

  const handleClick = () => {
    reFetch();
  };

  // Fetch cities data from the backend
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

    const matchedCities = cities.filter(city => city.toLowerCase().includes(input));
    setSuggestedCities(matchedCities);
  };

  const handleSuggestionClick = (city) => {
    setDestination(city);
    setSuggestedCities([]); // Clear the suggestions
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="suggestions-wrapper">
              <label>Destination</label>
              <input
                value={destination}
                type="text"
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

            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
            {loading ? (
              "Loading please wait..."
            ) : (
              <>
                {data.map((item) => (
                  <SearchItem item={item} key={item._id} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
