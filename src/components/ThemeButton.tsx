import React from 'react';
import { Theme } from '../hooks/useCollaborativeSession';

interface ThemeButtonProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const styles = {
  button: {
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
  },
  light: {
    background: '#333',
    color: '#fff',
    borderColor: '#333',
  },
  dark: {
    background: '#fff',
    color: '#333',
    borderColor: '#ccc',
  },
};

export const ThemeButton: React.FC<ThemeButtonProps> = ({ theme, onThemeChange }) => {
  const handleToggle = () => {
    onThemeChange(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button 
      onClick={handleToggle}
      style={{
        ...styles.button,
        ...(theme === 'light' ? styles.light : styles.dark),
      }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span>{theme === 'light' ? '🌙' : '☀️'}</span>
      <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
    </button>
  );
};

export default ThemeButton;
