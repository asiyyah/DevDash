import React from 'react';
import WeatherWidget from '../components/WeatherWidget';

const Dashboard = () => {
  return (
    <div className="fade-in">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
      
      <div className="dashboard-grid">
        <WeatherWidget city="Abuja, Nigeria" />
        
        <section className="card stats-card">
          <h3>Activity Summary</h3>
          <p className="text-secondary">Track your GitHub stats and tasks at a glance.</p>
        </section>
      </div>
    </div>
  );
};


export default Dashboard;
