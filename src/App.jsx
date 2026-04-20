import React, { useEffect } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from './pages/Login/Login';
import Player from './pages/Player/Player';
import {onAuthStateChanged} from "firebase/auth";
import {  auth} from './firebase'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged In");
        if (location.pathname === "/login") {
          navigate("/", { replace: true });
        }
        
      } else {
      console.log("Logged Out");
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      }

    });

    return () => unsubscribe();
  }, [location.pathname, navigate]);



  return (
    <div>
      <div className="site-disclaimer">
        Educational streaming UI demo. Not affiliated with any real streaming provider.
      </div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player />} />

      </Routes>
      
    </div>
  )
}

export default App
