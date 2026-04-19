import React, { useEffect, useState } from "react";
import "./Player.css";
import backArrowIcon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";

const Player = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [apiData, setApiData] = useState({
        name: "",
        key: "",
        published_at: "",
        type: ""
    });
    const [videoOptions, setVideoOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getEmbedUrl = (video) => {
        if (!video?.key || !video?.site) {
            return "";
        }

        if (video.site === "YouTube") {
            return `https://www.youtube.com/embed/${video.key}`;
        }

        if (video.site === "Vimeo") {
            return `https://player.vimeo.com/video/${video.key}`;
        }

        return "";
    };

    const getWatchUrl = (video, movieId) => {
        if (!video?.site || !video?.key) {
            return `https://www.themoviedb.org/movie/${movieId}/videos`;
        }

        if (video.site === "YouTube") {
            return `https://www.youtube.com/watch?v=${video.key}`;
        }

        if (video.site === "Vimeo") {
            return `https://vimeo.com/${video.key}`;
        }

        return `https://www.themoviedb.org/movie/${movieId}/videos`;
    };



    useEffect(() => {
        if (!id) {
            return;
        }
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzUzMzhkZTQwNGIxZTc4MjVlNjM3NmFkODZlYWJmMSIsIm5iZiI6MTc3NjUzMjIwNy4zOTM5OTk4LCJzdWIiOiI2OWUzYmFlZjZlMTUzOWQwNzAyNmVjMTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ll4-TCjR_Z5rJW51nxrLEH8LGfM0usa5bsTKd5KHVjU",
            },
        };

        setLoading(true);
        setError("");

        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
            .then((res) => res.json())
            .then((res) => {
                const videos = Array.isArray(res.results) ? res.results : [];
                const playableOptions = videos.filter(
                    (video) =>
                        video?.key &&
                        (video.site === "YouTube" || video.site === "Vimeo")
                );

                const trailer =
                    playableOptions.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Trailer" &&
                            video.official
                    ) ||
                    playableOptions.find(
                        (video) => video.site === "YouTube" && video.type === "Trailer"
                    ) ||
                    playableOptions.find(
                        (video) => video.site === "YouTube" && video.type === "Teaser"
                    ) ||
                    playableOptions.find(
                        (video) =>
                            video.site === "Vimeo" &&
                            video.type === "Trailer" &&
                            video.official
                    ) ||
                    playableOptions.find(
                        (video) => video.site === "Vimeo" && video.type === "Trailer"
                    ) ||
                    playableOptions.find(
                        (video) => video.site === "Vimeo" && video.type === "Teaser"
                    ) ||
                    playableOptions[0] ||
                    null;

                if (!trailer) {
                    setVideoOptions([]);
                    setApiData({
                        name: "",
                        key: "",
                        published_at: "",
                        type: "",
                    });
                    setError("No trailer is available for this movie.");
                    return;
                }

                setVideoOptions(playableOptions.slice(0, 6));
                setApiData(trailer);
            })
            .catch((err) => {
                console.error(err);
                setVideoOptions([]);
                setError("Could not load trailer right now.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);



    return (
        <div className="player">
            <img src={backArrowIcon} alt="Back" onClick={() => navigate(-1)} />
            {loading && <p>Loading trailer...</p>}
            {!loading && error && <p>{error}</p>}
            {!loading && !error && apiData.key && getEmbedUrl(apiData) && (
                <>
                    <iframe
                        width="90%"
                        height="90%"
                        src={getEmbedUrl(apiData)}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <a
                        href={getWatchUrl(apiData, id)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Open trailer on {apiData.site}
                    </a>
                </>
            )}
            {!loading && !error && apiData.key && !getEmbedUrl(apiData) && (
                <a href={getWatchUrl(apiData, id)} target="_blank" rel="noreferrer">
                    Open trailer on {apiData.site}
                </a>
            )}
            {!loading && !error && !apiData.key && (
                <a href={`https://www.themoviedb.org/movie/${id}/videos`} target="_blank" rel="noreferrer">
                    Open movie videos on TMDB
                </a>
            )}
            {!loading && !error && videoOptions.length > 1 && (
                <div>
                    <p>Try another clip:</p>
                    {videoOptions.map((video) => (
                        <button
                            key={video.id}
                            type="button"
                            onClick={() => setApiData(video)}
                        >
                            {(video.name || "Video").slice(0, 45)}
                        </button>
                    ))}
                </div>
            )}
            <div className="player-info">
                <p>{apiData.published_at ? apiData.published_at.slice(0, 10) : ""}</p>
                <p>{apiData.name || ""}</p>
                <p>{apiData.type || ""}</p>
            </div>
        </div>
    );
};

export default Player;
