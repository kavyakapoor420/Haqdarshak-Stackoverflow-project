
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';

// AutoCompleteSearchBar Component
const AutoCompleteSearchBar = ({ value, onChange }) => {
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [cache, setCache] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Handle click outside to hide results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced API fetch
  const fetchData = async (query) => {
    if (!query.trim()) {
        setResults([]);
        return;
    }

    if (cache[query]) {
        setResults(cache[query]);
        return;
    }

   setIsLoading(true);
    try {
        const response = await fetch('http://localhost:5000/api/scheme-names');
        // const response=await fetch('https://haqdarshak-stackoverflow-project.onrender.com/api/scheme-names')
        const schemeNames = await response.json();
        const filteredResults = schemeNames.filter(name =>
        name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
        setCache(prev => ({ ...prev, [query]: filteredResults }));
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setIsLoading(false);
    }
  };

  // Debounce input changes
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (value) fetchData(value);
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [value]);

  // Handle suggestion click
  const handleSuggestionClick = (recipeName) => {
    onChange(recipeName);
    setShowResults(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <input
        type="text"
        placeholder="Search for scheme title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowResults(true)}
        className="w-full p-4 border-2 border-orange-200/50 rounded-xl focus:outline-none focus:border-amber-400 transition-all duration-300 text-gray-800 placeholder-gray-500"
      />
      {showResults && value && (
        <div className="absolute w-full mt-1 bg-white border border-orange-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
          {isLoading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : results.length > 0 ? (
            results.map((scheme, index) => (
                <div
                    key={index}
                    className="p-3 text-gray-700 hover:bg-amber-50 Hover:text-amber-600 cursor-pointer transition duration-150"
                    onClick={() => handleSuggestionClick(scheme)}
                  >
                    <span className="font-medium">{scheme}</span>
                </div>

            )
        )
          ) : (
            <div className="p-4 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};


export default AutoCompleteSearchBar