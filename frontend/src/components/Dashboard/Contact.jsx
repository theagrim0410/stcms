import React, { useState } from "react";
import Header from "../footerheader/Header";
import Footer from "../footerheader/Footer";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Message saved successfully and email sent!");
      setForm({ name: "", email: "", message: "" });
    } else {
      alert(data.error);
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

return (
    <div className="contact-page">
      <Header />

      <div className="contact-wrapper">

        <div className="contact-form-section">
          <h1> Contact Us</h1>
          <p>Reach out for temple crowd management support</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="contact-info-section">
          <h2>Get in Touch</h2>

          <p><strong>Phone:</strong> +91 9876543210</p>
          <p><strong>Email:</strong> temple@support.com</p>
          <p><strong>Address:</strong> Temple Road , Bareilly,  India</p>

          <div className="social-links">
            <a href="#">Instagram</a>
            <a href="#"> Twitter</a>
            <a href="#"> Website</a>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};
export default Contact;