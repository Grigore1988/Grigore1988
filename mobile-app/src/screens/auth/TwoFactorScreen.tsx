import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useTheme} from '@/context/ThemeContext';
import {useAuth} from '@/context/AuthContext';
import {AuthStackParamList} from '@/navigation/AuthNavigator';
import {SCREEN_NAMES} from '@/constants';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import {showMessage} from 'react-native-flash-message';

type Props = NativeStackScreenProps<AuthStackParamList, typeof SCREEN_NAMES.TWO_FACTOR>;

interface TwoFactorFormData {
  code: string;
}

const schema = yup.object().shape({
  code: yup.string().length(6, 'Code must be 6 digits').required('Verification code is required'),
});

const TwoFactorScreen: React.FC<Props> = ({navigation, route}) => {
  const {theme} = useTheme();
  const {login} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {email, tempToken} = route.params;

  const {control, handleSubmit, formState: {errors}} = useForm<TwoFactorFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: TwoFactorFormData) => {
    try {
      setIsLoading(true);
      await login(email, '', data.code);
    } catch (error: any) {
      showMessage({message: error.message || 'Invalid verification code', type: 'danger'});
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.background, padding: 20, justifyContent: 'center'},
    header: {alignItems: 'center', marginBottom: 40},
    title: {fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 8},
    subtitle: {fontSize: 16, color: theme.textSecondary, textAlign: 'center'},
    email: {fontSize: 16, color: theme.primary, fontWeight: '600'},
    backButton: {marginTop: 20},
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Two-Factor Authentication</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code from your authenticator app for{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>
      </View>

      <Card>
        <Controller control={control} name="code" render={({field: {onChange, onBlur, value}}) => (
          <Input label="Verification Code" placeholder="000000" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.code?.message} leftIcon="shield-checkmark-outline" keyboardType="number-pad" maxLength={6} />
        )} />
        <Button title="Verify" onPress={handleSubmit(onSubmit)} loading={isLoading} fullWidth />
        <Button title="Back to Login" onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)} variant="ghost" style={styles.backButton} />
      </Card>
    </View>
  );
};

export default TwoFactorScreen;