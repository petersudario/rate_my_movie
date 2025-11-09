export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  originalLanguage: string;
  genreIds: number[];
}

export interface MovieDetails extends Movie {
  runtime: number | null;
  genres: Genre[];
  productionCompanies: ProductionCompany[];
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface RatedMovie extends Movie {
  userRating: number;
  ratedAt: Date;
  watchedAt?: Date;
  userEmail: string;
}
