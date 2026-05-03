import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define roles
export type UserRole = 'admin' | 'member';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// Circle membership with role
export interface CircleMembership {
  circleId: string;
  circleName: string;
  role: UserRole;
  turnPosition: number;
  joinedAt: Date;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  memberships: CircleMembership[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  getRoleForCircle: (circleId: string) => UserRole | null;
  isAdminOfCircle: (circleId: string) => boolean;
  isMemberOfCircle: (circleId: string) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockUser: User = {
  id: 'user-1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '+1 (555) 123-4567',
};

// Mock memberships
const mockMemberships: CircleMembership[] = [
  {
    circleId: 'circle-1',
    circleName: 'Gold Savings Circle',
    role: 'admin',
    turnPosition: 3,
    joinedAt: new Date('2024-01-15'),
  },
  {
    circleId: 'circle-2',
    circleName: 'Family Fund',
    role: 'member',
    turnPosition: 5,
    joinedAt: new Date('2024-02-20'),
  },
  {
    circleId: 'circle-3',
    circleName: 'Emergency Pool',
    role: 'member',
    turnPosition: 7,
    joinedAt: new Date('2024-03-10'),
  },
];

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // Start without a user - require login
  const [isLoading, setIsLoading] = useState(false);
  const [memberships, setMemberships] = useState<CircleMembership[]>([]);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // For demo: accept any valid-looking credentials
      // In production, this would call your backend auth API
      setUser({
        id: 'user-' + Date.now(),
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        phone: '',
      });
      // Assign demo memberships after login
      setMemberships(mockMemberships);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setMemberships([]);
  };

  const signup = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUser({
      id: 'new-user-' + Date.now(),
      name,
      email,
      phone,
    });
    setMemberships([]);
    setIsLoading(false);
    return true;
  };

  const getRoleForCircle = (circleId: string): UserRole | null => {
    const membership = memberships.find(m => m.circleId === circleId);
    return membership?.role || null;
  };

  const isAdminOfCircle = (circleId: string): boolean => {
    return getRoleForCircle(circleId) === 'admin';
  };

  const isMemberOfCircle = (circleId: string): boolean => {
    return memberships.some(m => m.circleId === circleId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        memberships,
        login,
        logout,
        signup,
        getRoleForCircle,
        isAdminOfCircle,
        isMemberOfCircle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Permission check utilities
export const Permissions = {
  // Admin-only permissions
  canCreateCircle: (role: UserRole | null) => role === 'admin' || role === null, // null means not in circle yet
  canInviteMembers: (role: UserRole | null) => role === 'admin',
  canSetContributionRules: (role: UserRole | null) => role === 'admin',
  canRemoveMembers: (role: UserRole | null) => role === 'admin',
  canEditCircleSettings: (role: UserRole | null) => role === 'admin',
  
  // Both admin and member permissions
  canViewCircleDetails: (role: UserRole | null) => role === 'admin' || role === 'member',
  canMakePayments: (role: UserRole | null) => role === 'admin' || role === 'member',
  canViewPaymentHistory: (role: UserRole | null) => role === 'admin' || role === 'member',
  canLeaveCircle: (role: UserRole | null) => role === 'member', // Admin cannot leave without transferring
};
