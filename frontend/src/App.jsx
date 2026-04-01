import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAccount from "./components/loginpages/CreateAccount";
import About from "./components/Dashboard/About";
import Contact from "./components/Dashboard/Contact";
import People from "./components/Dashboard/People";
import Parking from "./components/Dashboard/Parking";
import Setting from "./components/Dashboard/Setting";
import Detail from "./components/loginpages/Detail";
import Test from "./components/Dashboard/Test";
import Login from "./components/loginpages/Login"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/people" element={<People />} />
        <Route path="/parking" element={<Parking />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/dashboard" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/test" element={<Test />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
    </Router>
  );
};

export default App;
