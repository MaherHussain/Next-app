import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:4000'; 

export function useSocket() {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {

        // Connect to the Socket.IO server
        socketRef.current = io(SOCKET_SERVER_URL);

        socketRef.current.on('connect', () => {
            console.log('useSocket: Connected to socket server with ID:', socketRef.current?.id);
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('useSocket: Connection error:', error);
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log('useSocket: Disconnected:', reason);
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return socketRef.current;
} 