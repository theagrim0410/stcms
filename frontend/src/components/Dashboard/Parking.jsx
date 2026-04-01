import React, { useState } from "react";
import Header from "../footerheader/Header";
import "./Parking.css";

const Parking = () => {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!video) {
      alert("Please upload a video first");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const formData = new FormData();
    formData.append("video", video);
    formData.append("temple", user?.name || "");
    formData.append("email", user?.email || "");

    try {
      setLoading(true);    
      setResult(null);

      const res = await fetch("http://localhost:5000/run-parking", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      alert("Error processing video");
    } finally {
      setLoading(false);   
    }
  };

  const handleCamera = () => {
    alert("Live camera feature is future scope");
  };

  return (
    <div className="parking-page">
      <Header />

      <div className="parking-container">
        <h1>Parking Detection</h1>

        <input type="file" accept="video/*" onChange={handleUpload} />

        <div className="btn-group">
          <button onClick={handleSubmit}>Upload & Run</button>
          <button onClick={handleCamera}>Connect Camera</button>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing video.....</p>
          </div>
        )}

        {result && !loading && (
          <div className="result-box">
            <h2>Result</h2>

            {result.status === "full" ? (
              <p className="full"> Parking Full</p>
            ) : (
              <p className="ok"> Parking is still Empty</p>
            )}

            <p>Total Vehicles: {result.count}</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Parking;