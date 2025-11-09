import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "../src/context/AppContext";
import { ThemeProvider } from "../src/theme/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="movie/[id]" 
            options={{ 
              headerShown: true,
              title: "Movie Details",
              headerBackTitle: "Back",
            }} 
          />
        </Stack>
      </AppProvider>
    </ThemeProvider>
  );
}
