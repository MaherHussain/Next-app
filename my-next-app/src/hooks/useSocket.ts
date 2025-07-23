import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:4000'; // Update if your server runs elsewhere

export function useSocket() {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Connect to the Socket.IO server
        socketRef.current = io(SOCKET_SERVER_URL);

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return socketRef.current;
} 