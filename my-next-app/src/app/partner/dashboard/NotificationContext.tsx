import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useUser } from '@/app/utils/providers/UserContext';

// Define the order type (simplified for context)
interface NotificationOrder {
  _id: string;
  orderNumber: string;
  items: any[];
  contactData: any;
  selectedTime: string;
  paymentMethod: string;
  total: number;
  orderMethod: string;
  status: string;
  createdAt?: string;
  // Add more fields as needed
}

interface NotificationContextType {
  notifications: NotificationOrder[];
  addNotification: (order: NotificationOrder) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  stopNotificationSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationOrder[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const socket = useSocket();
  const { user } = useUser();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play and loop the notification sound
  const startNotificationSound = () => {
    if (!soundEnabled) return;
    if (!audioRef.current) {
      audioRef.current = new window.Audio('/sounds/notification.mp3');
      audioRef.current.loop = true;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  // Stop the notification sound
  const stopNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const addNotification = (order: NotificationOrder) => {
    setNotifications((prev) => [order, ...prev]);
    startNotificationSound();
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
    if (soundEnabled && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Stop sound when all notifications are accepted/rejected
  useEffect(() => {
    if (notifications.length === 0) {
      stopNotificationSound();
    }
  }, [notifications.length]);

  useEffect(() => {
    if (!socket) return;
    if (user?.restaurantId) {
      socket.emit('join-room', user.restaurantId);
    }
    socket.on('new-order', (data: { order: NotificationOrder }) => {
      if (data && data.order) {
        addNotification(data.order);
      }
    });
    return () => {
      socket.off('new-order');
    };
  }, [socket, user?.restaurantId]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, soundEnabled, toggleSound, stopNotificationSound }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Export stopNotificationSound for use in NotificationList
export const useNotificationSoundControl = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  return {
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };
}; 