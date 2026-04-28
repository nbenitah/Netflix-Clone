import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import hero_banner from "../../assets/hero_banner.jpg";
import hero_title from "../../assets/hero_title.png";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/Navbar/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";

const featuredTitle = {
  name: "The Protector",
  trailerPath: "/player/tv/79617?lang=tr",
  year: "2018",
  genre: "Fantasy Action",
  language: "Turkish",
  summary: "A young man in modern Istanbul learns he is connected to an ancient secret order and must protect the city from an immortal enemy.",
};

const searchOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzUzMzhkZTQwNGIxZTc4MjVlNjM3NmFkODZlYWJmMSIsIm5iZiI6MTc3NjUzMjIwNy4zOTM5OTk4LCJzdWIiOiI2OWUzYmFlZjZlMTUzOWQwNzAyNmVjMTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ll4-TCjR_Z5rJW51nxrLEH8LGfM0usa5bsTKd5KHVjU",
  },
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchError, setSearchError] = React.useState("");
  const [showFeaturedInfo, setShowFeaturedInfo] = React.useState(false);
  const deferredQuery = React.useDeferredValue(searchQuery.trim());

  const handlePlayClick = () => {
    navigate(featuredTitle.trailerPath);
  };

  const handleMoreInfoClick = () => {
    setShowFeaturedInfo((currentValue) => !currentValue);
  };

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
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(deferredQuery)}&include_adult=false&language=en-US&page=1`,
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

  React.useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const sectionElement = document.getElementById(sectionId);

    if (sectionElement) {
      window.setTimeout(() => {
        sectionElement.scrollIntoView({ behavior: "auto", block: "start" });
      }, 0);
    }
  }, [location.hash]);

  return (
    <div className='home' id="top">
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
                <button className='btn' onClick={handlePlayClick}>
                    <img src={play_icon} alt="" />
                    Play
                    </button>
                <button className="btn dark-btn" onClick={handleMoreInfoClick}>
                    <img src={info_icon} alt="" />
                    {showFeaturedInfo ? "Hide Info" : "More Info"}
                </button>
            </div>
            {showFeaturedInfo ? (
              <div className="featured-info-card">
                <p className="featured-info-meta">{featuredTitle.year} · {featuredTitle.genre} · {featuredTitle.language}</p>
                <p className="featured-info-summary">{featuredTitle.summary}</p>
              </div>
            ) : null}
            <div className="search-panel">
              <label className="search-label" htmlFor="movie-search">Search movies and TV shows</label>
              <input
                id="movie-search"
                className="search-input"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search for a movie or TV title"
              />
            </div>
            {searchQuery.trim() ? (
              <div className="hero-search-results">
                <TitleCards
                  title={`Search Results for \"${searchQuery.trim()}\"`}
                  items={searchResults.filter((item) => (item.media_type === "movie" || item.media_type === "tv") && (item.backdrop_path || item.poster_path))}
                  errorText={searchError}
                />
              </div>
            ) : null}
        </div>
      </div>
      <div className="home-content">
        <TitleCards title={"Blockbuster Movies"} category={"top_rated"} sectionId="movies" />
        <TitleCards title={"Trending Now"} category={"popular"} sectionId="new-popular" />
        <TitleCards title={"Trending TV"} category={"trending_tv"} sectionId="tv-shows" />
        <TitleCards title={"Top Rated TV"} category={"top_rated_tv"} />
        <TitleCards title={"On The Air"} category={"on_the_air_tv"} />
        <TitleCards title={"New Releases"} category={"now_playing"} />
        <TitleCards title={"Recommended for You"} category={"upcoming"} />
        <TitleCards title={"Kids & Family"} category={"kids_family"} sectionId="kids-family" />
        <TitleCards title={"My List (Demo Picks)"} category={"my_list_demo"} sectionId="my-list" />
        <TitleCards title={"Browse by Languages: Korean TV"} category={"korean_tv"} sectionId="browse-languages" />
        <TitleCards title={"Browse by Languages: Hindi Movies"} category={"hindi_movies"} />
        <TitleCards title={"Browse by Languages: French Movies"} category={"french_movies"} />
        <TitleCards title={"Browse by Languages: Spanish Movies"} category={"spanish_movies"} />
        <TitleCards title={"Browse by Languages: Spanish TV"} category={"spanish_tv"} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;

