import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/User';

const USER_KEY = '@rate_my_movie:user';

export interface IUserRepository {
  getUser(): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  updateUser(updates: Partial<User>): Promise<void>;
  clearUser(): Promise<void>;
}

class UserRepository implements IUserRepository {
  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async updateUser(updates: Partial<User>): Promise<void> {
    try {
      const currentUser = await this.getUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        await this.saveUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error clearing user:', error);
      throw error;
    }
  }
}

export default new UserRepository();
