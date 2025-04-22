
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string, role?: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles:role_id (
            name
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      setUserRole(data?.roles?.name || null);
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    }
  };

  // Modified signIn to handle demo accounts directly
  const signIn = async (email: string, password: string, role?: string) => {
    try {
      console.log('Attempting to sign in with:', { email, role });
      
      // For demo purposes, we'll handle mock credentials directly
      if (role && email && password) {
        // Check if using demo credentials
        const isDemoAccount = (
          (email === 'admin@facultech.com' && password === 'admin123' && role.toLowerCase() === 'admin') ||
          (email === 'faculty@facultech.com' && password === 'faculty123' && role.toLowerCase() === 'faculty') ||
          (email === 'hod@facultech.com' && password === 'hod123' && role.toLowerCase() === 'hod')
        );
        
        if (isDemoAccount) {
          // If using demo credentials, sign in without role verification
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          // Manually set the role for demo accounts
          setUserRole(role.toLowerCase());
          
          navigate('/dashboard');
          toast({
            title: "Success",
            description: "You have successfully signed in with demo account.",
          });
          return;
        }
      }
      
      // For non-demo accounts, proceed with normal authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Authentication failed. No user returned.');
      }
      
      // If a role was specified, verify the user has that role
      if (role) {
        try {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select(`
              role_id,
              roles:role_id (
                name
              )
            `)
            .eq('user_id', authData.user.id)
            .single();
            
          if (roleError) {
            await supabase.auth.signOut();
            throw new Error('Unable to verify user role. Please contact support.');
          }
          
          const userRole = roleData?.roles?.name?.toLowerCase();
          if (!userRole || userRole !== role.toLowerCase()) {
            await supabase.auth.signOut();
            throw new Error(`You do not have ${role} access. Please select the correct role or contact your administrator.`);
          }
          
          setUserRole(userRole);
        } catch (error: any) {
          // If there was an error verifying the role, sign out and throw
          await supabase.auth.signOut();
          throw error;
        }
      }
      
      navigate('/dashboard');
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Re-throw to be handled by the login form
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        loading,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
