import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
export default function LandingPage() {
    // Video background with dark gradient overlay
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


    const router = useNavigate();

    return (
        <div className='landingPageContainer' style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
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
            <nav style={{
                padding: '1.2rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                zIndex: 10
            }}>
                <div className='navHeader' style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: 1
                }}>
                    <h2>Video X</h2>
                </div>
                <div className='navlist' style={{
                    display: 'flex',
                    gap: 'clamp(0.5rem, 2vw, 1.6rem)',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => router("/aljk23")}
                        style={{
                            borderRadius: '50px',
                            padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                            margin: '0 4px',
                            fontWeight: 600,
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    >
                        Join as Guest
                    </button>
                    <button
                        onClick={() => router("/auth")}
                        style={{
                            borderRadius: '50px',
                            padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                            margin: '0 4px',
                            fontWeight: 600,
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    >
                        Register
                    </button>
                    <button
                        onClick={() => router("/auth")}
                        style={{
                            borderRadius: '50px',
                            padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                            margin: '0 4px',
                            fontWeight: 600,
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    >
                        Login
                    </button>
                </div>
            </nav>
            <div className="landingMainContainer" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                minHeight: 'calc(100vh - 120px)',
                textAlign: 'center',
                gap: '2rem'
            }}>
                <div style={{
                    maxWidth: '800px',
                    zIndex: 5
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 8vw, 4rem)',
                        fontWeight: 800,
                        marginBottom: '1rem',
                        lineHeight: 1.2,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Connect with your loved Ones
                    </h1>
                    <p style={{
                        fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '2rem',
                        fontWeight: 300
                    }}>
                        Cover a distance by Video X
                    </p>
                    <button
                        onClick={() => router("/auth")}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50px',
                            padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)',
                            fontWeight: 600,
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            boxShadow: '0 4px 20px rgba(102,126,234,0.3)',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                            textDecoration: 'none',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 25px rgba(102,126,234,0.4)'
                            }
                        }}
                    >
                        Get Started
                    </button>
                </div>
                <div style={{
                    zIndex: 5,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <img
                        src="/background.gif"
                        alt="Video call illustration"
                        style={{
                            height: 'clamp(200px, 40vh, 400px)',
                            width: 'auto',
                            borderRadius: '20px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
