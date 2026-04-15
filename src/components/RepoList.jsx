import React from 'react';
import { Star, GitFork, ExternalLink } from 'lucide-react';

const RepoList = ({ repos }) => {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="repos-container fade-in">
      <h3 className="section-title">Repositories</h3>
      <div className="repos-grid">
        {repos.map((repo) => (
          <div key={repo.id} className="card repo-card">
            <div className="repo-header">
              <h4 className="repo-name">{repo.name}</h4>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-link">
                <ExternalLink size={16} />
              </a>
            </div>
            
            {repo.description && <p className="repo-desc">{repo.description}</p>}
            
            <div className="repo-footer">
              {repo.language && (
                <span className="repo-lang">
                  <span className="lang-dot"></span>
                  {repo.language}
                </span>
              )}
              <div className="repo-counts">
                <div className="count-item">
                  <Star size={14} />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="count-item">
                  <GitFork size={14} />
                  <span>{repo.forks_count}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoList;
