import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@/context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {marketService} from '@/services/marketService';
import {SCREEN_NAMES, POPULAR_SYMBOLS} from '@/constants';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import {formatCurrency, formatPercentage} from '@tradepro/shared';

const MarketsScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('STOCKS');

  const {data: quotes} = useQuery({
    queryKey: ['popularQuotes', selectedCategory],
    queryFn: () => marketService.getQuotes(POPULAR_SYMBOLS[selectedCategory as keyof typeof POPULAR_SYMBOLS]),
  });

  const categories = ['STOCKS', 'CRYPTO', 'FOREX'];

  const renderQuoteItem = ({item}: {item: any}) => (
    <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.MARKET_DETAIL as never, {symbol: item.symbol} as never)}>
      <Card style={styles.quoteCard}>
        <View style={styles.quoteHeader}>
          <Text style={[styles.symbol, {color: theme.text}]}>{item.symbol}</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, {color: theme.text}]}>{formatCurrency(item.price)}</Text>
            <Text style={[styles.change, {color: item.change >= 0 ? theme.bull : theme.bear}]}>
              {formatCurrency(item.change)} ({formatPercentage(item.changePercent)})
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
    searchContainer: {marginBottom: 20},
    categoriesContainer: {flexDirection: 'row', marginBottom: 20},
    categoryButton: {paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 12},
    categoryButtonActive: {backgroundColor: theme.primary},
    categoryButtonInactive: {backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border},
    categoryText: {fontSize: 14, fontWeight: '600'},
    categoryTextActive: {color: '#FFFFFF'},
    categoryTextInactive: {color: theme.text},
    list: {flex: 1, padding: 20},
    quoteCard: {marginBottom: 12, padding: 16},
    quoteHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    symbol: {fontSize: 18, fontWeight: '600'},
    priceContainer: {alignItems: 'flex-end'},
    price: {fontSize: 16, fontWeight: '600'},
    change: {fontSize: 14, marginTop: 2},
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        <View style={styles.searchContainer}>
          <Input placeholder="Search symbols..." value={searchQuery} onChangeText={setSearchQuery} leftIcon="search-outline" onRightIconPress={() => navigation.navigate(SCREEN_NAMES.SEARCH as never)} rightIcon="options-outline" />
        </View>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)} style={[styles.categoryButton, selectedCategory === category ? styles.categoryButtonActive : styles.categoryButtonInactive]}>
              <Text style={[styles.categoryText, selectedCategory === category ? styles.categoryTextActive : styles.categoryTextInactive]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList data={quotes || []} renderItem={renderQuoteItem} keyExtractor={(item) => item.symbol} style={styles.list} />
    </View>
  );
};

export default MarketsScreen;