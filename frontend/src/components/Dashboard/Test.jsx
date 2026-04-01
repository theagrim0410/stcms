import React, { useState } from "react";
import Header from "../footerheader/Header";
import { useNavigate } from "react-router-dom";
import "./Test.css";

const Test = () => {

  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState([]);
  const [peopleData, setPeopleData] = useState([]);
  const [showTable, setShowTable] = useState("");

  async function handleParking() {
    navigate("/parking");
  }

  async function handlePeople() {
    navigate("/people");
  }

  const fetchVehicles = async () => {
    try {
      const res = await fetch("http://localhost:5000/get-vehicles");
      const data = await res.json();

      setVehicleData(data);
      setShowTable("vehicles");

    } catch (err) {
      console.error(err);
    }
  };


  const fetchPeople = async () => {
    try {
      const res = await fetch("http://localhost:5000/get-people");
      const data = await res.json();

      setPeopleData(data);
      setShowTable("people");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="test-page">
      <Header />

      <div className="test-container">
        <h1>Temple Crowd Testing</h1>
        <p>Click below to test crowd management system</p>

        <div className="btn-group">
          <button className="btn parking" onClick={handleParking}>
            Parking
          </button>

          <button className="btn people" onClick={handlePeople}>
             People
          </button>
        </div>

        <div className="data-section">
          <button onClick={fetchVehicles}>Show Last Vehicle Data</button>
          <button onClick={fetchPeople}>Show Last People Data</button>

          {showTable === "vehicles" && (
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Vehicle ID</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {vehicleData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.vehicle_id}</td>
                    <td>{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {showTable === "people" && (
            <table>
              <thead>
                <tr>
                  <th>Number </th>
                  <th>Person ID</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {peopleData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.person_id}</td>
                    <td>{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
};

export default Test;