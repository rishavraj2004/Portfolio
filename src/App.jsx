import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Hero />
      </main>
    </div>
  );
}
