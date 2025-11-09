import { useState } from 'react';
import { MovieDetails } from '../models/Movie';
import MovieRepository from '../repositories/MovieRepository';

export class MovieDetailsViewModel {
  private setMovieDetails: (details: MovieDetails | null) => void;
  private setIsLoading: (loading: boolean) => void;
  private setError: (error: string | null) => void;

  constructor(
    setMovieDetails: (details: MovieDetails | null) => void,
    setIsLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
  ) {
    this.setMovieDetails = setMovieDetails;
    this.setIsLoading = setIsLoading;
    this.setError = setError;
  }

  async loadMovieDetails(movieId: number): Promise<void> {
    try {
      this.setIsLoading(true);
      this.setError(null);
      const details = await MovieRepository.getMovieDetails(movieId);
      this.setMovieDetails(details);
    } catch (error: any) {
      this.setError(error.message || 'Failed to load movie details');
      this.setMovieDetails(null);
    } finally {
      this.setIsLoading(false);
    }
  }
}

export const useMovieDetailsViewModel = () => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewModel = new MovieDetailsViewModel(
    setMovieDetails,
    setIsLoading,
    setError
  );

  return {
    movieDetails,
    isLoading,
    error,
    loadMovieDetails: (movieId: number) => viewModel.loadMovieDetails(movieId),
  };
};
