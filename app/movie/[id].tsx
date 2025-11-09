import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ErrorMessage } from '../../src/components/ErrorMessage';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { getImageUrl } from '../../src/config/api.config';
import { useApp } from '../../src/context/AppContext';
import { RatedMovie } from '../../src/models/Movie';
import { useTheme } from '../../src/theme/ThemeContext';
import { useMovieDetailsViewModel } from '../../src/viewmodels/MovieDetailsViewModel';

export default function MovieDetailsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id);
  
  const { isMovieRated, getRatedMovie, addRatedMovie, updateRatedMovie, removeRatedMovie } = useApp();
  const { movieDetails, isLoading, error, loadMovieDetails } = useMovieDetailsViewModel();
  
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    if (movieId) {
      loadMovieDetails(movieId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const currentRating = getRatedMovie(movieId)?.userRating || 0;

  const handleRateMovie = async () => {
    if (!movieDetails) return;

    try {
      const ratedMovie: RatedMovie = {
        id: movieDetails.id,
        title: movieDetails.title,
        overview: movieDetails.overview,
        posterPath: movieDetails.posterPath,
        backdropPath: movieDetails.backdropPath,
        releaseDate: movieDetails.releaseDate,
        voteAverage: movieDetails.voteAverage,
        voteCount: movieDetails.voteCount,
        popularity: movieDetails.popularity,
        originalLanguage: movieDetails.originalLanguage,
        genreIds: movieDetails.genres.map(g => g.id),
        userRating: selectedRating,
        ratedAt: new Date(),
      };

      if (isMovieRated(movieId)) {
        await updateRatedMovie(movieId, selectedRating);
        Alert.alert('Success', 'Rating updated successfully!');
      } else {
        await addRatedMovie(ratedMovie);
        Alert.alert('Success', 'Movie rated and added to your list!');
      }
      
      setShowRatingModal(false);
    } catch {
      Alert.alert('Error', 'Failed to rate movie');
    }
  };

  const handleRemoveMovie = async () => {
    Alert.alert(
      'Remove Movie',
      'Are you sure you want to remove this movie from your rated list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeRatedMovie(movieId);
              Alert.alert('Success', 'Movie removed from your list');
              router.back();
            } catch {
              Alert.alert('Error', 'Failed to remove movie');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !movieDetails) {
    return <ErrorMessage message={error || 'Movie not found'} onRetry={() => loadMovieDetails(movieId)} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Backdrop Image */}
        {movieDetails.backdropPath && (
          <Image
            source={{ uri: getImageUrl(movieDetails.backdropPath, 'backdrop') }}
            style={styles.backdrop}
            resizeMode="cover"
          />
        )}

        {/* Movie Info */}
        <View style={styles.content}>
          <View style={styles.posterRow}>
            <Image
              source={{ 
                uri: getImageUrl(movieDetails.posterPath, 'poster') || 'https://via.placeholder.com/500x750?text=No+Image'
              }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.infoColumn}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{movieDetails.title}</Text>
              {movieDetails.tagline && (
                <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
                  &ldquo;{movieDetails.tagline}&rdquo;
                </Text>
              )}
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                  {new Date(movieDetails.releaseDate).getFullYear()}
                </Text>
              </View>
              {movieDetails.runtime && (
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                    {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Ratings */}
          <View style={[styles.ratingsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.ratingItem}>
              <Ionicons name="star" size={32} color="#FFC107" />
              <Text style={[styles.ratingValue, { color: theme.colors.text }]}>
                {movieDetails.voteAverage.toFixed(1)}
              </Text>
              <Text style={[styles.ratingLabel, { color: theme.colors.textSecondary }]}>
                TMDb ({movieDetails.voteCount.toLocaleString()} votes)
              </Text>
            </View>
            {isMovieRated(movieId) && (
              <View style={styles.ratingItem}>
                <Ionicons name="heart" size={32} color={theme.colors.secondary} />
                <Text style={[styles.ratingValue, { color: theme.colors.text }]}>
                  {currentRating.toFixed(1)}
                </Text>
                <Text style={[styles.ratingLabel, { color: theme.colors.textSecondary }]}>
                  Your Rating
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                setSelectedRating(currentRating || 5);
                setShowRatingModal(true);
              }}
            >
              <Ionicons name={isMovieRated(movieId) ? 'create' : 'star'} size={20} color="#fff" />
              <Text style={styles.actionButtonText}>
                {isMovieRated(movieId) ? 'Update Rating' : 'Rate Movie'}
              </Text>
            </TouchableOpacity>
            {isMovieRated(movieId) && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                onPress={handleRemoveMovie}
              >
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Genres */}
          {movieDetails.genres.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Genres</Text>
              <View style={styles.genresContainer}>
                {movieDetails.genres.map((genre) => (
                  <View
                    key={genre.id}
                    style={[styles.genreChip, { 
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    }]}
                  >
                    <Text style={[styles.genreText, { color: theme.colors.text }]}>{genre.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Overview */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Overview</Text>
            <Text style={[styles.overview, { color: theme.colors.text }]}>
              {movieDetails.overview || 'No overview available'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Rate this movie</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => setSelectedRating(rating)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={rating <= selectedRating ? 'star' : 'star-outline'}
                    size={32}
                    color={rating <= selectedRating ? '#FFC107' : theme.colors.border}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.ratingText, { color: theme.colors.text }]}>
              {selectedRating}/10
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
                onPress={() => setShowRatingModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleRateMovie}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  posterRow: {
    flexDirection: 'row',
    marginTop: -100,
    marginBottom: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    marginRight: 16,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
  ratingsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  ratingItem: {
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  ratingLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  genreText: {
    fontSize: 14,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
