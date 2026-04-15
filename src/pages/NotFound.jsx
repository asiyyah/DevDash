import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="not-found fade-in">
      <Rocket size={64} className="not-found-icon" />
      <h1>404</h1>
      <h2>Lost in Orbit</h2>
      <p>The page you are looking for has drifted away into space.</p>
      <Link to="/" className="btn btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
