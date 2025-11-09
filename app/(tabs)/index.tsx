import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ErrorMessage } from '../../src/components/ErrorMessage';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { MovieCard } from '../../src/components/MovieCard';
import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { useSearchViewModel } from '../../src/viewmodels/SearchViewModel';

export default function SearchScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { isMovieRated, getRatedMovie } = useApp();
  const { movies, isLoading, error, searchMovies, loadPopularMovies } = useSearchViewModel();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadPopularMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      searchMovies(debouncedQuery);
    } else {
      loadPopularMovies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}` as any);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    loadPopularMovies();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.searchInputContainer, { 
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search for movies..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {searchQuery ? 'Search Results' : 'Popular Movies'}
        </Text>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage 
            message={error} 
            onRetry={() => searchQuery ? searchMovies(searchQuery) : loadPopularMovies()} 
          />
        ) : movies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="film-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {searchQuery ? 'No movies found' : 'No movies available'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const rated = isMovieRated(item.id, user?.email);
              const ratedMovie = getRatedMovie(item.id, user?.email);

              return (
                <MovieCard
                  movie={item}
                  onPress={() => handleMoviePress(item.id)}
                  isRated={rated}
                  userRating={ratedMovie?.userRating}
                />
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    borderRadius: 16
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});
