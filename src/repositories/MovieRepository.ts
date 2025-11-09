import { Movie, MovieDetails } from '../models/Movie';
import TMDbService from '../services/TMDbService';
import {
    TMDbMovieDetailsResponse,
    TMDbMovieResponse
} from '../types/api.types';

export interface IMovieRepository {
  searchMovies(query: string, page?: number): Promise<Movie[]>;
  getMovieDetails(movieId: number): Promise<MovieDetails>;
  getPopularMovies(page?: number): Promise<Movie[]>;
  getTrendingMovies(timeWindow?: 'day' | 'week'): Promise<Movie[]>;
}

class MovieRepository implements IMovieRepository {
  private mapTMDbMovieToMovie(tmdbMovie: TMDbMovieResponse): Movie {
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      releaseDate: tmdbMovie.release_date,
      voteAverage: tmdbMovie.vote_average,
      voteCount: tmdbMovie.vote_count,
      popularity: tmdbMovie.popularity,
      originalLanguage: tmdbMovie.original_language,
      genreIds: tmdbMovie.genre_ids,
    };
  }

  private mapTMDbDetailsToMovieDetails(tmdbDetails: TMDbMovieDetailsResponse): MovieDetails {
    return {
      ...this.mapTMDbMovieToMovie(tmdbDetails),
      runtime: tmdbDetails.runtime,
      genres: tmdbDetails.genres.map(genre => ({
        id: genre.id,
        name: genre.name,
      })),
      productionCompanies: tmdbDetails.production_companies.map(company => ({
        id: company.id,
        name: company.name,
        logoPath: company.logo_path,
        originCountry: company.origin_country,
      })),
      budget: tmdbDetails.budget,
      revenue: tmdbDetails.revenue,
      status: tmdbDetails.status,
      tagline: tmdbDetails.tagline,
    };
  }

  async searchMovies(query: string, page: number = 1): Promise<Movie[]> {
    const response = await TMDbService.searchMovies(query, page);
    return response.results.map(movie => this.mapTMDbMovieToMovie(movie));
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const response = await TMDbService.getMovieDetails(movieId);
    return this.mapTMDbDetailsToMovieDetails(response);
  }

  async getPopularMovies(page: number = 1): Promise<Movie[]> {
    const response = await TMDbService.getPopularMovies(page);
    return response.results.map(movie => this.mapTMDbMovieToMovie(movie));
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
    const response = await TMDbService.getTrendingMovies(timeWindow);
    return response.results.map(movie => this.mapTMDbMovieToMovie(movie));
  }
}

export default new MovieRepository();
