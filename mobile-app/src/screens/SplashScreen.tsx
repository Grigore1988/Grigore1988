import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '@/context/ThemeContext';
import {APP_CONFIG} from '@/constants';

const SplashScreen: React.FC = () => {
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 40,
    },
    version: {
      position: 'absolute',
      bottom: 50,
      fontSize: 12,
      color: theme.textTertiary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{APP_CONFIG.NAME}</Text>
      <Text style={styles.subtitle}>Professional Trading Platform</Text>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={styles.version}>Version {APP_CONFIG.VERSION}</Text>
    </View>
  );
};

export default SplashScreen;