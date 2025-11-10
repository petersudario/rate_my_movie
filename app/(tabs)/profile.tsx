import { useAuth } from '@/src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { useTheme } from '../../src/theme/ThemeContext';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user: authUser, signOut, updateProfile } = useAuth();
  const { ratedMovies } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (authUser) {
      setName(authUser.name);
      setEmail(authUser.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [authUser]);

  const avatarUri = authUser?.profilePicture ?? null;

  const myRatedMovies = useMemo(
    () => ratedMovies.filter((m: any) => m.userEmail === authUser?.email),
    [ratedMovies, authUser?.email]
  );

  const handleSave = async () => {
    if (!authUser) return;
    try {
      await updateProfile({ name, email });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  // Prevent image flash on logout
  const handleSignOut = () => {
    setName('');
    setEmail('');
    signOut();
  };

  const stats = [
    {
      label: 'Movies Rated',
      value: myRatedMovies.length,
      icon: 'star' as const,
      color: '#FFC107',
    },
    {
      label: 'Avg Rating',
      value:
        myRatedMovies.length > 0
          ? (
              myRatedMovies.reduce((sum: number, m: any) => sum + m.userRating, 0) /
              myRatedMovies.length
            ).toFixed(1)
          : '0.0',
      icon: 'trophy' as const,
      color: theme.colors.secondary,
    },
    {
      label: 'This Month',
      value: myRatedMovies.filter((m: any) => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return m.ratedAt >= monthAgo;
      }).length,
      icon: 'calendar' as const,
      color: theme.colors.primary,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.profileImageContainer}>
          {authUser && avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.profileImage}
              resizeMode="cover"
              accessible
              accessibilityRole="image"
              accessibilityLabel="User profile picture"
            />
          ) : (
            <View
              style={[
                styles.profileImagePlaceholder,
                { backgroundColor: theme.colors.primary },
              ]}
              accessible
              accessibilityRole="image"
              accessibilityLabel="Default profile icon"
            >
              <Ionicons name="person" size={48} color="#fff" />
            </View>
          )}
        </View>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor={theme.colors.textSecondary}
              accessible
              accessibilityLabel="Name input field"
              accessibilityHint="Enter your new name"
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              accessible
              accessibilityLabel="Email input field"
              accessibilityHint="Enter your new email"
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.border }]}
                onPress={() => {
                  setIsEditing(false);
                  setName(authUser?.name || '');
                  setEmail(authUser?.email || '');
                }}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Cancel editing"
                accessibilityHint="Discard changes"
              >
                <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={handleSave}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Save profile changes"
                accessibilityHint="Save your new name and email"
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text
              style={[styles.name, { color: theme.colors.text }]}
              accessible
              accessibilityLabel={`Name: ${authUser?.name}`}
            >
              {authUser?.name}
            </Text>
            <Text
              style={[styles.email, { color: theme.colors.textSecondary }]}
              accessible
              accessibilityLabel={`Email: ${authUser?.email}`}
            >
              {authUser?.email}
            </Text>

            <TouchableOpacity
              style={[styles.editButton, { borderColor: theme.colors.primary }]}
              onPress={() => setIsEditing(true)}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              accessibilityHint="Open fields to edit name and email"
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
              <Text
                style={[styles.editButtonText, { color: theme.colors.primary }]}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[
              styles.statCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
            accessible
            accessibilityLabel={`${stat.label}: ${stat.value}`}
          >
            <Ionicons name={stat.icon} size={32} color={stat.color} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.settingsContainer,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Settings
        </Text>

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
          onPress={toggleTheme}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Toggle theme"
          accessibilityHint="Switch between light and dark mode"
        >
          <View style={styles.settingLeft}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.settingItem,
            { borderBottomColor: theme.colors.border, marginTop: 8 },
          ]}
          onPress={handleSignOut}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          accessibilityHint="Log out of your account"
        >
          <View style={styles.settingLeft}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={theme.colors.error ?? '#EF4444'}
            />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>
              Sair da conta
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16 },
  header: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: { marginBottom: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: { alignItems: 'center' },
  name: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  email: { fontSize: 16, marginBottom: 16 },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  editButtonText: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
  editContainer: { width: '100%' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statValue: { fontSize: 24, fontWeight: '700', marginTop: 8 },
  statLabel: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  settingsContainer: { borderRadius: 12, padding: 16, borderWidth: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingText: { fontSize: 16, marginLeft: 12 },
});
