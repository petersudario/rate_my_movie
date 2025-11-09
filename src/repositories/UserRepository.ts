import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/User';

const USERS_KEY = '@rate_my_movie:users';
const SESSION_KEY = '@rate_my_movie:session';

export interface IUserRepository {
  getUser(): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  updateUser(updates: Partial<User>): Promise<void>;
  clearUser(): Promise<void>;
  registerUser(user: User): Promise<void>;
  getUserByEmail(email: string): Promise<User | null>;
}

class UserRepository implements IUserRepository {
  private async getAllUsers(): Promise<User[]> {
    try {
      const data = await AsyncStorage.getItem(USERS_KEY);
      return data ? (JSON.parse(data) as User[]) : [];
    } catch (error) {
      console.error('Error getting users list:', error);
      return [];
    }
  }

  private async saveAllUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users list:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const session = await AsyncStorage.getItem(SESSION_KEY);
      return session ? (JSON.parse(session) as User) : null;
    } catch (error) {
      console.error('Error getting current user (session):', error);
      return null;
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const index = users.findIndex(
        u => u.email.toLowerCase() === user.email.toLowerCase()
      );

      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }

      await this.saveAllUsers(users);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async updateUser(updates: Partial<User>): Promise<void> {
    try {
      const currentUser = await this.getUser();
      if (!currentUser) return;

      const updatedUser: User = { ...currentUser, ...updates };
      await this.saveUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Error clearing current user session:', error);
      throw error;
    }
  }

  async registerUser(user: User): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const exists = users.some(
        u => u.email.toLowerCase() === user.email.toLowerCase()
      );

      if (exists) {
        throw new Error('User already exists');
      }

      users.push(user);
      await this.saveAllUsers(users);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      return user ?? null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }
}

export default new UserRepository();
