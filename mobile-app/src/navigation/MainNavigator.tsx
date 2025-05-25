import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@/context/ThemeContext';
import {SCREEN_NAMES} from '@/constants';

// Tab Screens
import DashboardScreen from '@/screens/main/DashboardScreen';
import MarketsScreen from '@/screens/main/MarketsScreen';
import TradingScreen from '@/screens/main/TradingScreen';
import PortfolioScreen from '@/screens/main/PortfolioScreen';
import SettingsScreen from '@/screens/main/SettingsScreen';

// Stack Screens
import MarketDetailScreen from '@/screens/market/MarketDetailScreen';
import SearchScreen from '@/screens/market/SearchScreen';
import WatchlistScreen from '@/screens/market/WatchlistScreen';
import OrderFormScreen from '@/screens/trading/OrderFormScreen';
import OrderConfirmationScreen from '@/screens/trading/OrderConfirmationScreen';
import OrderHistoryScreen from '@/screens/trading/OrderHistoryScreen';
import PositionDetailScreen from '@/screens/portfolio/PositionDetailScreen';
import PerformanceScreen from '@/screens/portfolio/PerformanceScreen';
import ProfileScreen from '@/screens/settings/ProfileScreen';
import SecurityScreen from '@/screens/settings/SecurityScreen';
import NotificationsScreen from '@/screens/settings/NotificationsScreen';
import PreferencesScreen from '@/screens/settings/PreferencesScreen';
import HelpScreen from '@/screens/settings/HelpScreen';
import AboutScreen from '@/screens/settings/AboutScreen';

export type MainTabParamList = {
  [SCREEN_NAMES.DASHBOARD]: undefined;
  [SCREEN_NAMES.MARKETS]: undefined;
  [SCREEN_NAMES.TRADING]: undefined;
  [SCREEN_NAMES.PORTFOLIO]: undefined;
  [SCREEN_NAMES.SETTINGS]: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  [SCREEN_NAMES.MARKET_DETAIL]: {symbol: string};
  [SCREEN_NAMES.SEARCH]: undefined;
  [SCREEN_NAMES.WATCHLIST]: {watchlistId?: string};
  [SCREEN_NAMES.ORDER_FORM]: {symbol?: string; side?: 'BUY' | 'SELL'};
  [SCREEN_NAMES.ORDER_CONFIRMATION]: {orderData: any};
  [SCREEN_NAMES.ORDER_HISTORY]: undefined;
  [SCREEN_NAMES.POSITION_DETAIL]: {symbol: string};
  [SCREEN_NAMES.PERFORMANCE]: undefined;
  [SCREEN_NAMES.PROFILE]: undefined;
  [SCREEN_NAMES.SECURITY]: undefined;
  [SCREEN_NAMES.NOTIFICATIONS]: undefined;
  [SCREEN_NAMES.PREFERENCES]: undefined;
  [SCREEN_NAMES.HELP]: undefined;
  [SCREEN_NAMES.ABOUT]: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const MainTabs: React.FC = () => {
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case SCREEN_NAMES.DASHBOARD:
              iconName = focused ? 'home' : 'home-outline';
              break;
            case SCREEN_NAMES.MARKETS:
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case SCREEN_NAMES.TRADING:
              iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
              break;
            case SCREEN_NAMES.PORTFOLIO:
              iconName = focused ? 'pie-chart' : 'pie-chart-outline';
              break;
            case SCREEN_NAMES.SETTINGS:
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}>
      <Tab.Screen 
        name={SCREEN_NAMES.DASHBOARD} 
        component={DashboardScreen}
        options={{tabBarLabel: 'Dashboard'}}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.MARKETS} 
        component={MarketsScreen}
        options={{tabBarLabel: 'Markets'}}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.TRADING} 
        component={TradingScreen}
        options={{tabBarLabel: 'Trading'}}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.PORTFOLIO} 
        component={PortfolioScreen}
        options={{tabBarLabel: 'Portfolio'}}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.SETTINGS} 
        component={SettingsScreen}
        options={{tabBarLabel: 'Settings'}}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.MARKET_DETAIL} 
        component={MarketDetailScreen}
        options={({route}) => ({
          title: route.params.symbol,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.SEARCH} 
        component={SearchScreen}
        options={{
          title: 'Search Markets',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.WATCHLIST} 
        component={WatchlistScreen}
        options={{
          title: 'Watchlist',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ORDER_FORM} 
        component={OrderFormScreen}
        options={{
          title: 'Place Order',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ORDER_CONFIRMATION} 
        component={OrderConfirmationScreen}
        options={{
          title: 'Confirm Order',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ORDER_HISTORY} 
        component={OrderHistoryScreen}
        options={{
          title: 'Order History',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.POSITION_DETAIL} 
        component={PositionDetailScreen}
        options={({route}) => ({
          title: route.params.symbol,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.PERFORMANCE} 
        component={PerformanceScreen}
        options={{
          title: 'Performance',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.PROFILE} 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.SECURITY} 
        component={SecurityScreen}
        options={{
          title: 'Security',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.NOTIFICATIONS} 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.PREFERENCES} 
        component={PreferencesScreen}
        options={{
          title: 'Preferences',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.HELP} 
        component={HelpScreen}
        options={{
          title: 'Help & Support',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ABOUT} 
        component={AboutScreen}
        options={{
          title: 'About',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;