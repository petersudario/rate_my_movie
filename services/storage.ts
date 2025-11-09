import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../context/AuthContext';

const USERS_KEY = '@rate_my_movie:users';
const SESSION_KEY = '@rate_my_movie:session';

export async function storeUser(user: User): Promise<void> {
  try {
    const storedUsers = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    users.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Erro ao salvar usuário:', e);
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const storedUsers = await AsyncStorage.getItem(USERS_KEY);
    if (!storedUsers) {
      return null;
    }
    const users: User[] = JSON.parse(storedUsers);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (e) {
    console.error('Erro ao buscar usuário:', e);
    return null;
  }
}

export async function storeUserSession(user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Erro ao salvar sessão:', e);
  }
}

export async function getStoredUserSession(): Promise<User | null> {
  try {
    const sessionData = await AsyncStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (e) {
    console.error('Erro ao carregar sessão:', e);
    return null;
  }
}

export async function clearUserSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Erro ao limpar sessão:', e);
  }
}