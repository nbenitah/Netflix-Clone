import React
 from "react";

import "./Footer.css";
import youtube_icon from "../../assets/youtube_icon.png";
import facebook_icon from "../../assets/facebook_icon.png";
import twitter_icon from "../../assets/twitter_icon.png";
import instagram_icon from "../../assets/instagram_icon.png";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-icons">
                <img src={youtube_icon} alt="YouTube" />
                <img src={facebook_icon} alt="Facebook" />
                <img src={twitter_icon} alt="Twitter" />
                <img src={instagram_icon} alt="Instagram" />
            </div>
            <ul>
               <i>Audio Description</i> 
                <i>Help Center</i>
                <i>Gift Cards</i>
                <i>Media Center</i>
                <i>Investor Relations</i>
                <i>Jobs</i>
                <i>Terms of Use</i>
                <i>Privacy</i>
                <i>Legal Notices</i>
                <i>Cookie Preferences</i>
                <i>Corporate Information</i>
                <i>Contact Us</i>
            </ul>
            <p className='copyright-text'>
                &copy; 2026 Streaming UI Demo by Nathalie Benitah. All rights reserved.
            </p>
        
        </div>
    );
};

export default Footer;

 