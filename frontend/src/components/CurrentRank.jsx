// /src/components/CurrentRank.jsx
import React, { useEffect, useState } from 'react';
import badge from '/assets/badge.png';
import { panelBase } from '../assets/Constants';

const CurrentRank = () => {

  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('userEmail'); // get email from localStorage
    if (!email) {
      setLoading(false);
      return;
    }

    // Encode the email for query param
    const encodedEmail = encodeURIComponent(email);

    // Fetch user progress from backend API using query param
    fetch(`http://localhost:8000/api/current-rank/?email=${encodedEmail}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>
  if (!userData) return <div>User data not found.</div>


  return (
    <div
      style={{
        ...panelBase,
        textAlign: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
      }}
    >
      <div
        style={{
          color: '#b9d6b6',
          fontSize: '1em',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          borderBottom: '2px solid rgba(60, 110, 70, 0.35)',
          paddingBottom: '8px',
        }}
      >
        Current Rank
      </div>

      <img
        style={{
          textAlign: 'center',
          margin: '20px auto',
          height: '50px',
          maxWidth: '70%',
        }}
        src={badge}
        alt="Badge"
      />

      {/* User Info */}
      <div style={{ color: 'wheat', fontSize: '1.4em', marginBottom: '0' }}>
        {userData.name}
      </div>
      <div style={{ color: '#b9d6b6', fontSize: '1.2em', marginBottom: '6px' }}>
        Level {userData.level}
      </div>
      <div style={{ color: '#a7b5a8', fontSize: '0.85em', marginBottom: '10px' }}>
        {userData.role || 'Toxic Air Cleaner'}
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '8px',
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '10px',
          overflow: 'hidden',
          margin: '10px 0',
          border: '1px solid rgba(60, 110, 70, 0.3)',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #356a3f, #5e9f6c, #86c28e)',
            width: `${userData.xp_progress_percent}%`,
            borderRadius: '10px',
            animation: 'pulse 2s infinite',
          }}
        />
      </div>
      <div style={{ color: '#a7b5a8', fontSize: '0.7em', marginBottom: '12px' }}>
        {userData.xp.toLocaleString()} / {userData.xp_next_level.toLocaleString()} XP to next rank
      </div>

      {/* Streak Section */}
      <div
        style={{
          margin: '10px auto 0',
          padding: '5px 14px',
          background: 'rgba(50, 90, 60, 0.25)',
          borderRadius: '18px',
          display: 'inline-block',
          boxShadow: 'inset 0 0 12px rgba(60,110,70,0.25)',
          border: '1px solid rgba(60, 110, 70, 0.35)',
          width: '40%',
          minWidth: '140px',
        }}
      >
        <span style={{ fontSize: '0.7em', color: '#ffd966', fontWeight: 'bold' }}>
          🔥 {userData.streak_days}-Day Streak
        </span>
      </div>
    </div>
  );
};

export default CurrentRank;
