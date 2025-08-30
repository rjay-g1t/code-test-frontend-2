import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  ChevronDownIcon,
  PhotoIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <PhotoIcon style={{ width: '28px', height: '28px' }} />
            Gallery
          </div>

          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="btn-outline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '40px',
                }}
              >
                <UserCircleIcon style={{ width: '24px', height: '24px' }} />
                <span>{user.email}</span>
                <ChevronDownIcon style={{ width: '16px', height: '16px' }} />
              </button>

              {showDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: 'calc(100% + 8px)',
                    background: 'var(--color-white)',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: 'var(--shadow-large)',
                    border: '1px solid var(--color-gray-300)',
                    minWidth: '200px',
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-gray-700)',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'var(--color-gray-100)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
