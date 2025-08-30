import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = 'Search by tags or description...',
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search
    debounceRef.current = window.setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      } else {
        onClear();
      }
    }, 500); // Debounce time for better UX

    // Cleanup function
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, onSearch, onClear]);

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="search-container">
      <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
        <MagnifyingGlassIcon className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="search-input-field"
          disabled={isLoading}
        />
        {query && (
          <button
            onClick={handleClear}
            className="search-clear-button"
            type="button"
          >
            <XMarkIcon style={{ width: '16px', height: '16px' }} />
          </button>
        )}
        {isLoading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};
