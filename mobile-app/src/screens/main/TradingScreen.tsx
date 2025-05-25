import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@/context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {tradingService} from '@/services/tradingService';
import {SCREEN_NAMES} from '@/constants';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import {formatCurrency, formatDateTime} from '@tradepro/shared';

const TradingScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'orders' | 'positions'>('orders');

  const {data: orders} = useQuery({
    queryKey: ['orders'],
    queryFn: () => tradingService.getOrders(),
  });

  const {data: positions} = useQuery({
    queryKey: ['positions'],
    queryFn: () => tradingService.getPositions(),
  });

  const renderOrderItem = (order: any) => (
    <Card key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={[styles.symbol, {color: theme.text}]}>{order.symbol}</Text>
        <View style={[styles.statusBadge, {backgroundColor: getStatusColor(order.status)}]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <Text style={[styles.orderType, {color: theme.textSecondary}]}>{order.type} {order.side}</Text>
        <Text style={[styles.orderQuantity, {color: theme.text}]}>{order.quantity} shares</Text>
        <Text style={[styles.orderPrice, {color: theme.text}]}>{formatCurrency(order.price || 0)}</Text>
        <Text style={[styles.orderTime, {color: theme.textSecondary}]}>{formatDateTime(order.createdAt)}</Text>
      </View>
    </Card>
  );

  const renderPositionItem = (position: any) => (
    <TouchableOpacity key={position.symbol} onPress={() => navigation.navigate(SCREEN_NAMES.POSITION_DETAIL as never, {symbol: position.symbol} as never)}>
      <Card style={styles.positionCard}>
        <View style={styles.positionHeader}>
          <Text style={[styles.symbol, {color: theme.text}]}>{position.symbol}</Text>
          <Text style={[styles.positionValue, {color: theme.text}]}>{formatCurrency(position.marketValue)}</Text>
        </View>
        <View style={styles.positionDetails}>
          <Text style={[styles.positionQuantity, {color: theme.textSecondary}]}>{position.quantity} shares</Text>
          <Text style={[styles.positionPnL, {color: position.unrealizedPnL >= 0 ? theme.bull : theme.bear}]}>
            {formatCurrency(position.unrealizedPnL)} ({position.unrealizedPnLPercent.toFixed(2)}%)
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FILLED': return theme.success;
      case 'PENDING': return theme.warning;
      case 'CANCELLED': return theme.error;
      default: return theme.info;
    }
  };

  const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.background},
    header: {padding: 20, paddingTop: 60},
    title: {fontSize: 28, fontWeight: 'bold', color: theme.text, marginBottom: 20},
    quickActions: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20},
    actionButton: {flex: 1, marginHorizontal: 4, paddingVertical: 16, alignItems: 'center', borderRadius: 8},
    buyButton: {backgroundColor: theme.bull},
    sellButton: {backgroundColor: theme.bear},
    actionText: {color: '#FFFFFF', fontWeight: '600', marginTop: 4},
    tabs: {flexDirection: 'row', marginBottom: 20},
    tab: {flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2},
    activeTab: {borderBottomColor: theme.primary},
    inactiveTab: {borderBottomColor: 'transparent'},
    tabText: {fontSize: 16, fontWeight: '600'},
    activeTabText: {color: theme.primary},
    inactiveTabText: {color: theme.textSecondary},
    content: {flex: 1, padding: 20},
    orderCard: {marginBottom: 12},
    orderHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
    symbol: {fontSize: 18, fontWeight: '600'},
    statusBadge: {paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12},
    statusText: {color: '#FFFFFF', fontSize: 12, fontWeight: '600'},
    orderDetails: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    orderType: {fontSize: 14},
    orderQuantity: {fontSize: 14, fontWeight: '500'},
    orderPrice: {fontSize: 14, fontWeight: '600'},
    orderTime: {fontSize: 12},
    positionCard: {marginBottom: 12},
    positionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
    positionValue: {fontSize: 16, fontWeight: '600'},
    positionDetails: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    positionQuantity: {fontSize: 14},
    positionPnL: {fontSize: 14, fontWeight: '600'},
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trading</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, styles.buyButton]} onPress={() => navigation.navigate(SCREEN_NAMES.ORDER_FORM as never, {side: 'BUY'} as never)}>
            <Icon name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.sellButton]} onPress={() => navigation.navigate(SCREEN_NAMES.ORDER_FORM as never, {side: 'SELL'} as never)}>
            <Icon name="remove-circle" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Sell</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, activeTab === 'orders' ? styles.activeTab : styles.inactiveTab]} onPress={() => setActiveTab('orders')}>
            <Text style={[styles.tabText, activeTab === 'orders' ? styles.activeTabText : styles.inactiveTabText]}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'positions' ? styles.activeTab : styles.inactiveTab]} onPress={() => setActiveTab('positions')}>
            <Text style={[styles.tabText, activeTab === 'positions' ? styles.activeTabText : styles.inactiveTabText]}>Positions</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {activeTab === 'orders' ? (
          orders?.orders?.length ? orders.orders.map(renderOrderItem) : <Text style={{color: theme.textSecondary, textAlign: 'center'}}>No orders found</Text>
        ) : (
          positions?.length ? positions.map(renderPositionItem) : <Text style={{color: theme.textSecondary, textAlign: 'center'}}>No positions found</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default TradingScreen;