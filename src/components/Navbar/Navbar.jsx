import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import "./Navbar.css";
import avatar from "../../assets/profile_img.png";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { auth, logout } from "../../firebase";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const navref = React.useRef();
    const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser);

    const handleBrandClick = (event) => {
        event.preventDefault();

        if (location.pathname !== "/") {
            navigate("/");
            window.setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "auto" });
            }, 0);
            return;
        }

        window.scrollTo({ top: 0, behavior: "auto" });
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                navref.current.classList.add("nav-dark");
            } else {
                navref.current.classList.remove("nav-dark");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="navbar" ref={navref}>
            <div className="navbar-left">
                <Link to="/" className="navbar-brand-link" onClick={handleBrandClick}>
                    <span className="navbar-brand-mark">STREAM DEMO</span>
                </Link>
                <ul>
                    <li><Link to="/#top">Home</Link></li>
                    <li><Link to="/#tv-shows">TV Shows</Link></li>
                    <li><Link to="/#movies">Movies</Link></li>
                    <li><Link to="/#new-popular">New & Popular</Link></li>
                    <li><Link to="/#my-list">My List</Link></li>
                    <li><Link to="/#browse-languages">Browse by Languages</Link></li>
                </ul>
            </div>
            <div className="navbar-right">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="auth-link">Sign In</Link>
                        <Link to="/login?mode=signup" className="auth-link auth-link-primary">Sign Up</Link>
                    </>
                ) : (
                    <>
                        <img src={avatar} alt="User Avatar" className="navbar-avatar" />
                        <Link to="/#kids-family" className="children-link">Children</Link>
                        <img src={bell_icon} alt="Notifications" className="navbar-icon" />
                        <div className="navbar-profile">
                            <img src={profile_img} alt="User Avatar" className="profile-icon" />
                            <img src={caret_icon} alt="User Avatar" className="dropdown-icon" />
                            <div className="dropdown-menu">
                                <p onClick={handleLogout}>Sign Out of Demo</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};



export default Navbar;
