// Avatar.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router
import toast from 'react-hot-toast';

const Avatar = ({ src, alt }) => {
  const {removeUserId} = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = () => {
    // Implement your sign-out logic here
    navigate('/');
    removeUserId();
    toast.success('Signed out successfully!');
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          </div>
          {/* <p className="text-gray-700">{alt}</p> */}
        </button>
      </div>

      {showDropdown && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={handleSignOut}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
