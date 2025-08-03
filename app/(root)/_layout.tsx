  import { Stack } from 'expo-router';
import 'react-native-reanimated';


  const Layout = () => {
    return (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="find-ride" options={{ headerShown: false }} />
          <Stack.Screen name="confirm-ride" options={{ headerShown: false }} />
          <Stack.Screen name="book-ride" options={{ headerShown: false }} />
          <Stack.Screen name="[chatId]/messages" options={{ headerShown: false }} />
          <Stack.Screen name="individualProfile" options={{ headerShown: false }} />
          <Stack.Screen name="(configTabs)/changePassword" options={{ headerShown: false }} />
          <Stack.Screen name="(configTabs)/driverRegistration" options={{ headerShown: false }} />
          

        </Stack>
    );
  };

  export default Layout;