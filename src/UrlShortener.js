import React, { useState } from 'react';
import './App.css';
import { REDIRECT_URL, SHORTEN_URL } from './services/apis';

function UrlShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(SHORTEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ long_url: longUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setShortUrl( REDIRECT_URL +data.short_url);
      } else {
        alert(data.error || 'An error occurred.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to shorten URL');
    }
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>

      {/* Shorten URL Image */}
      <img
        src="https://st2.depositphotos.com/1896403/12310/i/450/depositphotos_123109420-stock-photo-written-text-keep-it-short.jpg"
        alt="Shorten your URL"
        className="short-image"
      />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Enter Long URL:</label>
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
            className="input-box"
          />
        </div>
        <button type="submit" className="submit-button">
          Shorten URL
        </button>
      </form>

      {shortUrl && (
        <div
          style={{
            padding: "10px",
          }}
        >
          <label>Shortened URL:</label>
          <a
            href={shortUrl}
           
            style={{
              paddingLeft: "5px",
              color: "skyblue",
            }}
          >
            New URL
          </a>
        </div>
      )}
    </div>
  );
}

export default UrlShortener;
