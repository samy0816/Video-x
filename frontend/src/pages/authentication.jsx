
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

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

const glassCardStyle = {
    background: 'rgba(255, 255, 255, 0.63)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
    padding: '48px 36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '340px',
    maxWidth: '400px',
    margin: 'auto',
};

const switchButtonStyle = (active) => ({
    borderRadius: '20px',
    margin: '0 8px',
    fontWeight: 600,
    background: active ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' : 'transparent',
    color: active ? '#fff' : '#667eea',
    boxShadow: active ? '0 2px 8px rgba(102,126,234,0.15)' : 'none',
    border: active ? 'none' : '1px solid #e0e0e0',
    transition: 'all 0.2s',
});

const submitButtonStyle = {
    borderRadius: '20px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
    marginTop: '24px',
    marginBottom: '8px',
    boxShadow: '0 4px 16px rgba(102,126,234,0.12)',
    padding: '12px 0',
    textTransform: 'none',
};

const errorTextStyle = {
    color: '#e57373',
    fontWeight: 500,
    margin: '8px 0 0 0',
    minHeight: '24px',
    textAlign: 'center',
};



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Authentication() {

    

    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [name, setName] = React.useState();
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();


    const [formState, setFormState] = React.useState(0);

    const [open, setOpen] = React.useState(false)


    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password)


            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {

            console.log(err);
            let message = (err.response.data.message);
            setError(message);
        }
    }


    return (
        <ThemeProvider theme={defaultTheme}>
            {/* Video background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={videoBackgroundStyle}
                src="/video.mp4"
            />
            {/* Dark gradient overlay */}
            <div style={gradientOverlayStyle} />
            <CssBaseline />
            <Grid container component="main" sx={{ height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <Grid item xs={12} sm={8} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                    <Paper elevation={8} style={glassCardStyle}>
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 64, height: 64, boxShadow: '0 2px 8px rgba(102,126,234,0.18)' }}>
                            <LockOutlinedIcon fontSize="large" />
                        </Avatar>
                        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#333', letterSpacing: 1 }}>
                            {formState === 0 ? 'Welcome Back!' : 'Create Account'}
                        </Typography>
                        <Box sx={{ display: 'flex', mb: 3 }}>
                            <Button
                                variant={formState === 0 ? 'contained' : 'outlined'}
                                onClick={() => setFormState(0)}
                                style={switchButtonStyle(formState === 0)}
                                disableElevation
                            >
                                Sign In
                            </Button>
                            <Button
                                variant={formState === 1 ? 'contained' : 'outlined'}
                                onClick={() => setFormState(1)}
                                style={switchButtonStyle(formState === 1)}
                                disableElevation
                            >
                                Sign Up
                            </Button>
                        </Box>
                        <Box component="form" noValidate sx={{ width: '100%' }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="fullname"
                                    label="Full Name"
                                    name="fullname"
                                    value={name}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                    sx={{ borderRadius: '12px' }}
                                />
                            )}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ borderRadius: '12px' }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                sx={{ borderRadius: '12px' }}
                            />
                            <div style={errorTextStyle}>{error}</div>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                style={submitButtonStyle}
                                onClick={handleAuth}
                                disableElevation
                            >
                                {formState === 0 ? 'Login' : 'Register'}
                            </Button>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#888', mt: 2, fontSize: '0.95rem' }}>
                            {formState === 0 ? "Don't have an account? " : 'Already have an account? '}
                            <span
                                style={{ color: '#667eea', cursor: 'pointer', fontWeight: 600 }}
                                onClick={() => setFormState(formState === 0 ? 1 : 0)}
                            >
                                {formState === 0 ? 'Sign Up' : 'Sign In'}
                            </span>
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
            />
        </ThemeProvider>
    );
}