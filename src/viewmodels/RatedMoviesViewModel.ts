import { useState } from 'react';
import { RatedMovie } from '../models/Movie';

export type SortOption = 'dateAdded' | 'rating' | 'title' | 'releaseDate';
export type FilterOption = 'all' | 'highRated' | 'lowRated';

export class RatedMoviesViewModel {
  private ratedMovies: RatedMovie[];
  private setFilteredMovies: (movies: RatedMovie[]) => void;

  constructor(
    ratedMovies: RatedMovie[],
    setFilteredMovies: (movies: RatedMovie[]) => void
  ) {
    this.ratedMovies = ratedMovies;
    this.setFilteredMovies = setFilteredMovies;
  }

  applyFiltersAndSort(sortBy: SortOption, filterBy: FilterOption): void {
    let filtered = [...this.ratedMovies];

    // Apply filters
    switch (filterBy) {
      case 'highRated':
        filtered = filtered.filter(movie => movie.userRating >= 7);
        break;
      case 'lowRated':
        filtered = filtered.filter(movie => movie.userRating < 7);
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'dateAdded':
        filtered.sort((a, b) => b.ratedAt.getTime() - a.ratedAt.getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.userRating - a.userRating);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'releaseDate':
        filtered.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
        break;
    }

    this.setFilteredMovies(filtered);
  }

  searchMovies(query: string): void {
    if (!query.trim()) {
      this.setFilteredMovies(this.ratedMovies);
      return;
    }

    const filtered = this.ratedMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    this.setFilteredMovies(filtered);
  }
}

export const useRatedMoviesViewModel = (ratedMovies: RatedMovie[]) => {
  const [filteredMovies, setFilteredMovies] = useState<RatedMovie[]>(ratedMovies);
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const viewModel = new RatedMoviesViewModel(ratedMovies, setFilteredMovies);

  const updateSort = (newSort: SortOption) => {
    setSortBy(newSort);
    viewModel.applyFiltersAndSort(newSort, filterBy);
  };

  const updateFilter = (newFilter: FilterOption) => {
    setFilterBy(newFilter);
    viewModel.applyFiltersAndSort(sortBy, newFilter);
  };

  const searchMovies = (query: string) => {
    viewModel.searchMovies(query);
  };

  return {
    filteredMovies,
    sortBy,
    filterBy,
    updateSort,
    updateFilter,
    searchMovies,
  };
};
