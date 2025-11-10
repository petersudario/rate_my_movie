import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    const success = await signIn(email, password);

    if (!success) {
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.logo}>Rate My Movie</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="youremail@email.com"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessible
            accessibilityLabel="Email input field"
            accessibilityHint="Enter your email address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#6B7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            accessible
            accessibilityLabel="Password input field"
            accessibilityHint="Enter your password"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogin}
            accessible
            accessibilityLabel="Log in button"
            accessibilityRole="button"
            accessibilityHint="Logs you into your account"
          >
            <Text
              style={styles.primaryButtonText}
              accessible
              accessibilityLabel="Log in button label"
            >
              Log In
            </Text>
          </TouchableOpacity>

          <View style={styles.footerTextWrapper}>
            <Text style={styles.footerText}> Dont have an account? </Text>
            <Link
              href="/auth/register"
              style={styles.link}
              accessible
              accessibilityLabel="Register link"
              accessibilityRole="link"
              accessibilityHint="Navigates to the account registration screen"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = "#6366F1";
const BG = "#020617";
const CARD_BG = "#020617";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#111827",
  },
  label: {
    fontSize: 13,
    color: "#E5E7EB",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 14,
    color: "#F9FAFB",
    backgroundColor: "#020617",
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: PRIMARY,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#F9FAFB",
    fontWeight: "600",
    fontSize: 16,
  },
  footerTextWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  link: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "600",
  },
});
