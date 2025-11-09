// TMDb API Response Types
export interface TMDbMovieResponse {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  genre_ids: number[];
}

export interface TMDbSearchResponse {
  page: number;
  results: TMDbMovieResponse[];
  total_pages: number;
  total_results: number;
}

export interface TMDbMovieDetailsResponse extends TMDbMovieResponse {
  runtime: number | null;
  genres: TMDbGenre[];
  production_companies: TMDbProductionCompany[];
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
}

export interface TMDbGenre {
  id: number;
  name: string;
}

export interface TMDbProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
