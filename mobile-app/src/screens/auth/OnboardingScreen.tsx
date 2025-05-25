import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@/context/ThemeContext';
import {AuthStackParamList} from '@/navigation/AuthNavigator';
import {SCREEN_NAMES} from '@/constants';
import Button from '@/components/common/Button';

type Props = NativeStackScreenProps<AuthStackParamList, typeof SCREEN_NAMES.ONBOARDING>;

const {width} = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Real-Time Trading',
    description: 'Trade stocks, crypto, and forex with real-time market data and lightning-fast execution.',
    icon: '📈',
  },
  {
    id: '2',
    title: 'Advanced Analytics',
    description: 'Make informed decisions with professional charts, technical indicators, and market insights.',
    icon: '📊',
  },
  {
    id: '3',
    title: 'Secure & Reliable',
    description: 'Your investments are protected with bank-level security and biometric authentication.',
    icon: '🔒',
  },
  {
    id: '4',
    title: 'Start Trading',
    description: 'Join thousands of traders and start building your portfolio today.',
    icon: '🚀',
  },
];

const OnboardingScreen: React.FC<Props> = ({navigation}) => {
  const {theme} = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({index: nextIndex});
    } else {
      navigation.navigate(SCREEN_NAMES.LOGIN);
    }
  };

  const handleSkip = () => {
    navigation.navigate(SCREEN_NAMES.LOGIN);
  };

  const renderItem = ({item}: {item: OnboardingItem}) => (
    <View style={[styles.slide, {width}]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={[styles.title, {color: theme.text}]}>{item.title}</Text>
      <Text style={[styles.description, {color: theme.textSecondary}]}>
        {item.description}
      </Text>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentIndex ? theme.primary : theme.textTertiary,
            },
          ]}
        />
      ))}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
    },
    icon: {
      fontSize: 60,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skipButton: {
      flex: 1,
      marginRight: 10,
    },
    nextButton: {
      flex: 1,
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      
      {renderPagination()}
      
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <Button
            title="Skip"
            onPress={handleSkip}
            variant="ghost"
            style={styles.skipButton}
          />
          <Button
            title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;