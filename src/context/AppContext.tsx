import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { RatedMovie } from '../models/Movie';
import { User } from '../models/User';
import RatedMovieRepository from '../repositories/RatedMovieRepository';
import UserRepository from '../repositories/UserRepository';

interface AppContextType {
  user: User | null;
  ratedMovies: RatedMovie[];
  isLoading: boolean;
  setUser: (user: User) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addRatedMovie: (movie: RatedMovie) => Promise<void>;
  updateRatedMovie: (movieId: number, userRating: number) => Promise<void>;
  removeRatedMovie: (movieId: number) => Promise<void>;
  isMovieRated: (movieId: number) => boolean;
  getRatedMovie: (movieId: number) => RatedMovie | undefined;
  refreshRatedMovies: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [userData, moviesData] = await Promise.all([
        UserRepository.getUser(),
        RatedMovieRepository.getRatedMovies(),
      ]);
      
      if (userData) {
        setUserState(userData);
      } else {
        // Create a default user if none exists
        const defaultUser: User = {
          id: '1',
          name: 'Movie Enthusiast',
          email: 'user@ratemymovie.com',
          profilePicture: null,
        };
        await UserRepository.saveUser(defaultUser);
        setUserState(defaultUser);
      }
      
      setRatedMovies(moviesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = async (newUser: User) => {
    try {
      await UserRepository.saveUser(newUser);
      setUserState(newUser);
    } catch (error) {
      console.error('Error setting user:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      await UserRepository.updateUser(updates);
      const updatedUser = await UserRepository.getUser();
      if (updatedUser) {
        setUserState(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const addRatedMovie = async (movie: RatedMovie) => {
    try {
      await RatedMovieRepository.addRatedMovie(movie);
      const updatedMovies = await RatedMovieRepository.getRatedMovies();
      setRatedMovies(updatedMovies);
    } catch (error) {
      console.error('Error adding rated movie:', error);
      throw error;
    }
  };

  const updateRatedMovie = async (movieId: number, userRating: number) => {
    try {
      await RatedMovieRepository.updateRatedMovie(movieId, userRating);
      const updatedMovies = await RatedMovieRepository.getRatedMovies();
      setRatedMovies(updatedMovies);
    } catch (error) {
      console.error('Error updating rated movie:', error);
      throw error;
    }
  };

  const removeRatedMovie = async (movieId: number) => {
    try {
      await RatedMovieRepository.removeRatedMovie(movieId);
      const updatedMovies = await RatedMovieRepository.getRatedMovies();
      setRatedMovies(updatedMovies);
    } catch (error) {
      console.error('Error removing rated movie:', error);
      throw error;
    }
  };

  const refreshRatedMovies = async () => {
    try {
      const updatedMovies = await RatedMovieRepository.getRatedMovies();
      setRatedMovies(updatedMovies);
    } catch (error) {
      console.error('Error refreshing rated movies:', error);
      throw error;
    }
  };

  const isMovieRated = (movieId: number): boolean => {
    return ratedMovies.some(movie => movie.id === movieId);
  };

  const getRatedMovie = (movieId: number): RatedMovie | undefined => {
    return ratedMovies.find(movie => movie.id === movieId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        ratedMovies,
        isLoading,
        setUser,
        updateUser,
        addRatedMovie,
        updateRatedMovie,
        removeRatedMovie,
        isMovieRated,
        getRatedMovie,
        refreshRatedMovies,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
