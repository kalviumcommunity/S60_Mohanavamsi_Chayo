import React, { useEffect, useRef, useState } from 'react';
import { getCookie } from "./nav";
import Peer from 'peerjs';
import { useParams } from 'react-router';

function Video() {
    const [stream, setStream] = useState();
    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const peerInstance = useRef(null);
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const [audio, setAudio] = useState(true);
    const [video, setVideo] = useState(true);
    const {roomid}=useParams()
    useEffect(() => {
        let localStream;
        navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
            .then((stream) => {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.muted = true;
                setStream(stream);
                localStream = stream;
                const peer = new Peer();
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

    return (
        <div className="h-screen bg-gray-950 p-2 flex flex-col justify-center items-center">
            <input
                onChange={(e) => { setRemotePeerIdValue(e.target.value) }}
                value={remotePeerIdValue}
                placeholder="Enter Remote Peer ID"
                className="text-white p-1 mb-2"
            />
            <button onClick={() => { call(remotePeerIdValue) }} className='text-white mb-2'>Call</button>
            <div className="flex flex-wrap w-full">
                <div className="w-96 relative">
                    <video playsInline autoPlay ref={localVideoRef} className="rounded-lg w-full" />
                    <h1 className="text-white absolute bottom-1 left-2 font-semibold">{getCookie("username")}</h1>
                </div>
                <div className="w-96 relative">
                    <video playsInline autoPlay ref={remoteVideoRef} className="rounded-lg w-full" />
                    <h1 className="text-white absolute bottom-1 left-2 font-semibold">{getCookie("username")}</h1>
                </div>
            </div>
            <div className="flex mt-4">
                <button className={`text-white mr-2 px-4 py-2 rounded ${audio ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-600`} onClick={toggleAudio}>
                    {audio ? "Mute Audio" : "Unmute Audio"}
                </button>
                <button className={`text-white mr-2 px-4 py-2 rounded ${video ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-600`} onClick={toggleVideo}>
                    {video ? "Stop Video" : "Start Video"}
                </button>
             
            </div>
        </div>
    );
}

export default Video;
