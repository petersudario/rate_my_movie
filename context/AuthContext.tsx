import React, { createContext, useContext, useEffect, useState } from 'react';
import * as storage from '../services/storage';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(email: string, pass: string): Promise<boolean>;
  signUp(name: string, email: string, pass: string, photoUri: string | null): Promise<boolean>;
  signOut(): void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  profilePictureUri: string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const storedUser = await storage.getStoredUserSession();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    }
    loadStoragedData();
  }, []);

  const signIn = async (email: string, pass: string): Promise<boolean> => {
    const foundUser = await storage.getUserByEmail(email);
    
    if (foundUser && foundUser.passwordHash === pass) {
      setUser(foundUser);
      await storage.storeUserSession(foundUser);
      return true;
    }
    return false;
  };

  const signUp = async (name: string, email: string, pass: string, photoUri: string | null): Promise<boolean> => {
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      alert('Este e-mail já está em uso.');
      return false;
    }

    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      passwordHash: pass,
      profilePictureUri: photoUri,
    };

    await storage.storeUser(newUser);
    return true;
  };

  const signOut = async () => {
    setUser(null);
    await storage.clearUserSession();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}