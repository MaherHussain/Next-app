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
  dismissNotification: (orderId: string) => void;
  clearAllNotifications: () => void;
  testSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

import { useQueryClient } from '@tanstack/react-query';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationOrder[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const socket = useSocket();
  const { user } = useUser();
  const queryClient = useQueryClient();
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

  const dismissNotification = (orderId: string) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n._id !== orderId);
      if (next.length === 0) {
        stopNotificationSound();
      }
      return next;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (!newState && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Stop sound when all notifications are dismissed
  useEffect(() => {
    if (notifications.length === 0) {
      stopNotificationSound();
    }
  }, [notifications.length]);

  useEffect(() => {
    if (!socket) return;
    if (user?.restaurantId) {
      const restaurantId = typeof user.restaurantId === 'string'
        ? user.restaurantId
        : user.restaurantId._id;

      socket.emit('join-room', restaurantId);

      socket.on('new-order', (data: { order: NotificationOrder }) => {
        if (data && data.order) {
          addNotification(data.order);
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      });
      socket.on('order-status-updated', (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        // Auto-dismiss notification if active to stop sound
        if (data.orderId) {
          dismissNotification(data.orderId);
        }
      });
    }

    return () => {
      socket.off('new-order');
      socket.off('order-status-updated');
    };
  }, [socket, user?.restaurantId]);

  const testSound = () => {
    // Play sound temporarily (won't loop)
    const testAudio = new window.Audio('/sounds/notification.mp3');
    testAudio.play().catch((err) => {
      console.warn("Audio play blocked. User interaction required:", err);
      alert("Audio play was blocked by your browser. Please click anywhere on the page and try again.");
    });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      soundEnabled,
      toggleSound,
      stopNotificationSound,
      dismissNotification,
      clearAllNotifications,
      testSound
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
