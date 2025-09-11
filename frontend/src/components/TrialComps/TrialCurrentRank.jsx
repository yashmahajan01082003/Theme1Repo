// /src/components/TrialCurrentRank.jsx
import React, { useEffect, useState } from 'react';
import badge from '../../../public/assets/badge.png';
import { superim, superimHeading } from '../../assets/Constants';

const TrialCurrentRank = ({
        themeno,
        NameColor,
        LevelColor,
        RoleColor,
        ProgresBarBackground,
        ProgresBarBorder,
        ProgresBarInnerBackground,
        XPColor, 
        StreakBackground,
        StreakBoxShadow,
        StreakBorder,
        StreakColor
    }) => {

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
                ...superim[themeno],
                textAlign: 'center',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                padding: '12px',
            }}
        >
            <div
                style={{ ...superimHeading[themeno] }}
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
            <div style={{ color: `${NameColor}`, fontSize: '1.4em', marginBottom: '0' }}>
                {userData.name}
            </div>
            <div style={{ color: `${LevelColor}`, fontSize: '1.2em', marginBottom: '6px' }}>
                Level {userData.level}
            </div>
            <div style={{ color: `${RoleColor}`, fontSize: '0.85em', marginBottom: '10px' }}>
                {userData.role || 'Toxic Air Cleaner'}
            </div>

            {/* Progress Bar */}
            <div
                style={{
                    width: '100%',
                    height: '8px',
                    background: `${ProgresBarBackground}`,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    margin: '10px 0',
                    border: `1px solid ${ProgresBarBorder}`,
                }}
            >
                <div
                    style={{
                        height: '100%',
                        background: `${ProgresBarInnerBackground}`,
                        width: `${userData.xp_progress_percent}%`,
                        borderRadius: '10px',
                        animation: 'pulse 2s infinite',
                    }}
                />
            </div>
            <div style={{ color: `${XPColor}`, fontSize: '0.7em', marginBottom: '12px' }}>
                {userData.xp.toLocaleString()} / {userData.xp_next_level.toLocaleString()} XP to next rank
            </div>

            {/* Streak Section */}
            <div
                style={{
                    margin: '10px auto 0',
                    padding: '5px 14px',
                    background: `${StreakBackground}`,
                    borderRadius: '18px',
                    display: 'inline-block',
                    boxShadow: `inset 0 0 12px ${StreakBoxShadow}`,
                    border: `1px solid ${StreakBorder}`,
                    width: '40%',
                    minWidth: '140px',
                }}
            >
                <span style={{ fontSize: '0.7em', color: `${StreakColor}`, fontWeight: 'bold' }}>
                    🔥 {userData.streak_days}-Day Streak
                </span>
            </div>
        </div>
    );
};

export default TrialCurrentRank;
