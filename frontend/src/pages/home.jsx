import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");


    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    return (
        <>

            <div className="navBar">

                <div style={{ display: "flex", alignItems: "center" }}>

                    <h2>Video X</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={
                        () => {
                            navigate("/history")
                        }
                    }>
                        <RestoreIcon />
                    </IconButton>
                    <p style={{borderRadius: '50px',
                        padding: '12px 24px',
    margin: '6px 8px',
    fontWeight: 600,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
    border: 'none',
    transition: 'all 0.2s',}}>History</p>

                    <Button onClick={() => {
                        localStorage.removeItem("token")
                        navigate("/auth")
                    }} style={{borderRadius: '50px',
                        padding: '12px 24px',
    margin: '6px 8px',
    fontWeight: 600,
    background: 'black',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
    border: 'none',
    transition: 'all 0.2s',}}>
                        Logout
                    </Button>
                </div>


            </div>


            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>
<br />
                        <div style={{ display: 'flex', gap: "10px" }}>

                            <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" />
                            <Button onClick={handleJoinVideoCall} variant='contained' style={{borderRadius: '50px',
                        padding: '12px 24px',
    margin: '0 8px',
    fontWeight: 600,
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
    border: 'none',
    transition: 'all 0.2s',}}>Join</Button>

                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/video3.gif' alt="" />
                </div>
            </div>
        </>
    )
}


export default withAuth(HomeComponent)