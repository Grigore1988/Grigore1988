import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '@/constants/Colors';
import {STORAGE_KEYS} from '@/constants';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: typeof Colors.light;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');

  useEffect(() => {
    loadStoredTheme();
  }, []);

  const loadStoredTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (storedTheme) {
        setThemeModeState(storedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading stored theme:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
    } catch (error) {
      console.error('Error storing theme:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');
  const theme = isDark ? Colors.dark : Colors.light;

  const value: ThemeContextType = {
    theme,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};