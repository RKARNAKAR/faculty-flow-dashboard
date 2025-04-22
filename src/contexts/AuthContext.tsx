
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

// Mock user credentials for development
const MOCK_USERS = {
  'admin@facultech.com': {
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  },
  'faculty@facultech.com': {
    password: 'faculty123',
    role: 'faculty',
    firstName: 'Faculty',
    lastName: 'User'
  },
  'hod@facultech.com': {
    password: 'hod123',
    role: 'hod',
    firstName: 'HOD',
    lastName: 'User'
  }
};

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
          // For mock users, we get the role from metadata
          const mockRole = session?.user?.user_metadata?.role;
          if (mockRole) {
            setUserRole(mockRole);
          } else {
            // For real users, fetch from database
            fetchUserRole(session.user.id);
          }
        } else {
          setUserRole(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // For mock users, we get the role from metadata
        const mockRole = session?.user?.user_metadata?.role;
        if (mockRole) {
          setUserRole(mockRole);
        } else {
          // For real users, fetch from database
          fetchUserRole(session.user.id);
        }
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

  const signIn = async (email: string, password: string, role?: string) => {
    try {
      console.log('Attempting to sign in with:', { email, role });
      
      // Check if this is a mock user
      if (email in MOCK_USERS) {
        const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS];
        
        // Verify password and role
        if (mockUser.password !== password) {
          throw new Error('Invalid password for mock account');
        }
        
        if (role && role.toLowerCase() !== mockUser.role) {
          throw new Error(`Selected role "${role}" doesn't match the mock user's role "${mockUser.role}"`);
        }

        // For mock users, we'll sign in with a special way to identify them
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // For development mode, if the mock user doesn't exist in Supabase,
          // we'll create a fake session manually
          console.log("Using mock credentials without Supabase account");
          
          // Fake user and session objects
          const mockUserObj = {
            id: `mock_${Date.now()}`,
            email: email,
            user_metadata: {
              first_name: mockUser.firstName,
              last_name: mockUser.lastName,
              role: mockUser.role
            }
          } as unknown as User;
          
          // Set the mock session state
          setUser(mockUserObj);
          setUserRole(mockUser.role);
          
          navigate('/dashboard');
          toast({
            title: "Success",
            description: "You have successfully signed in with mock credentials.",
          });
          return;
        }
        
        // If we get here, the mock user exists in Supabase
        setUserRole(mockUser.role);
        navigate('/dashboard');
        toast({
          title: "Success",
          description: "You have successfully signed in with mock account.",
        });
        return;
      }
      
      // For non-mock accounts, proceed with normal authentication
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
