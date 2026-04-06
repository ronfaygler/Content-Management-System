import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { userRole, switchRole, isAuthor, isEditor } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Content Management System</h1>
        
        <div className="user-controls">
          <div className="role-selector">
            <label>Current Role: </label>
            <select 
              value={userRole} 
              onChange={(e) => switchRole(e.target.value)}
              className="role-select"
            >
              <option value="author">Author</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          
          <div className="role-info">
            {isAuthor() && (
              <span className="role-badge author">Author - Can create and edit articles</span>
            )}
            {isEditor() && (
              <span className="role-badge editor">Editor - Can publish and reject articles</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
