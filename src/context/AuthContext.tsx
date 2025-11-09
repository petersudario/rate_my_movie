import { User } from '@/src/models/User';
import UserRepository from '@/src/repositories/UserRepository';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<boolean>;
  signUp(
    name: string,
    email: string,
    password: string,
    photoUri: string | null
  ): Promise<boolean>;
  signOut(): Promise<void>;
  updateProfile(updates: Partial<User>): Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUser = await UserRepository.getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (e) {
        console.error('Error loading session:', e);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const existing = await UserRepository.getUserByEmail(email);
      if (!existing || existing.password !== password) {
        return false;
      }

      await UserRepository.saveUser(existing);
      setUser(existing);
      return true;
    } catch (e) {
      console.error('Error on signIn:', e);
      return false;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    profilePicture: string | null
  ): Promise<boolean> => {
    try {
      const existing = await UserRepository.getUserByEmail(email);
      if (existing) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        profilePicture,
      };

      await UserRepository.registerUser(newUser);
      await UserRepository.saveUser(newUser);

      setUser(newUser);
      return true;
    } catch (e) {
      console.error('Error on signUp:', e);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await UserRepository.clearUser();
      setUser(null);
    } catch (e) {
      console.error('Error on signOut:', e);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      await UserRepository.updateUser(updates);
      const updated = await UserRepository.getUser();
      setUser(updated);
    } catch (e) {
      console.error('Error on updateProfile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
