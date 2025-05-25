import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@/context/ThemeContext';
import {useAuth} from '@/context/AuthContext';
import {useWebSocket} from '@/context/WebSocketContext';
import {MarketQuote, Portfolio} from '@tradepro/shared';
import {marketService} from '@/services/marketService';
import {portfolioService} from '@/services/portfolioService';
import Card from '@/components/common/Card';
import {formatCurrency, formatPercentage} from '@tradepro/shared';

const DashboardScreen: React.FC = () => {
  const {theme} = useTheme();
  const {user} = useAuth();
  const {isConnected, onMarketData, onPortfolioUpdate} = useWebSocket();
  const [refreshing, setRefreshing] = useState(false);

  // Portfolio data
  const {data: portfolio, refetch: refetchPortfolio} = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => portfolioService.getPortfolio(),
  });

  // Market movers
  const {data: marketMovers, refetch: refetchMarketMovers} = useQuery({
    queryKey: ['marketMovers'],
    queryFn: () => marketService.getMarketMovers(),
  });

  // Watchlist quotes
  const {data: watchlistQuotes, refetch: refetchWatchlist} = useQuery({
    queryKey: ['watchlistQuotes'],
    queryFn: () => marketService.getWatchlistQuotes(),
  });

  useEffect(() => {
    // Subscribe to real-time updates
    const handleMarketData = (data: MarketQuote) => {
      // Update market data in real-time
    };

    const handlePortfolioUpdate = (data: Portfolio) => {
      // Update portfolio in real-time
    };

    onMarketData(handleMarketData);
    onPortfolioUpdate(handlePortfolioUpdate);

    return () => {
      // Cleanup listeners
    };
  }, [onMarketData, onPortfolioUpdate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchPortfolio(),
      refetchMarketMovers(),
      refetchWatchlist(),
    ]);
    setRefreshing(false);
  };

  const renderPortfolioCard = () => (
    <Card style={styles.portfolioCard}>
      <View style={styles.portfolioHeader}>
        <Text style={[styles.portfolioTitle, {color: theme.text}]}>Portfolio</Text>
        <View style={[styles.connectionStatus, {backgroundColor: isConnected ? theme.success : theme.error}]}>
          <Text style={styles.connectionText}>{isConnected ? 'Live' : 'Offline'}</Text>
        </View>
      </View>
      
      <Text style={[styles.portfolioValue, {color: theme.text}]}>
        {formatCurrency(portfolio?.totalValue || 0)}
      </Text>
      
      <View style={styles.portfolioChange}>
        <Text style={[
          styles.changeText,
          {color: (portfolio?.dayChange || 0) >= 0 ? theme.bull : theme.bear}
        ]}>
          {formatCurrency(portfolio?.dayChange || 0)} ({formatPercentage(portfolio?.dayChangePercent || 0)})
        </Text>
        <Text style={[styles.changeLabel, {color: theme.textSecondary}]}>Today</Text>
      </View>

      <View style={styles.portfolioStats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, {color: theme.text}]}>
            {formatCurrency(portfolio?.cashBalance || 0)}
          </Text>
          <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Cash</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, {color: theme.text}]}>
            {portfolio?.positions?.length || 0}
          </Text>
          <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Positions</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, {color: theme.text}]}>
            {formatPercentage(portfolio?.totalReturnPercent || 0)}
          </Text>
          <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Total Return</Text>
        </View>
      </View>
    </Card>
  );

  const renderQuickActions = () => (
    <Card style={styles.quickActionsCard}>
      <Text style={[styles.sectionTitle, {color: theme.text}]}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: theme.primary}]}>
          <Icon name="add" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: theme.error}]}>
          <Icon name="remove" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: theme.secondary}]}>
          <Icon name="search" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: theme.info}]}>
          <Icon name="eye" size={24} color="#FFFFFF" />
          <Text style={styles.actionText}>Watch</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderMarketMovers = () => (
    <Card style={styles.marketMoversCard}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, {color: theme.text}]}>Market Movers</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAllText, {color: theme.primary}]}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.moversContainer}>
        <View style={styles.moverSection}>
          <Text style={[styles.moverTitle, {color: theme.bull}]}>Top Gainers</Text>
          {marketMovers?.gainers?.slice(0, 3).map((quote, index) => (
            <View key={index} style={styles.moverItem}>
              <Text style={[styles.moverSymbol, {color: theme.text}]}>{quote.symbol}</Text>
              <Text style={[styles.moverChange, {color: theme.bull}]}>
                +{formatPercentage(quote.changePercent)}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.moverSection}>
          <Text style={[styles.moverTitle, {color: theme.bear}]}>Top Losers</Text>
          {marketMovers?.losers?.slice(0, 3).map((quote, index) => (
            <View key={index} style={styles.moverItem}>
              <Text style={[styles.moverSymbol, {color: theme.text}]}>{quote.symbol}</Text>
              <Text style={[styles.moverChange, {color: theme.bear}]}>
                {formatPercentage(quote.changePercent)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );

  const renderWatchlist = () => (
    <Card style={styles.watchlistCard}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, {color: theme.text}]}>Watchlist</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAllText, {color: theme.primary}]}>Manage</Text>
        </TouchableOpacity>
      </View>
      
      {watchlistQuotes?.map((quote, index) => (
        <TouchableOpacity key={index} style={styles.watchlistItem}>
          <View style={styles.watchlistLeft}>
            <Text style={[styles.watchlistSymbol, {color: theme.text}]}>{quote.symbol}</Text>
            <Text style={[styles.watchlistPrice, {color: theme.text}]}>
              {formatCurrency(quote.price)}
            </Text>
          </View>
          <View style={styles.watchlistRight}>
            <Text style={[
              styles.watchlistChange,
              {color: quote.change >= 0 ? theme.bull : theme.bear}
            ]}>
              {formatCurrency(quote.change)}
            </Text>
            <Text style={[
              styles.watchlistPercent,
              {color: quote.change >= 0 ? theme.bull : theme.bear}
            ]}>
              {formatPercentage(quote.changePercent)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </Card>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    scrollView: {
      flex: 1,
      padding: 20,
    },
    portfolioCard: {
      marginBottom: 20,
    },
    portfolioHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    portfolioTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    connectionStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    connectionText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    portfolioValue: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    portfolioChange: {
      marginBottom: 20,
    },
    changeText: {
      fontSize: 16,
      fontWeight: '600',
    },
    changeLabel: {
      fontSize: 14,
      marginTop: 2,
    },
    portfolioStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    stat: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 16,
      fontWeight: '600',
    },
    statLabel: {
      fontSize: 12,
      marginTop: 4,
    },
    quickActionsCard: {
      marginBottom: 20,
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    actionButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 16,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    actionText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
    },
    marketMoversCard: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: '600',
    },
    moversContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    moverSection: {
      flex: 1,
      marginHorizontal: 8,
    },
    moverTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    moverItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    moverSymbol: {
      fontSize: 14,
      fontWeight: '500',
    },
    moverChange: {
      fontSize: 14,
      fontWeight: '600',
    },
    watchlistCard: {
      marginBottom: 20,
    },
    watchlistItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.separator,
    },
    watchlistLeft: {
      flex: 1,
    },
    watchlistSymbol: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    watchlistPrice: {
      fontSize: 14,
    },
    watchlistRight: {
      alignItems: 'flex-end',
    },
    watchlistChange: {
      fontSize: 14,
      fontWeight: '600',
    },
    watchlistPercent: {
      fontSize: 12,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, {user?.firstName}</Text>
        <Text style={styles.subtitle}>Ready to trade today?</Text>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {renderPortfolioCard()}
        {renderQuickActions()}
        {renderMarketMovers()}
        {renderWatchlist()}
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;