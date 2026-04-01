import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-left">
          <h2>Sansu Temple Crowd System</h2>
          <p>Managing crowd with devotion & technology</p>
        </div>

        <div className="footer-center">
          <a href="/about">Home</a>
          <a href="/contact">Contact</a>
          <a href="/test">Testing</a>
        </div>

        <div className="footer-right">
          <p> +91 9876543210</p>
          <p>temple@support.com</p>
          <p>Bareilly ,India</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Temple Crowd Management </p>
      </div>

    </footer>
  );
};

export default Footer;