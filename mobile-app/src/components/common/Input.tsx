import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@/context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  secureTextEntry,
  ...textInputProps
}) => {
  const {theme} = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const handleSecureToggle = () => {
    setIsSecure(!isSecure);
  };

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: 16,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 8,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: error ? theme.error : isFocused ? theme.primary : theme.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 44,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    fontSize: 16,
    color: theme.text,
    paddingVertical: 12,
    paddingHorizontal: leftIcon ? 8 : 0,
  });

  const getErrorStyle = (): TextStyle => ({
    fontSize: 12,
    color: theme.error,
    marginTop: 4,
  });

  const getIconColor = () => {
    if (error) return theme.error;
    if (isFocused) return theme.primary;
    return theme.textTertiary;
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && <Text style={[getLabelStyle(), labelStyle]}>{label}</Text>}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <Icon name={leftIcon} size={20} color={getIconColor()} />
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          placeholderTextColor={theme.placeholder}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        
        {secureTextEntry && (
          <TouchableOpacity onPress={handleSecureToggle}>
            <Icon
              name={isSecure ? 'eye-off' : 'eye'}
              size={20}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Icon name={rightIcon} size={20} color={getIconColor()} />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={[getErrorStyle(), errorStyle]}>{error}</Text>}
    </View>
  );
};

export default Input;