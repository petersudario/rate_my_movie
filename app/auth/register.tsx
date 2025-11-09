import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePictureUri, setProfilePictureUri] = useState<string | null>(null);

  const { signUp } = useAuth();
  const router = useRouter();

  const saveImagePermanently = async (tempUri: string): Promise<string> => {
    const fileName = tempUri.split('/').pop() ?? `image-${Date.now()}`;
    const baseDir = (FileSystem as any).documentDirectory as string;
    const permanentUri = baseDir + fileName;

    try {
      await FileSystem.copyAsync({
        from: tempUri,
        to: permanentUri,
      });
      return permanentUri;
    } catch (err) {
      console.error('Erro ao salvar imagem:', err);
      return tempUri;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const permanentUri = await saveImagePermanently(result.assets[0].uri);
      setProfilePictureUri(permanentUri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar uma foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const permanentUri = await saveImagePermanently(result.assets[0].uri);
      setProfilePictureUri(permanentUri);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const success = await signUp(name, email, password, profilePictureUri);

    if (success) {
      Alert.alert('Sucesso', 'Cadastro realizado! Faça o login.');
      router.replace('/auth/login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>Criar conta</Text>
        <Text style={styles.subtitle}>Comece avaliando seus filmes favoritos</Text>

        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            {profilePictureUri ? (
              <Image source={{ uri: profilePictureUri }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.placeholderAvatarText}>Foto</Text>
              </View>
            )}

            <View style={styles.avatarButtonsRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                <Text style={styles.secondaryButtonText}>Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
                <Text style={styles.secondaryButtonText}>Câmera</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#6B7280"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seuemail@email.com"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#6B7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = '#6366F1';
const BG = '#020617';
const CARD_BG = '#020617';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F9FAFB',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#111827',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  placeholderAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020617',
  },
  placeholderAvatarText: {
    color: '#6B7280',
    fontSize: 14,
  },
  avatarButtonsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  label: {
    fontSize: 13,
    color: '#E5E7EB',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 14,
    color: '#F9FAFB',
    backgroundColor: '#020617',
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: PRIMARY,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#F9FAFB',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4B5563',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '500',
  },
});
