import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
        });
        // Store token for API calls
        localStorage.setItem('sb-access-token', session.access_token);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
        });
        localStorage.setItem('sb-access-token', session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('sb-access-token');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }

    if (data.user && data.session) {
      setUser({
        id: data.user.id,
        email: data.user.email!,
      });
      // Store token for API calls
      localStorage.setItem('sb-access-token', data.session.access_token);
    }
  };

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    if (data.user) {
      // Check if email confirmation is required
      if (!data.session && data.user && !data.user.email_confirmed_at) {
        throw new Error(
          'Please check your email and click the confirmation link before logging in.'
        );
      }

      if (data.session) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
        });
        // Store token for API calls
        localStorage.setItem('sb-access-token', data.session.access_token);
      }
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    localStorage.removeItem('sb-access-token');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
