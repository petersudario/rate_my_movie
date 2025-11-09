import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from '../../src/context/AuthContext';

export default function Index() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          {user?.profilePictureUri && (
            <Image source={{ uri: user.profilePictureUri }} style={styles.avatar} />
          )}

          <Text style={styles.welcome}>Bem-vindo</Text>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.divider} />

          <Text style={styles.helperText}>
            Você está logado em sua conta. Em breve, esta tela mostrará seus filmes favoritos. 🎬
          </Text>

          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = '#6366F1';
const BG = '#020617';
const CARD_BG = '#0B1120';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  welcome: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  email: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#1F2937',
    marginVertical: 20,
  },
  helperText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4B5563',
    alignItems: 'center',
  },
  logoutText: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '600',
  },
});
