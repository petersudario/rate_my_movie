import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MovieCard } from '../../src/components/MovieCard';
import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme/ThemeContext';
import { FilterOption, SortOption, useRatedMoviesViewModel } from '../../src/viewmodels/RatedMoviesViewModel';

export default function RatedMoviesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { ratedMovies } = useApp();
  const {
    filteredMovies,
    sortBy,
    filterBy,
    updateSort,
    updateFilter,
  } = useRatedMoviesViewModel(ratedMovies);

  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    updateSort('dateAdded');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratedMovies]);

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}` as any);
  };

  const sortOptions: { value: SortOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'dateAdded', label: 'Date Added', icon: 'calendar' },
    { value: 'rating', label: 'My Rating', icon: 'star' },
    { value: 'title', label: 'Title (A-Z)', icon: 'text' },
    { value: 'releaseDate', label: 'Release Date', icon: 'film' },
  ];

  const filterOptions: { value: FilterOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'all', label: 'All Movies', icon: 'apps' },
    { value: 'highRated', label: 'High Rated (7+)', icon: 'thumbs-up' },
    { value: 'lowRated', label: 'Low Rated (<7)', icon: 'thumbs-down' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Rated Movies</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => setShowFilterMenu(true)}
          >
            <Ionicons name="filter" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => setShowSortMenu(true)}
          >
            <Ionicons name="swap-vertical" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {filteredMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="star-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No rated movies yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            Start rating movies to build your collection
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => handleMoviePress(item.id)}
              isRated={true}
              userRating={item.userRating}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Sort Menu Modal */}
      <Modal
        visible={showSortMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortMenu(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Sort By</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.menuItem,
                  { borderBottomColor: theme.colors.border },
                  sortBy === option.value && { backgroundColor: theme.colors.surface },
                ]}
                onPress={() => {
                  updateSort(option.value);
                  setShowSortMenu(false);
                }}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={sortBy === option.value ? theme.colors.primary : theme.colors.text}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    { color: sortBy === option.value ? theme.colors.primary : theme.colors.text },
                  ]}
                >
                  {option.label}
                </Text>
                {sortBy === option.value && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Menu Modal */}
      <Modal
        visible={showFilterMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterMenu(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.menuTitle, { color: theme.colors.text }]}>Filter By</Text>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.menuItem,
                  { borderBottomColor: theme.colors.border },
                  filterBy === option.value && { backgroundColor: theme.colors.surface },
                ]}
                onPress={() => {
                  updateFilter(option.value);
                  setShowFilterMenu(false);
                }}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={filterBy === option.value ? theme.colors.primary : theme.colors.text}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    { color: filterBy === option.value ? theme.colors.primary : theme.colors.text },
                  ]}
                >
                  {option.label}
                </Text>
                {filterBy === option.value && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    borderRadius: 16,
    padding: 16,
    maxHeight: '60%',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
});
