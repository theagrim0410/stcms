import React, { useState } from "react";
import Header from "../footerheader/Header";

import "./People.css";

const People = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("temple", user?.name || "");
    formData.append("email", user?.email || "");

    try {
      setLoading(true);   
      setResult(null);

      const res = await fetch("http://localhost:5000/run-people", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      alert("Error processing image");
    } finally {
      setLoading(false); 
    }
  };

  const handleCamera = () => {
    alert("Live camera is future scope");
  };

  return (
    <div className="people-page">
      <Header />

      <div className="people-container">
        <h1> Crowd Detection</h1>

        <input type="file" accept="image/*" onChange={handleUpload} />

        <div className="btn-group">
          <button onClick={handleSubmit}>Upload & Run</button>
          <button onClick={handleCamera}>Connect Camera</button>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing crowd... Please wait</p>
          </div>
        )}

        {result && !loading && (
          <div className="result-box">
            <h2>Result</h2>
            <p className="count">Total People: {result.count}</p>
          </div>
        )}
      </div>
 
    </div>
  );
};

export default People;