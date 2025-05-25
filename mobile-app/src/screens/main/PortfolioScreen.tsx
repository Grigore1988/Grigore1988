import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@/context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {portfolioService} from '@/services/portfolioService';
import {SCREEN_NAMES} from '@/constants';
import Card from '@/components/common/Card';
import {formatCurrency, formatPercentage} from '@tradepro/shared';

const PortfolioScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const {data: portfolio} = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => portfolioService.getPortfolio(),
  });

  const {data: performance} = useQuery({
    queryKey: ['performance'],
    queryFn: () => portfolioService.getPerformance(),
  });

  const renderPositionItem = (position: any) => (
    <TouchableOpacity key={position.symbol} onPress={() => navigation.navigate(SCREEN_NAMES.POSITION_DETAIL as never, {symbol: position.symbol} as never)}>
      <Card style={styles.positionCard}>
        <View style={styles.positionHeader}>
          <View>
            <Text style={[styles.symbol, {color: theme.text}]}>{position.symbol}</Text>
            <Text style={[styles.quantity, {color: theme.textSecondary}]}>{position.quantity} shares</Text>
          </View>
          <View style={styles.positionRight}>
            <Text style={[styles.value, {color: theme.text}]}>{formatCurrency(position.marketValue)}</Text>
            <Text style={[styles.pnl, {color: position.unrealizedPnL >= 0 ? theme.bull : theme.bear}]}>
              {formatCurrency(position.unrealizedPnL)} ({formatPercentage(position.unrealizedPnLPercent)})
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.background},
    header: {padding: 20, paddingTop: 60},
    title: {fontSize: 28, fontWeight: 'bold', color: theme.text, marginBottom: 20},
    portfolioSummary: {marginBottom: 20},
    totalValue: {fontSize: 32, fontWeight: 'bold', color: theme.text, marginBottom: 8},
    totalChange: {fontSize: 16, fontWeight: '600', marginBottom: 16},
    statsContainer: {flexDirection: 'row', justifyContent: 'space-between'},
    stat: {alignItems: 'center'},
    statValue: {fontSize: 16, fontWeight: '600', color: theme.text},
    statLabel: {fontSize: 12, color: theme.textSecondary, marginTop: 4},
    performanceCard: {marginBottom: 20},
    performanceTitle: {fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 16},
    performanceGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'},
    performanceItem: {width: '48%', marginBottom: 12},
    performanceLabel: {fontSize: 14, color: theme.textSecondary},
    performanceValue: {fontSize: 16, fontWeight: '600'},
    positionsTitle: {fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 16},
    positionCard: {marginBottom: 12},
    positionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    symbol: {fontSize: 18, fontWeight: '600'},
    quantity: {fontSize: 14, marginTop: 2},
    positionRight: {alignItems: 'flex-end'},
    value: {fontSize: 16, fontWeight: '600'},
    pnl: {fontSize: 14, marginTop: 2},
    actionButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary, padding: 16, borderRadius: 8, marginTop: 20},
    actionText: {color: '#FFFFFF', fontWeight: '600', marginLeft: 8},
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Portfolio</Text>
        <Card style={styles.portfolioSummary}>
          <Text style={styles.totalValue}>{formatCurrency(portfolio?.totalValue || 0)}</Text>
          <Text style={[styles.totalChange, {color: (portfolio?.dayChange || 0) >= 0 ? theme.bull : theme.bear}]}>
            {formatCurrency(portfolio?.dayChange || 0)} ({formatPercentage(portfolio?.dayChangePercent || 0)}) Today
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatCurrency(portfolio?.cashBalance || 0)}</Text>
              <Text style={styles.statLabel}>Cash</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{portfolio?.positions?.length || 0}</Text>
              <Text style={styles.statLabel}>Holdings</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, {color: (portfolio?.totalReturn || 0) >= 0 ? theme.bull : theme.bear}]}>
                {formatPercentage(portfolio?.totalReturnPercent || 0)}
              </Text>
              <Text style={styles.statLabel}>Total Return</Text>
            </View>
          </View>
        </Card>
      </View>

      <ScrollView style={{flex: 1, padding: 20}}>
        <Card style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>Performance</Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Day</Text>
              <Text style={[styles.performanceValue, {color: (performance?.dayChange || 0) >= 0 ? theme.bull : theme.bear}]}>
                {formatPercentage(performance?.dayChangePercent || 0)}
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Week</Text>
              <Text style={[styles.performanceValue, {color: (performance?.weekChange || 0) >= 0 ? theme.bull : theme.bear}]}>
                {formatPercentage(performance?.weekChangePercent || 0)}
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Month</Text>
              <Text style={[styles.performanceValue, {color: (performance?.monthChange || 0) >= 0 ? theme.bull : theme.bear}]}>
                {formatPercentage(performance?.monthChangePercent || 0)}
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Year</Text>
              <Text style={[styles.performanceValue, {color: (performance?.yearChange || 0) >= 0 ? theme.bull : theme.bear}]}>
                {formatPercentage(performance?.yearChangePercent || 0)}
              </Text>
            </View>
          </View>
        </Card>

        <Text style={styles.positionsTitle}>Holdings</Text>
        {portfolio?.positions?.map(renderPositionItem)}

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate(SCREEN_NAMES.PERFORMANCE as never)}>
          <Icon name="analytics" size={20} color="#FFFFFF" />
          <Text style={styles.actionText}>View Detailed Performance</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PortfolioScreen;