import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './core/navigation';
import { setupNotifications } from './services/notification/commuteAlert';

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <RootNavigator />
    </>
  );
}
