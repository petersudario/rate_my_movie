import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getImageUrl } from '../config/api.config';
import { Movie } from '../models/Movie';
import { useTheme } from '../theme/ThemeContext';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  isRated?: boolean;
  userRating?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onPress, 
  isRated = false,
  userRating 
}) => {
  const { theme } = useTheme();

  const accessibleLabel = [
    `${movie.title}.`,
    movie.releaseDate ? `Release year: ${new Date(movie.releaseDate).getFullYear()}.` : null,
    `Average rating: ${movie.voteAverage.toFixed(1)}.`,
    isRated && userRating ? `Your rating: ${userRating.toFixed(1)}.` : null,
    `Tap to open movie details.`
  ]
  .filter(Boolean)
  .join(' ');

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibleLabel}
      accessibilityHint="Opens the selected movie's detail page"
    >
      <Image
        source={{
          uri: getImageUrl(movie.posterPath, 'poster') 
            || 'https://via.placeholder.com/500x750?text=No+Image'
        }}
        style={styles.poster}
        resizeMode="cover"
        accessible
        accessibilityRole="image"
        accessibilityLabel={`${movie.title} poster`}
      />

      <View style={styles.content}>
        <Text 
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {movie.title}
        </Text>

        <Text style={[styles.year, { color: theme.colors.textSecondary }]}>
          {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text style={[styles.rating, { color: theme.colors.text }]}>
            {movie.voteAverage.toFixed(1)}
          </Text>

          {isRated && userRating && (
            <>
              <View style={[styles.dot, { backgroundColor: theme.colors.textSecondary }]} />
              <Ionicons name="heart" size={16} color={theme.colors.secondary} />
              <Text style={[styles.rating, { color: theme.colors.secondary }]}>
                {userRating.toFixed(1)}
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
});
