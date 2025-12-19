import React from 'react'

import "../styles/main.css";
import beach from "../assets/sample-beach.jpg";
const Home = () => {
  return (
    <div>
      <div className="hero">
      <img src={beach} alt="Holiday" />
      <div className="hero-text">
        <h1>Book Your Dream Holiday</h1>
        <p>Flights + Hotels in one easy booking</p>
      </div>
    </div>
    </div>
  )
}

export default Home

