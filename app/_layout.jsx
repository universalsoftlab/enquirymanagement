import { Stack } from "expo-router";
import { Provider } from "react-redux";

import { store } from "../Redux/store/Store";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="(drawer)" />
       
      </Stack>
    </Provider>
  );
}
