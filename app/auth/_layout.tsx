import { Stack } from 'expo-router';

const HEADER_BG = '#000000';
const HEADER_TEXT = '#FFFFFF';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: HEADER_BG },
        headerTintColor: HEADER_TEXT,
        headerTitleStyle: { color: HEADER_TEXT },
        headerShadowVisible: false,
      }}
    />
  );
}
