import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ErrorMessage } from "../../src/components/ErrorMessage";
import { LoadingSpinner } from "../../src/components/LoadingSpinner";
import { getImageUrl } from "../../src/config/api.config";
import { useApp } from "../../src/context/AppContext";
import { RatedMovie } from "../../src/models/Movie";
import { useTheme } from "../../src/theme/ThemeContext";
import { useMovieDetailsViewModel } from "../../src/viewmodels/MovieDetailsViewModel";

export default function MovieDetailsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = Number(params.id);

  const {
    addRatedMovie,
    updateRatedMovie,
    removeRatedMovie,
    isMovieRated,
    getRatedMovie,
  } = useApp();
  const { movieDetails, isLoading, error, loadMovieDetails } =
    useMovieDetailsViewModel();
  const { user } = useAuth();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    if (movieId) {
      loadMovieDetails(movieId);
    }
  }, [movieId]);

  const userEmail = user?.email;

  const userRatedMovie = getRatedMovie(movieId, userEmail);
  const currentRating = userRatedMovie?.userRating || 0;
  const hasRated = isMovieRated(movieId, userEmail);

  const handleRateMovie = async () => {
    if (!movieDetails) return;

    if (!userEmail) {
      Alert.alert("Error", "You must be logged in to rate movies.");
      return;
    }

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
        genreIds: movieDetails.genres.map((g) => g.id),
        userRating: selectedRating,
        ratedAt: new Date(),
        userEmail,
      };

      if (hasRated) {
        await updateRatedMovie(movieId, selectedRating);
        Alert.alert("Success", "Rating updated successfully!");
      } else {
        await addRatedMovie(ratedMovie);
        Alert.alert("Success", "Movie rated and added to your list!");
      }

      setShowRatingModal(false);
    } catch {
      Alert.alert("Error", "Failed to rate movie");
    }
  };

  const handleRemoveMovie = async () => {
    if (!hasRated) return;

    Alert.alert(
      "Remove Movie",
      "Are you sure you want to remove this movie from your rated list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeRatedMovie(movieId);
              Alert.alert("Success", "Movie removed from your list");
              router.back();
            } catch {
              Alert.alert("Error", "Failed to remove movie");
            }
          },
        },
      ]
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !movieDetails)
    return (
      <ErrorMessage
        message={error || "Movie not found"}
        onRetry={() => loadMovieDetails(movieId)}
      />
    );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {movieDetails.backdropPath && (
          <Image
            source={{ uri: getImageUrl(movieDetails.backdropPath, "backdrop") }}
            style={styles.backdrop}
            resizeMode="cover"
            accessible
            accessibilityRole="image"
            accessibilityLabel={`Background image from the movie ${movieDetails.title}`}
          />
        )}

        <View style={styles.content}>
          <View style={styles.posterRow}>
            <Image
              source={{
                uri: getImageUrl(movieDetails.posterPath, "poster"),
              }}
              style={styles.poster}
              resizeMode="cover"
              accessible
              accessibilityRole="image"
              accessibilityLabel={`Movie poster for ${movieDetails.title}`}
            />

            <View style={styles.infoColumn}>
              <Text
                style={[styles.title, { color: theme.colors.text }]}
                accessible
                accessibilityLabel={`Movie title: ${movieDetails.title}`}
              >
                {movieDetails.title}
              </Text>

              {movieDetails.tagline && (
                <Text
                  style={[styles.tagline, { color: theme.colors.textSecondary }]}
                  accessible
                  accessibilityLabel={`Movie tagline: ${movieDetails.tagline}`}
                >
                  “{movieDetails.tagline}”
                </Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={hasRated ? "Update movie rating" : "Rate movie"}
              accessibilityHint="Opens rating options"
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => {
                setSelectedRating(currentRating || 5);
                setShowRatingModal(true);
              }}
            >
              <Ionicons name={hasRated ? "create" : "star"} size={20} color="#fff" />
              <Text style={styles.actionButtonText}>
                {hasRated ? "Update Rating" : "Rate Movie"}
              </Text>
            </TouchableOpacity>

            {hasRated && (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Remove movie from rated list"
                accessibilityHint="This will ask for confirmation"
                style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                onPress={handleRemoveMovie}
              >
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="fade"
        accessible
        accessibilityLabel="Movie rating modal"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <Text accessible accessibilityLabel="Select a rating" style={[styles.modalTitle, { color: theme.colors.text }]}>
              Rate this movie
            </Text>

            <View style={styles.starsContainer}>
              {[...Array(10)].map((_, index) => {
                const rating = index + 1;
                return (
                  <TouchableOpacity
                    key={rating}
                    accessibilityRole="button"
                    accessibilityLabel={`Select rating ${rating}`}
                    onPress={() => setSelectedRating(rating)}
                    style={styles.starButton}
                  >
                    <Ionicons
                      name={rating <= selectedRating ? "star" : "star-outline"}
                      size={32}
                      color={rating <= selectedRating ? "#FFC107" : theme.colors.border}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Cancel rating"
                style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
                onPress={() => setShowRatingModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Save rating"
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleRateMovie}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdrop: { width: "100%", height: 250 },
  content: { padding: 16 },
  posterRow: { flexDirection: "row", marginTop: -100, marginBottom: 16 },
  poster: { width: 120, height: 180, borderRadius: 12, marginRight: 16 },
  infoColumn: { flex: 1, justifyContent: "flex-end" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  tagline: { fontSize: 14, fontStyle: "italic", marginBottom: 8 },
  actionButtons: { flexDirection: "row", gap: 8, marginVertical: 24 },
  actionButton: { flex: 1, padding: 14, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center" },
  actionButtonText: { color: "#fff", marginLeft: 8, fontSize: 16, fontWeight: "600" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
  modalContent: { width: "100%", borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 24, marginBottom: 16, textAlign: "center", fontWeight: "700" },
  starsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  starButton: { padding: 4 },
  modalButtons: { flexDirection: "row", gap: 8, marginTop: 24 },
  modalButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center" },
  modalButtonText: { fontSize: 16, fontWeight: "600" },
});
