import { SessionProvider } from '@fullauth/react-native';
import Home from './screens/home';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SessionProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Home />
      </View>
      <StatusBar style="auto" />
    </SessionProvider>
  );
}
