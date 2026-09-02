import React, { useState, useMemo } from 'react';
import GitHubSearch from '../components/GitHubSearch';
import UserProfile from '../components/UserProfile';
import RepoList from '../components/RepoList';
import useFetch from '../hooks/useFetch';

const GitHub = () => {
  const [searchQuery, setSearchQuery] = useState(null);

  const {
    data: user,
    loading: userLoading,
    error: userError
  } = useFetch(searchQuery ? `https://api.github.com/users/${encodeURIComponent(searchQuery)}` : null);

  const {
    data: repos,
    loading: reposLoading,
    error: reposError
  } = useFetch(searchQuery ? `https://api.github.com/users/${encodeURIComponent(searchQuery)}/repos?sort=updated&per_page=6` : null);
  
  const optimizedRepos = useMemo(() => {
    if (!repos) return [];
    // Sort by stars descending to highlight popular work
    return [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
  }, [repos]);

  const handleSearch = (username) => {
    setSearchQuery(username);
  };

  const loading = userLoading || reposLoading;
  const error = userError || reposError;

  return (
    <div className="fade-in">
      <h1 className="page-title">GitHub Tracker</h1>
      <p className="page-subtitle">Search any GitHub user to view their profile and latest activity.</p>
      
      <GitHubSearch onSearch={handleSearch} />

      {loading && <div className="loading-state" role="status">Fetching developer insights...</div>}
      {error && <div className="error-card card" role="alert">{error}</div>}

      {!loading && !error && (
        <div className="github-results">
          {user && <UserProfile user={user} />}
          {optimizedRepos.length > 0 && <RepoList repos={optimizedRepos} />}
        </div>
      )}
    </div>
  );
};


export default GitHub;
