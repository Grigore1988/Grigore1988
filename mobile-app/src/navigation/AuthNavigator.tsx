import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAMES} from '@/constants';
import OnboardingScreen from '@/screens/auth/OnboardingScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import TwoFactorScreen from '@/screens/auth/TwoFactorScreen';

export type AuthStackParamList = {
  [SCREEN_NAMES.ONBOARDING]: undefined;
  [SCREEN_NAMES.LOGIN]: undefined;
  [SCREEN_NAMES.REGISTER]: undefined;
  [SCREEN_NAMES.FORGOT_PASSWORD]: {email?: string};
  [SCREEN_NAMES.TWO_FACTOR]: {email: string; tempToken: string};
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAMES.ONBOARDING}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name={SCREEN_NAMES.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={SCREEN_NAMES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={SCREEN_NAMES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={SCREEN_NAMES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={SCREEN_NAMES.TWO_FACTOR} component={TwoFactorScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;