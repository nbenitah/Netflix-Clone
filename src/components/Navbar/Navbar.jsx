import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import "./Navbar.css";
import logo from "../../assets/logo.png";
import avatar from "../../assets/profile_img.png";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { auth, logout } from "../../firebase";

const Navbar = () => {
    const navigate = useNavigate();
    const navref = React.useRef();
    const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser);

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
                <Link to="/">
                    <img src={logo} alt="Streaming Demo Logo" className="navbar-logo" />
                </Link>
                <ul>
                    <li>Home</li>
                    <li>TV Shows</li>
                    <li>Movies</li>
                    <li>New & Popular</li>
                    <li>My List</li>
                    <li>Browse by Languages</li>
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
                        <p>Children</p>
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
