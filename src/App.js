import logo from "./logo.svg";
import "./App.css";
import Login from "./Login/Login";
//
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Main from "./Main";
import Signup from "./Signup/Signup";

function App() {
  //user hook

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="main" element={<Main />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
}

export default App;