import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CreateAccount.css";
import { useNavigate } from "react-router-dom";

const EyeOpen = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className="password-toggle"
  >
    <path
      fill="currentColor"
      d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"
    />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

const EyeClosed = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className="password-toggle"
  >
    <path
      fill="currentColor"
      d="M12 5c-7 0-11 7-11 7s4 7 11 7c2.05 0 3.95-.55 5.64-1.5l1.41 1.41 1.41-1.41-1.35-1.36C20.2 12.97 21 12 21 12s-4-7-11-7zm0 12a5 5 0 01-5-5c0-.66.14-1.28.38-1.84l6.46 6.46c-.56.24-1.18.38-1.84.38z"
    />
  </svg>
);



const CreateAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
   const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cnfpassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/create-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      setFormData({ name: "", email: "", password: "",cnfpassword: "" });
       setTimeout(() => navigate("/detail", { state: { account_id: data.account_id } }), 1500);
    } else {
      alert(data.error);
    }
  };



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  return (
    <div className="create-account-page">
      <img
        className="background-lotus"
        alt="A faint outline of a lotus flower"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVe9-Zezb-WrVzys_GfxSmZGn92iIycbwCWTYKDtgq9fBJjckB7ldFGX8vaT3yYW0nXigrWc2pI6i_xir22Z3SEDRH4N2kht15yHW1PFmb-rlBtvm61MlKD-A8sfU_kVC3StMsWD8GHYDY_-ZQ5uPaHVKd0YG1cYgRGG5Q2l-z3a20jkKmHC8TzznlfQY25V4sCkJGD1BeHgSXTQIwR0q5iSSRKKVqB8eEhBP5Fc3YKoXGCnvCYS-nOVflbMsFudFy_mzo_9nuBiY"
      />

      <div className="create-account-card">
        <h1>Create Your Account</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input 
              type="text" 
              name="name"
              value={formData.name}
              placeholder="Enter Temple name"    
              onChange={handleChange} 
              required
            />
          </label>

          <label>
            Email
            <input 
              type="email" 
              name="email"
              value={formData.email}
              placeholder="Enter  email"  
              onChange={handleChange} 
              required
            />
          </label>

          <label>
            Password
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Enter your password"
              onChange={handleChange} 
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOpen /> : <EyeClosed />}
            </span>
          </label>

          <label>
            Confirm Password
            <input
              type={showConfirm ? "text" : "password"}
              name="cnfpassword"
              value={formData.cnfpassword}
              placeholder="Confirm your password"
              onChange={handleChange} 
              required
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOpen /> : <EyeClosed />}
            </span>
          </label>

          <button type="submit" className="submit">Create Account</button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", color: "#5a3e1b" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
