
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifier d'abord la session existante
        const getInitialSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Error getting session:', error);
            }
            
            if (session) {
                setSession(session);
                setUser(session.user);
            }
            
            setLoading(false);
        };

        // Ensuite configurer l'écoute des changements d'état
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        getInitialSession();

        return () => subscription.unsubscribe();
    }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    // Pour l'inscription, rediriger vers admin.simpshopy.com
    const redirectUrl = `https://admin.simpshopy.com/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    // Après connexion réussie, rediriger vers admin.simpshopy.com/dashboard
    if (!error) {
      const currentHostname = window.location.hostname;
      if (currentHostname !== 'admin.simpshopy.com') {
        window.location.href = 'https://admin.simpshopy.com/dashboard';
      }
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    
    // Après déconnexion, rediriger vers le domaine principal
    const currentHostname = window.location.hostname;
    if (currentHostname === 'admin.simpshopy.com') {
      window.location.href = 'https://simpshopy.com';
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
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
