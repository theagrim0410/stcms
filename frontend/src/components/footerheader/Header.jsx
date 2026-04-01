import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="header">

      <div className="logo-container" onClick={() => navigate("/about")}>
        <img
          src="https://pixelsandapen.com/wp-content/uploads/2021/01/Sanskriti-Final-logo-02@2x.png"
          alt="logo"
          className="logo-img"
        />
        <h2 className="logo-text">STCMS</h2>
      </div>

      <nav className="nav">
        <Link 
          to="/about" 
          className={location.pathname === "/about" ? "active" : ""}
        >
          About
        </Link>

        <Link 
          to="/test" 
          className={location.pathname === "/test" ? "active" : ""}
        >
          Test
        </Link>

        <Link 
          to="/contact" 
          className={location.pathname === "/contact" ? "active" : ""}
        >
          Contact
        </Link>
      </nav>

      <div className="profile" onClick={() => navigate("/settings")}>
        <img
          src="https://5.imimg.com/data5/SELLER/Default/2023/9/344948325/WT/KL/NR/91058697/om-logo-1ft.jpg"
          alt="profile"
        />
      </div>

    </header>
  );
};

export default Header;