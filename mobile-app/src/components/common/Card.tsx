import React from 'react';
import {View, ViewStyle, TouchableOpacity} from 'react-native';
import {useTheme} from '@/context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
  margin?: number;
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding = 16,
  margin = 0,
  shadow = true,
}) => {
  const {theme} = useTheme();

  const getCardStyle = (): ViewStyle => ({
    backgroundColor: theme.card,
    borderRadius: 12,
    padding,
    margin,
    ...(shadow && {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }),
  });

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
};

export default Card;