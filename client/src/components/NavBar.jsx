import React, { useState } from 'react';
import './NavBar.css'
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <nav className="navbar">
      <h1>My App</h1>
      <div className="user-menu">
        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
          {user.username}
        </button>
        {dropdownOpen && (
          <div className="dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
