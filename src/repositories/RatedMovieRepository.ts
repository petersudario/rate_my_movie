import AsyncStorage from '@react-native-async-storage/async-storage';
import { RatedMovie } from '../models/Movie';

const RATED_MOVIES_KEY = '@rate_my_movie:rated_movies';

export interface IRatedMovieRepository {
  getRatedMovies(): Promise<RatedMovie[]>;
  addRatedMovie(movie: RatedMovie): Promise<void>;
  updateRatedMovie(movieId: number, userRating: number): Promise<void>;
  removeRatedMovie(movieId: number): Promise<void>;
  isMovieRated(movieId: number): Promise<boolean>;
}

class RatedMovieRepository implements IRatedMovieRepository {
  async getRatedMovies(): Promise<RatedMovie[]> {
    try {
      const data = await AsyncStorage.getItem(RATED_MOVIES_KEY);
      if (data) {
        const movies = JSON.parse(data);
        // Convert date strings back to Date objects
        return movies.map((movie: any) => ({
          ...movie,
          ratedAt: new Date(movie.ratedAt),
          watchedAt: movie.watchedAt ? new Date(movie.watchedAt) : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting rated movies:', error);
      return [];
    }
  }

  async addRatedMovie(movie: RatedMovie): Promise<void> {
    try {
      const movies = await this.getRatedMovies();
      const existingIndex = movies.findIndex(m => m.id === movie.id);
      
      if (existingIndex >= 0) {
        movies[existingIndex] = movie;
      } else {
        movies.push(movie);
      }
      
      await AsyncStorage.setItem(RATED_MOVIES_KEY, JSON.stringify(movies));
    } catch (error) {
      console.error('Error adding rated movie:', error);
      throw error;
    }
  }

  async updateRatedMovie(movieId: number, userRating: number): Promise<void> {
    try {
      const movies = await this.getRatedMovies();
      const movieIndex = movies.findIndex(m => m.id === movieId);
      
      if (movieIndex >= 0) {
        movies[movieIndex].userRating = userRating;
        movies[movieIndex].ratedAt = new Date();
        await AsyncStorage.setItem(RATED_MOVIES_KEY, JSON.stringify(movies));
      }
    } catch (error) {
      console.error('Error updating rated movie:', error);
      throw error;
    }
  }

  async removeRatedMovie(movieId: number): Promise<void> {
    try {
      const movies = await this.getRatedMovies();
      const filteredMovies = movies.filter(m => m.id !== movieId);
      await AsyncStorage.setItem(RATED_MOVIES_KEY, JSON.stringify(filteredMovies));
    } catch (error) {
      console.error('Error removing rated movie:', error);
      throw error;
    }
  }

  async isMovieRated(movieId: number): Promise<boolean> {
    try {
      const movies = await this.getRatedMovies();
      return movies.some(m => m.id === movieId);
    } catch (error) {
      console.error('Error checking if movie is rated:', error);
      return false;
    }
  }
}

export default new RatedMovieRepository();
