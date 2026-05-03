import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import FeedbackFormScreen from '../screens/FeedbackFormScreen';
import FeedbackListScreen from '../screens/FeedbackListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        // User is signed in
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
          <Stack.Screen name="FeedbackList" component={FeedbackListScreen} options={{ title: 'Feedback History' }} />
          <Stack.Screen name="FeedbackForm" component={FeedbackFormScreen} options={{ title: 'Submit Feedback' }} />
        </>
      ) : (
        // No token found, user isn't signed in
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
