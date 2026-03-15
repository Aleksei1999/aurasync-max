'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMax } from './MaxProvider';

interface UserProfile {
  id: string;
  max_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  credits: number;
  subscription_type?: string;
  subscription_until: string | null;
  is_admin: boolean;
  created_at: string;
  onboarding_completed?: boolean;
  // AuraSync specific
  preferred_time_morning?: string;
  preferred_time_evening?: string;
  goals?: string[];
  current_mood?: string;
}

interface AuthContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  hasActiveSubscription: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, initData, startParam, isReady } = useMax();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authenticate = async () => {
    if (!initData || !user) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/max', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData, startParam }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        console.error('Auth failed:', await response.text());
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!initData) return;

    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'X-Max-Init-Data': initData,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  useEffect(() => {
    if (isReady) {
      authenticate();
    }
  }, [isReady, initData, user]);

  const hasActiveSubscription = profile
    ? !!(profile.subscription_until &&
      new Date(profile.subscription_until) > new Date() &&
      profile.subscription_type !== 'free_trial')
    : false;

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoading,
        isAuthenticated: !!profile,
        hasActiveSubscription,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
