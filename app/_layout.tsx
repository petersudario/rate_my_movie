import { Slot, usePathname, useRouter, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AppProvider } from "../src/context/AppContext";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { ThemeProvider } from "../src/theme/ThemeContext";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname.startsWith("/auth");

    if (!user && !isAuthRoute) {
      router.replace("/auth/login");
    } else if (user && isAuthRoute) {
      router.replace("/(tabs)");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="movie/[id]"
          options={{
            title: "Detalhes do Filme",
            headerTransparent: true,
            headerTintColor: "#FFFFFF",
            headerTitleStyle: { color: "#FFFFFF" },
            headerShadowVisible: false,
            headerShown: true,
            headerBackButtonDisplayMode: "minimal",
          }}
        />

        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
