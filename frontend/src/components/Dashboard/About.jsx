


import React from "react";
import Header from "../footerheader/Header";
import Footer from "../footerheader/Footer";
import { useNavigate } from "react-router-dom";
import "./About.css";

const About = () => {
  const navigate = useNavigate();
  const handleSubmit = async () => {
    navigate("/contact");
  }
  return (
    <div className="about-page">
      <Header />

      <section className="about">

        <div className="about-text">
          <h1>Sansu Temple Crowd Management System</h1>

          <p>
            Our system helps manage temple crowds efficiently, ensuring a smooth
            and peaceful darshan experience for all devotees.
          </p>

          <p>
            With real-time monitoring of People and Vechicles In parking ,Which Helps in Montoring the Crowd In the Temple and manages the flow.
          </p>

          <button className="explore-btn" onClick={handleSubmit}>
            Contact us
            </button>
        </div>

        <div className="about-image">
          <img
            src="https://i.pinimg.com/736x/83/9c/3b/839c3bd40b04b08daae7c82817b32a01.jpg"
            alt="temple"
          />
        </div>

      </section>
      <Footer />

    </div>
  );
};

export default About;