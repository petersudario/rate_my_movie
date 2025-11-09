import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/api.config';
import {
    ApiError,
    TMDbMovieDetailsResponse,
    TMDbSearchResponse
} from '../types/api.types';

class TMDbService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.TMDB_BASE_URL,
      params: {
        api_key: API_CONFIG.TMDB_API_KEY,
      },
    });
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        message: (error.response.data as any)?.status_message || 'An error occurred',
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        message: 'No response from server. Check your internet connection.',
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDbSearchResponse> {
    try {
      const response = await this.api.get<TMDbSearchResponse>('/search/movie', {
        params: {
          query,
          page,
          include_adult: false,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getMovieDetails(movieId: number): Promise<TMDbMovieDetailsResponse> {
    try {
      const response = await this.api.get<TMDbMovieDetailsResponse>(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getPopularMovies(page: number = 1): Promise<TMDbSearchResponse> {
    try {
      const response = await this.api.get<TMDbSearchResponse>('/movie/popular', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDbSearchResponse> {
    try {
      const response = await this.api.get<TMDbSearchResponse>(`/trending/movie/${timeWindow}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

export default new TMDbService();
