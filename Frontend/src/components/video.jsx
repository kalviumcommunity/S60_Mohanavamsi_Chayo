import React, { useEffect, useRef, useState } from 'react';
import { getCookie } from "./nav";
import Peer from 'peerjs';

import { useParams, useNavigate } from 'react-router';

function Video() {
    const [stream, setStream] = useState();
    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const peerInstance = useRef(null);
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const [audio, setAudio] = useState(true);
    const [video, setVideo] = useState(true);
    const nav = useNavigate();
    const name=getCookie("username")
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
            .then((stream) => {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.muted = true;
                setStream(stream);
                const peer = new Peer(name);
                peer.on('open', (id) => {
                    console.log(id);
                    setPeerId(id);
                });
                peer.on('call', (call) => {
                    call.answer(stream);
                    call.on('stream', (remote) => {
                        remoteVideoRef.current.srcObject = remote;
                    });
                });
                peerInstance.current = peer;
            })
            .catch((error) => {
                console.error('Failed to get local stream', error);
            });
    }, []);

    function call(remotePeerId) {
        const call = peerInstance.current.call(remotePeerId, stream);
        call.answer(stream);
        call.on("stream", (remote) => {
            remoteVideoRef.current.srcObject = remote;
        });
    }

    function toggleAudio() {
        setAudio(!audio);
        if (stream) {
            stream.getAudioTracks()[0].enabled = !audio;
        }
    }

    function toggleVideo() {
        setVideo(!video);
        if (stream) {
            stream.getVideoTracks()[0].enabled = !video;
        }
    }

    function endCall() {
        if (peerInstance.current) {
            peerInstance.current.destroy();
        }
        nav('/');
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard');
            })
            .catch((error) => {
                console.error('Unable to copy text: ', error);
            });
    }
    
    return (
        <div className="h-screen bg-gray-950 p-2 flex flex-col justify-center items-center">
            <div className="flex mb-2 items-center">
                <input
                    onChange={(e) => { setRemotePeerIdValue(e.target.value) }}
                    value={remotePeerIdValue}
                    placeholder="Enter Username of your friend"
                    className="text-black p-1 mr-2"
                />
                <button onClick={() => { call(remotePeerIdValue) }} className='text-white bg-blue-600 px-4 py-1 rounded hover:bg-blue-700'>Call</button>
            </div>
            <div className="flex mb-2 items-center">
                <input
                    value={peerId}
                    readOnly
                    className="text-black p-1 mr-2"
                />
                <button onClick={() => copyToClipboard(peerId)} className='text-white bg-blue-600 px-4 py-1 rounded hover:bg-blue-700'>Copy ID</button>
            </div>
            <div className="flex flex-wrap w-full justify-center">
                <div className="w-96 relative">
                    <video playsInline autoPlay ref={localVideoRef} className="rounded-lg w-full" />
                    <h1 className="text-white absolute bottom-1 left-2 font-semibold">{getCookie("username")}</h1>
                </div>
                <div className="w-96 m-3 relative">
                    <video playsInline autoPlay ref={remoteVideoRef} className="rounded-lg w-full" />
                    <h1 className="text-white absolute bottom-1 left-2 font-semibold">{remotePeerIdValue}</h1>
                </div>
            </div>
            <div className="flex mt-4">
                <button className={`text-white mr-2 px-4 py-2 rounded ${audio ? 'bg-gray-500' : 'bg-red-400'} `} onClick={toggleAudio}>
                    {audio ? "Mute" : "Unmute"}
                </button>
                <button className={`text-white mr-2 px-4 py-2 rounded ${video ? 'bg-gray-500' : 'bg-red-400'} `} onClick={toggleVideo}>
                    {video ? "Stop Video" : "Start Video"}
                </button>
                <button className="text-white px-4 py-2 rounded bg-red-500 hover:bg-red-600" onClick={endCall}>
                    End Call
                </button>
            </div>

        </div>
    );
}

export default Video;
