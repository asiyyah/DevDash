import React from 'react';
import { Users, MapPin, Link as LinkIcon, Book } from 'lucide-react';

const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="card user-profile-card fade-in">
      <div className="profile-header">
        <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="avatar" />
        <div className="profile-info">
          <h2 className="user-name">{user.name || user.login}</h2>
          <p className="user-handle">@{user.login}</p>
        </div>
      </div>
      
      {user.bio && <p className="user-bio">{user.bio}</p>}
      
      <div className="user-meta">
        {user.location && (
          <div className="meta-item">
            <MapPin size={16} />
            <span>{user.location}</span>
          </div>
        )}
        {user.blog && (
          <div className="meta-item">
            <LinkIcon size={16} />
            <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer">
              Visit {user.name || user.login}'s website
            </a>
          </div>
        )}
      </div>

      <div className="user-stats">
        <div className="stat-box">
          <Users size={16} />
          <span><strong>{user.followers}</strong> Followers</span>
        </div>
        <div className="stat-box">
          <Book size={16} />
          <span><strong>{user.public_repos}</strong> Repos</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
