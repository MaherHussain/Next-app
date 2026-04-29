import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Connect to the Socket.IO server
        const socketInstance = io(SOCKET_SERVER_URL);

        socketInstance.on('connect', () => {
            setSocket(socketInstance);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('[useSocket] Connection error:', error);
        });

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);


    return socket;
}