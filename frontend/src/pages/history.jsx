import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }
        fetchHistory();
    }, []);
    const videoBackgroundStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -3,
        objectFit: 'cover',
    };
    const gradientOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        background: 'linear-gradient(120deg, rgba(30,34,90,0.7) 0%, rgba(20,20,20,0.7) 100%)',
    };
    const glassCardStyle = {
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
        padding: '36px 28px',
        maxWidth: 480,
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };
    const cardStyle = {
        borderRadius: 18,
        margin: '18px 0',
        boxShadow: '0 2px 12px rgba(102,126,234,0.10)',
        background: 'rgba(255,255,255,0.95)',
        width: '100%',
    };
    const homeBtnStyle = {
        position: 'absolute',
        top: 32,
        left: 32,
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(102,126,234,0.10)',
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            {/* Video background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={videoBackgroundStyle}
                src="/video1.mp4"
            />
            {/* Dark gradient overlay */}
            <div style={gradientOverlayStyle} />

            {/* Navigation Bar */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 32px)',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: 1
                }}>Video X</h2>
                <IconButton
                    onClick={() => routeTo("/home")}
                    style={{
                        color: '#fff',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 16,
                        padding: 12,
                        boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' }
                    }}
                    size="large"
                >
                    <HomeIcon fontSize="inherit" />
                </IconButton>
            </div>

            {/* Main Content */}
            <div style={{
                padding: 'clamp(20px, 5vw, 40px)',
                display: 'flex',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 80px)'
            }}>
                <div style={{
                    ...glassCardStyle,
                    width: '100%',
                    maxWidth: '600px',
                    padding: 'clamp(24px, 5vw, 36px) clamp(20px, 4vw, 28px)',
                    margin: 'clamp(20px, 5vw, 40px) auto'
                }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: '#333',
                            mb: 3,
                            letterSpacing: 1,
                            textAlign: 'center',
                            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)'
                        }}
                    >
                        Meeting History
                    </Typography>

                    {meetings.length !== 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'clamp(12px, 3vw, 18px)',
                            width: '100%'
                        }}>
                            {meetings.map((meeting, index) => (
                                <Card
                                    key={index}
                                    variant="outlined"
                                    style={{
                                        ...cardStyle,
                                        padding: 'clamp(16px, 4vw, 20px)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(102,126,234,0.2)'
                                        }
                                    }}
                                    onClick={() => {
                                        // Optional: Add functionality to rejoin meeting
                                        console.log('Rejoin meeting:', meeting.meetingCode);
                                    }}
                                >
                                    <CardContent style={{ padding: 0 }}>
                                        <Typography
                                            sx={{
                                                fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                                                fontWeight: 600,
                                                color: '#667eea',
                                                mb: 1
                                            }}
                                            gutterBottom
                                        >
                                            Code: {meeting.meetingCode}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                                color: '#555',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            📅 {formatDate(meeting.date)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions style={{
                                        padding: 0,
                                        paddingTop: 'clamp(8px, 2vw, 12px)',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <Button
                                            size="small"
                                            style={{
                                                borderRadius: '20px',
                                                fontWeight: 600,
                                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                                color: '#fff',
                                                padding: '6px 16px',
                                                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                                                textTransform: 'none'
                                            }}
                                        >
                                            Rejoin
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: 'clamp(40px, 10vw, 60px) 0',
                            color: '#888'
                        }}>
                            <Typography
                                sx={{
                                    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                                    mb: 2
                                }}
                            >
                                No Meetings Yet
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                    color: '#aaa'
                                }}
                            >
                                Start your first meeting to see it here!
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}





