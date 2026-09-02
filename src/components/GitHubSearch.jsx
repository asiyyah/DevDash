import React, { useState } from 'react';
import { Search } from 'lucide-react';

const GitHubSearch = ({ onSearch }) => {
  const [username, setUsername] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;

    // GitHub username rules: alphanumeric or single hyphens, no start/end with hyphen
    const githubRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    
    if (!githubRegex.test(trimmedUsername)) {
      setValidationError('Invalid GitHub username format.');
      return;
    }

    onSearch(trimmedUsername);
  };

  return (
    <form className="github-search" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <Search size={20} className="search-icon" />
        <label className="sr-only" htmlFor="github-username">GitHub username</label>
        <input
          id="github-username"
          type="text"
          className="input"
          placeholder="Search GitHub username..."
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (validationError) setValidationError('');
          }}
          aria-describedby={validationError ? 'github-username-error' : undefined}
          aria-invalid={Boolean(validationError)}
        />
        {validationError && <p id="github-username-error" className="validation-error" role="alert">{validationError}</p>}
      </div>
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
};

export default GitHubSearch;
