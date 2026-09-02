import React from 'react';
import { Cloud, MapPin, Wind, Droplets } from 'lucide-react';
import useFetch from '../hooks/useFetch';

const WeatherWidget = ({ city = 'Abuja, Nigeria' }) => {
  const encodedCity = encodeURIComponent(city);
  const { data: weather, loading, error } = useFetch(`https://wttr.in/${encodedCity}?format=j1`);

  if (loading) return <div className="card" role="status">Loading weather...</div>;
  if (error) return <div className="card text-rose" role="alert">Error: {error}</div>;

  const current = weather?.current_condition?.[0];
  const nearestArea = weather?.nearest_area?.[0];

  if (!current) return <div className="card">Weather data currently unavailable.</div>;

  return (
    <div className="card weather-widget fade-in">
      <div className="widget-header">
        <MapPin size={18} className="accent-cyan" />
        <span className="city-name">{nearestArea?.areaName?.[0]?.value || city}</span>
      </div>
      
      <div className="widget-main">
        <div className="temp-display">
          <h2 className="temp">{current?.temp_C}°C</h2>
          <p className="condition">{current?.weatherDesc?.[0]?.value}</p>
        </div>
        <Cloud size={48} className="weather-icon" />
      </div>

      <div className="widget-stats">
        <div className="stat">
          <Wind size={16} />
          <span>{current?.windspeedKmph} km/h</span>
        </div>
        <div className="stat">
          <Droplets size={16} />
          <span>{current?.humidity}%</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
