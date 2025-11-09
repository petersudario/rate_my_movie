import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppProvider } from '../src/context/AppContext';
import { ThemeProvider } from '../src/theme/ThemeContext';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname === '/';

    if (!user && !isAuthRoute) {
      router.replace('/');
    } else if (user && isAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#000000" />
      <Slot />
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
