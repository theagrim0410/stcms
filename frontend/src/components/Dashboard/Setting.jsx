import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../footerheader/Footer";
import Header from "../footerheader/Header";
import "./Setting.css";

function Setting() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    
    const [temple, setTemple] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("temple"));
        } catch {
            return null;
        }
    });

    const fetchTemple = useCallback(async () => {
        if (!user?.name || !user?.email) {
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/get-temple", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: user.name, email: user.email }),
            });

            const data = await response.json();

            if (response.ok) {
                setTemple(data);
                localStorage.setItem("temple", JSON.stringify(data));
            } else {
                console.log(data.error);
            }
        } catch (err) {
            console.error("Error fetching temple:", err);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchTemple();
    }, [navigate, user, fetchTemple]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const goHome = () => {
        navigate("/about");
    };

  return (
    <div className="settings-page">
      <Header />
          <img
        src="https://pixelsandapen.com/wp-content/uploads/2021/01/Sanskriti-Final-logo-02@2x.png"
        alt="Website Logo"
        className="settings-logo"
        />
      <div className="settings-container">

        <h1>Settings</h1>

        <div className="card">
          <h2> User Info</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>

        <div className="card">
          <h2>Temple Details</h2>

          {temple ? (
            <>
              <p><strong>Account ID:</strong> {temple.account_id}</p>
              <p><strong>Address:</strong> {temple.address}</p>
              <p><strong>Area:</strong> {temple.area} sq ft</p>
              <p><strong>Net Worth:</strong> ₹{temple.networth}</p>
              <p><strong>Owner:</strong> {temple.owner}</p>
              <p><strong>Properties:</strong> {temple.no_of_properties}</p>
            </>
          ) : (
            <p>Loading temple details...</p>
          )}
        </div>

        <div className="settings-buttons">
          <button className="home-btn" onClick={goHome}>
             Home
          </button>

          <button className="logout-btn" onClick={handleLogout}>
             Logout
          </button>
        </div>

      </div>
      <Footer />
    </div>
    
  );
};

export default Setting;