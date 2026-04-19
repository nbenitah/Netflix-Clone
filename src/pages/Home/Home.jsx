import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import hero_banner from "../../assets/hero_banner.jpg";
import hero_title from "../../assets/hero_title.png";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/Navbar/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";

const searchOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzUzMzhkZTQwNGIxZTc4MjVlNjM3NmFkODZlYWJmMSIsIm5iZiI6MTc3NjUzMjIwNy4zOTM5OTk4LCJzdWIiOiI2OWUzYmFlZjZlMTUzOWQwNzAyNmVjMTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ll4-TCjR_Z5rJW51nxrLEH8LGfM0usa5bsTKd5KHVjU",
  },
};

const Home = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchError, setSearchError] = React.useState("");
  const deferredQuery = React.useDeferredValue(searchQuery.trim());

  React.useEffect(() => {
    if (!deferredQuery) {
      setSearchResults([]);
      setSearchError("");
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(deferredQuery)}&include_adult=false&language=en-US&page=1`,
          {
            ...searchOptions,
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Search failed with status ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(Array.isArray(data.results) ? data.results : []);
        setSearchError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          setSearchResults([]);
          setSearchError("Unable to search titles right now.");
        }
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [deferredQuery]);

  return (
    <div className='home'>
      <Navbar />
      <div className="hero">
        <img src={hero_banner} alt="" className="banner-img" />
        <div className="hero-caption"> 
            <img src={hero_title} alt="" className="caption-img"  />

            <p>
                Discovering his ties to a secret ancient order,
                a young man living in modern Istanbul embarks on a quest 
                to save the city from an immortal enemy. 
            </p>
            <div className="hero-btns">
                <button className='btn'>
                    <img src={play_icon} alt="" />
                    Play
                    </button>
                <button className="btn dark-btn">
                    <img src={info_icon} alt="" />
                    More Info
                </button>
            </div>
        </div>
      </div>
      <div className="home-content">
        <div className="search-panel">
          <label className="search-label" htmlFor="movie-search">Search movies</label>
          <input
            id="movie-search"
            className="search-input"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for a movie title"
          />
        </div>
        {searchQuery.trim() ? (
          <TitleCards
            title={`Search Results for \"${searchQuery.trim()}\"`}
            items={searchResults.filter((item) => item.backdrop_path || item.poster_path)}
            errorText={searchError}
          />
        ) : null}
        <TitleCards title={"Blockbuster Movies"} category={"top_rated"} />
        <TitleCards title={"Trending Now"} category={"popular"} />
        <TitleCards title={"New Releases"} category={"now_playing"} />
        <TitleCards title={"Recommended for You"} category={"upcoming"} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;

