import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

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