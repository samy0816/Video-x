import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
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

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // --- Smart Assistant State ---
    const [transcript, setTranscript] = useState("");
    const [aiQuestion, setAiQuestion] = useState("");
    const [aiAnswer, setAiAnswer] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [showAISidebar, setShowAISidebar] = useState(false);

    // --- Transcript: (Demo) Append chat messages to transcript ---
    useEffect(() => {
        if (messages.length > 0) {
            setTranscript(prev => prev + " " + messages[messages.length - 1].data);
        }
    }, [messages]);

    // --- Smart Assistant Handler ---
    async function handleAskAI() {
        setAiLoading(true);
        setAiAnswer("");
        try {
            const res = await fetch("http://localhost:8000/api/ai/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript, question: aiQuestion })
            });
            const data = await res.json();
            setAiAnswer(
                (data.summary ? `Summary: ${data.summary}\n\n` : "") +
                (data.recommendations && data.recommendations.length
                    ? "Possible Questions:\n" + data.recommendations.map((r, i) => `• ${r}`).join("\n")
                    : "")
            );
        } catch (err) {
            setAiAnswer("Error: " + err.message);
        }
        setAiLoading(false);
    }

    // TODO
    // if(isChrome() === false) {


    // }

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    })

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);

        }


    }, [video, audio])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        const newVideoState = !video;
        setVideo(newVideoState);
        // Enable/disable video tracks
        if (localVideoref.current && localVideoref.current.srcObject) {
            const videoTracks = localVideoref.current.srcObject.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = newVideoState;
            });
        }
    }
    let handleAudio = () => {
        const newAudioState = !audio;
        setAudio(newAudioState);
        // Enable/disable audio tracks
        if (localVideoref.current && localVideoref.current.srcObject) {
            const audioTracks = localVideoref.current.srcObject.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = newAudioState;
            });
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }

    
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


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
            {/* Smart Assistant Sidebar */}
            <div style={{
                position: 'fixed',
                right: showAISidebar ? 0 : -380,
                top: 0,
                height: '100vh',
                width: 380,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '-4px 0 20px rgba(102,126,234,0.25)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: showAISidebar ? '0' : '20px 0 0 20px'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: 20 }}>Smart Assistant</h3>
                        <Button variant="text" onClick={() => setShowAISidebar(false)} sx={{ color: '#fff', minWidth: 40 }}>
                            ✕
                        </Button>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0', fontSize: 14 }}>Ask questions about the meeting</p>
                </div>

                {/* Chat Area */}
                <div style={{
                    flex: 1,
                    padding: '20px 24px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                }}>
                    {/* Answer Display */}
                    {aiAnswer && (
                        <div style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: 16,
                            padding: 16,
                            boxShadow: '0 4px 12px rgba(102,126,234,0.15)',
                            color: '#333',
                            fontSize: 15,
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            alignSelf: 'flex-start',
                            maxWidth: '90%'
                        }}>
                            {aiAnswer}
                        </div>
                    )}

                    {/* Loading Indicator */}
                    {aiLoading && (
                        <div style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: 16,
                            padding: 16,
                            boxShadow: '0 4px 12px rgba(102,126,234,0.15)',
                            color: '#333',
                            fontSize: 15,
                            alignSelf: 'flex-start',
                            maxWidth: '90%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <div style={{
                                width: 8,
                                height: 8,
                                background: '#667eea',
                                borderRadius: '50%',
                                animation: 'pulse 1.5s infinite'
                            }}></div>
                            Thinking...
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div style={{
                    padding: '20px 24px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                }}>
                    <TextField
                        label=""
                        value={aiQuestion}
                        onChange={e => setAiQuestion(e.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: 12,
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                '&.Mui-focused fieldset': { borderColor: '#fff' }
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                            '& .MuiInputBase-input': { color: '#333' }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAskAI}
                        disabled={aiLoading || !aiQuestion}
                        sx={{
                            borderRadius: 12,
                            fontWeight: 600,
                            background: 'rgba(255,255,255,0.9)',
                            color: '#667eea',
                            '&:hover': { background: '#fff' },
                            '&:disabled': { background: 'rgba(255,255,255,0.5)', color: 'rgba(102,126,234,0.5)' }
                        }}
                    >
                        {aiLoading ? 'Thinking...' : 'Ask'}
                    </Button>
                </div>

                {/* Pulse Animation */}
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}</style>
            </div>
            {/* Smart Assistant Toggle Button */}
            {!showAISidebar && (
                <IconButton
                    onClick={() => setShowAISidebar(v => !v)}
                    style={{
                        position: 'fixed',
                        top: 20,
                        right: 20,
                        color: '#fff',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 20,
                        padding: 12,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease',
                        zIndex: 5,
                        animation: 'gentlePulse 2s infinite',
                        '&:hover': { transform: 'scale(1.05)' }
                    }}
                    title="Show AI Assistant"
                >
                    <SmartToyIcon />
                </IconButton>
            )}

            {/* Add pulse animation style */}
            <style>{`
                @keyframes gentlePulse {
                    0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
                    50% { box-shadow: 0 4px 25px rgba(102,126,234,0.4); }
                }
            `}</style>

            {askForUsername === true ?
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', zIndex: 1 }}>
                    <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 24, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', padding: 40, minWidth: 320, maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 style={{ fontWeight: 700, color: '#333', marginBottom: 24 }}>Enter into Lobby</h2>
                        <TextField id="outlined-basic" label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" sx={{ mb: 2, width: '100%' }} />
                        <Button variant="contained" onClick={connect} sx={{ borderRadius: 2, fontWeight: 600, fontSize: '1.1rem', width: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>Connect</Button>
                        <div style={{ marginTop: 32, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(102,126,234,0.12)' }}>
                            <video ref={localVideoref} autoPlay muted style={{ width: 240, height: 160, borderRadius: 12, background: '#222' }}></video>
                        </div>
                    </div>
                </div>
                :
                <div className={styles.meetVideoContainer} style={{ position: 'relative', zIndex: 1 }}>
                    {showModal ? (
                        <div style={{
                            position: 'fixed',
                            bottom: 100,
                            left: 20,
                            width: 350,
                            height: 450,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 20,
                            boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            zIndex: 5
                        }}>
                            {/* Chat Header */}
                            <div style={{
                                padding: '16px 20px',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h3 style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: 18 }}>Meeting Chat</h3>
                                <Button variant="text" onClick={() => setModal(false)} sx={{ color: '#fff', minWidth: 40, padding: 0 }}>
                                    ✕
                                </Button>
                            </div>

                            {/* Messages Area */}
                            <div style={{
                                flex: 1,
                                padding: '16px 20px',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12
                            }}>
                                {messages.length !== 0 ? messages.map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: item.sender === username ? 'flex-end' : 'flex-start',
                                        marginBottom: 8
                                    }}>
                                        <div style={{
                                            background: item.sender === username ? '#667eea' : 'rgba(255,255,255,0.9)',
                                            color: item.sender === username ? '#fff' : '#333',
                                            padding: '10px 14px',
                                            borderRadius: 18,
                                            maxWidth: '80%',
                                            wordWrap: 'break-word',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            fontSize: 14,
                                            lineHeight: 1.4
                                        }}>
                                            <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4, opacity: 0.8 }}>
                                                {item.sender}
                                            </div>
                                            {item.data}
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: 16
                                    }}>
                                        No messages yet. Start the conversation!
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div style={{
                                padding: '16px 20px',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                borderTop: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                gap: 12,
                                alignItems: 'center'
                            }}>
                                <TextField
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: 'rgba(255,255,255,0.95)',
                                            borderRadius: 25,
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                            '&.Mui-focused fieldset': { borderColor: '#fff' }
                                        },
                                        '& .MuiInputBase-input': {
                                            color: '#333',
                                            padding: '12px 16px'
                                        }
                                    }}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <Button
                                    variant='contained'
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                    sx={{
                                        borderRadius: 25,
                                        minWidth: 50,
                                        height: 50,
                                        background: 'rgba(255,255,255,0.9)',
                                        color: '#667eea',
                                        '&:hover': { background: '#fff' },
                                        '&:disabled': { background: 'rgba(255,255,255,0.3)', color: 'rgba(102,126,234,0.3)' }
                                    }}
                                >
                                    ➤
                                </Button>
                            </div>
                        </div>
                    ) : null}
                    <div style={{
                        position: 'fixed',
                        bottom: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 30,
                        padding: '12px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        zIndex: 4
                    }}>
                        <IconButton onClick={handleVideo} style={{
                            color: video ? '#fff' : '#ff6b6b',
                            background: video ? 'rgba(102,126,234,0.8)' : 'rgba(255,107,107,0.2)',
                            borderRadius: 20,
                            padding: 12,
                            transition: 'all 0.2s ease',
                            '&:hover': { transform: 'scale(1.1)' }
                        }}>
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>

                        <IconButton onClick={handleAudio} style={{
                            color: audio ? '#fff' : '#ff6b6b',
                            background: audio ? 'rgba(102,126,234,0.8)' : 'rgba(255,107,107,0.2)',
                            borderRadius: 20,
                            padding: 12,
                            transition: 'all 0.2s ease'
                        }}>
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable && (
                            <IconButton onClick={handleScreen} style={{
                                color: screen ? '#fff' : '#888',
                                background: screen ? 'rgba(102,126,234,0.8)' : 'rgba(136,136,136,0.2)',
                                borderRadius: 20,
                                padding: 12,
                                transition: 'all 0.2s ease'
                            }}>
                                {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton>
                        )}

                        <div style={{ width: 2, height: 30, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }}></div>

                        <Badge badgeContent={newMessages} max={999} color='error'>
                            <IconButton onClick={() => setModal(!showModal)} style={{
                                color: '#fff',
                                background: 'rgba(102,126,234,0.8)',
                                borderRadius: 20,
                                padding: 12,
                                transition: 'all 0.2s ease'
                            }}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>

                        <IconButton onClick={handleEndCall} style={{
                            color: '#fff',
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                            borderRadius: 20,
                            padding: 12,
                            transition: 'all 0.2s ease',
                            '&:hover': { transform: 'scale(1.1)' }
                        }}>
                            <CallEndIcon />
                        </IconButton>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                        <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted style={{
                            width: 360,
                            height: 240,
                            borderRadius: 20,
                            background: '#222',
                            boxShadow: '0 8px 32px rgba(102,126,234,0.3)',
                            border: '2px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'scale(1.02)' }
                        }}></video>
                        <div className={styles.conferenceView} style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 20,
                            justifyContent: 'center',
                            marginTop: 12
                        }}>
                            {videos.map((video) => (
                                <div key={video.socketId} style={{
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 32px rgba(102,126,234,0.2)',
                                    background: '#fff',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'scale(1.02)' }
                                }}>
                                    <video
                                        data-socket={video.socketId}
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream;
                                            }
                                        }}
                                        autoPlay
                                        style={{
                                            width: 240,
                                            height: 160,
                                            borderRadius: 18,
                                            background: '#222'
                                        }}
                                    >
                                    </video>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
