"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useGetUser, useInvalidateUser } from "@/app/queries/auth";

/**
 * User Context with React Query Integration
 * 
 * This context provides user data throughout the application using React Query for:
 * - Automatic caching and background refetching
 * - Loading and error states
 * - Optimistic updates
 * - Consistent data fetching patterns
 * 
 * Benefits over manual fetching:
 * - Better performance with intelligent caching
 * - Automatic error handling and retries
 * - Loading states for better UX
 * - Consistent with other data fetching in the app
 * - Automatic cache invalidation on login/logout
 */

// Define the shape of your user object based on the Partner model
export type User = {
  _id: string;
  partnerName: string;
  email: string;
  phone?: string;
  restaurantId: {
    _id: string;
    name: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
  // Add more fields as needed
} | null;

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  isError: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError } = useGetUser();
  const invalidateUser = useInvalidateUser();

  const setUser = (newUser: User) => {
    // This will trigger a refetch of the user data
    invalidateUser();
  };

  const logout = () => {
    // Clear the user data by invalidating the cache
    invalidateUser();
  };

  return (
    <UserContext.Provider value={{ 
      user: user || null, 
      setUser, 
      logout, 
      isLoading, 
      isError 
    }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook to access user context
 * 
 * Usage:
 * ```tsx
 * const { user, isLoading, isError, logout } = useUser();
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (isError) return <ErrorMessage />;
 * if (!user) return <LoginPrompt />;
 * 
 * return <div>Welcome, {user.partnerName}!</div>;
 * ```
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}; 