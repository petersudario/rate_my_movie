import { useState } from 'react';
import { Movie } from '../models/Movie';
import MovieRepository from '../repositories/MovieRepository';

export class SearchViewModel {
  private setMovies: (movies: Movie[]) => void;
  private setIsLoading: (loading: boolean) => void;
  private setError: (error: string | null) => void;

  constructor(
    setMovies: (movies: Movie[]) => void,
    setIsLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
  ) {
    this.setMovies = setMovies;
    this.setIsLoading = setIsLoading;
    this.setError = setError;
  }

  async searchMovies(query: string): Promise<void> {
    if (!query.trim()) {
      this.setMovies([]);
      return;
    }

    try {
      this.setIsLoading(true);
      this.setError(null);
      const movies = await MovieRepository.searchMovies(query);
      this.setMovies(movies);
    } catch (error: any) {
      this.setError(error.message || 'Failed to search movies');
      this.setMovies([]);
    } finally {
      this.setIsLoading(false);
    }
  }

  async loadPopularMovies(): Promise<void> {
    try {
      this.setIsLoading(true);
      this.setError(null);
      const movies = await MovieRepository.getPopularMovies();
      this.setMovies(movies);
    } catch (error: any) {
      this.setError(error.message || 'Failed to load popular movies');
      this.setMovies([]);
    } finally {
      this.setIsLoading(false);
    }
  }

  async loadTrendingMovies(): Promise<void> {
    try {
      this.setIsLoading(true);
      this.setError(null);
      const movies = await MovieRepository.getTrendingMovies();
      this.setMovies(movies);
    } catch (error: any) {
      this.setError(error.message || 'Failed to load trending movies');
      this.setMovies([]);
    } finally {
      this.setIsLoading(false);
    }
  }
}

export const useSearchViewModel = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewModel = new SearchViewModel(setMovies, setIsLoading, setError);

  return {
    movies,
    isLoading,
    error,
    searchMovies: (query: string) => viewModel.searchMovies(query),
    loadPopularMovies: () => viewModel.loadPopularMovies(),
    loadTrendingMovies: () => viewModel.loadTrendingMovies(),
  };
};
