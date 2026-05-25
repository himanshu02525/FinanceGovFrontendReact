import React from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, onClear, onSubmit, placeholder = 'Search...' }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
    };

    return (
        <form className="search-bar d-flex mb-3" onSubmit={handleSubmit}>
            <input
                type="text"
                className="form-control search-input"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            <button type="button" className="btn btn-outline-primary d-inline-flex justify-content-center align-items-center clear-btn" onClick={onClear}>
                Clear
            </button> </form>
    );
};

export default SearchBar;
