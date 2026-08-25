import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../pages/home/HomeScreen';
import RouteSearchScreen from '../pages/route-search/RouteSearchScreen';

export type RootStackParamList = {
  Home: undefined;
  RouteSearch: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1A73E8' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Getting Off' }}
        />
        <Stack.Screen
          name="RouteSearch"
          component={RouteSearchScreen}
          options={{ title: '경로 탐색' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
