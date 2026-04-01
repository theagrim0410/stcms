import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Detail.css";

const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    account_id: "",
    address: "",
    area: "",
    networth: "",
    owner: "",
    no_of_properties: "",
    email : ""
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
    if (location.state?.account_id) {
      setFormData(prev => ({ ...prev, account_id: location.state.account_id }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/detail_edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

    if (response.ok) {

    localStorage.setItem("temple", JSON.stringify(formData));

    alert("Temple details saved 🛕");

    setFormData({
      account_id: "",
        address: "",
        area: "",
        networth: "",
        owner: "",
      no_of_properties: "",
        email: ""
    });

    navigate("/");
    } else {
        alert(data.error);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="detail-page">

      <img
        className="background-lotus"
        alt="lotus"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVe9-Zezb-WrVzys_GfxSmZGn92iIycbwCWTYKDtgq9fBJjckB7ldFGX8vaT3yYW0nXigrWc2pI6i_xir22Z3SEDRH4N2kht15yHW1PFmb-rlBtvm61MlKD-A8sfU_kVC3StMsWD8GHYDY_-ZQ5uPaHVKd0YG1cYgRGG5Q2l-z3a20jkKmHC8TzznlfQY25V4sCkJGD1BeHgSXTQIwR0q5iSSRKKVqB8eEhBP5Fc3YKoXGCnvCYS-nOVflbMsFudFy_mzo_9nuBiY"
      />

      <div className="detail-card">
        <h1>🛕 Temple Details</h1>

        <form onSubmit={handleSubmit}>

          <label>
            Account ID
            <input
              type="text"
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
              disabled
            />
          </label>

          <label>
            Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Area (sq ft)
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
            />
          </label>

          <label>
            Net Worth
            <input
              type="text"
              name="networth"
              value={formData.networth}
              onChange={handleChange}
            />
          </label>

          <label>
             Name
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
            />
          </label>

          <label>
            Number of Properties
            <input
              type="number"
              name="no_of_properties"
              value={formData.no_of_properties}
              onChange={handleChange}
            />
          </label>

          
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Submit Details</button>
        </form>
         <p style={{ textAlign: "center", marginTop: "1rem", color: "#5a3e1b" }}>
          Don't have an account? <Link to="/create-account">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Detail;