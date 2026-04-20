import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./TitleCards.css";

const categoryRequestMap = {
    top_rated: "https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=revenue.desc&page=1",
    popular: "https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=1",
    now_playing: "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
    upcoming: "https://api.themoviedb.org/3/discover/movie?language=en-US&vote_average.gte=7&vote_count.gte=600&page=1",
};

const TitleCards = ({ title, category, items, errorText }) => {
    const [apiData, setApiData] = useState([]);
    const [error, setError] = useState("");
    const cardsRef = useRef(null);
    const selectedCategory = category || "now_playing";
    const requestUrl = categoryRequestMap[selectedCategory] || categoryRequestMap.now_playing;
    const hasExternalItems = Array.isArray(items);
    const cardItems = hasExternalItems ? items : apiData;
    const visibleError = hasExternalItems ? errorText : error;

    useEffect(() => {
        if (hasExternalItems) {
            return undefined;
        }

        const controller = new AbortController();
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzUzMzhkZTQwNGIxZTc4MjVlNjM3NmFkODZlYWJmMSIsIm5iZiI6MTc3NjUzMjIwNy4zOTM5OTk4LCJzdWIiOiI2OWUzYmFlZjZlMTUzOWQwNzAyNmVjMTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ll4-TCjR_Z5rJW51nxrLEH8LGfM0usa5bsTKd5KHVjU",
            },
            signal: controller.signal,
        };

        setError("");
        fetch(requestUrl, options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`TMDB request failed with status ${res.status}`);
                }

                return res.json();
            })
            .then((res) => {
                setApiData(Array.isArray(res.results) ? res.results : []);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setApiData([]);
                    setError("Unable to load movies right now.");
                }
            });

        return () => controller.abort();
    }, [hasExternalItems, requestUrl]);

    useEffect(() => {
        const currentCards = cardsRef.current;

        if (!currentCards) {
            return undefined;
        }

        const handleWheel = (event) => {
            event.preventDefault();
            currentCards.scrollLeft += event.deltaY;
        };

        currentCards.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            currentCards.removeEventListener("wheel", handleWheel);
        };
    }, []);

    return (
        <div className="title-cards">
            <h2>{title || "Popular Right Now"}</h2>
            <div className="card-list" ref={cardsRef}>
                {cardItems.map((card) => (
                    <div className="card" key={card.id}>
                        <Link to={`/player/${card.id}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path || card.poster_path}`}
                                alt={card.title || card.name || card.original_title || "Movie poster"}
                            />
                            <p>{card.title || card.name || card.original_title}</p>
                        </Link>
                    </div>
                ))}
            </div>
            {!cardItems.length && !visibleError ? <p className="cards-message">No titles found.</p> : null}
            {visibleError ? <p className="cards-message">{visibleError}</p> : null}
        </div>
    );
};

export default TitleCards;

