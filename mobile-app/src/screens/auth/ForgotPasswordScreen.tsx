import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useTheme} from '@/context/ThemeContext';
import {AuthStackParamList} from '@/navigation/AuthNavigator';
import {SCREEN_NAMES} from '@/constants';
import {authService} from '@/services/authService';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import {showMessage} from 'react-native-flash-message';

type Props = NativeStackScreenProps<AuthStackParamList, typeof SCREEN_NAMES.FORGOT_PASSWORD>;

interface ForgotPasswordFormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordScreen: React.FC<Props> = ({navigation, route}) => {
  const {theme} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {control, handleSubmit, formState: {errors}} = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {email: route.params?.email || ''},
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword(data.email);
      setEmailSent(true);
      showMessage({message: 'Reset email sent successfully', type: 'success'});
    } catch (error: any) {
      showMessage({message: error.message || 'Failed to send reset email', type: 'danger'});
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.background, padding: 20, justifyContent: 'center'},
    header: {alignItems: 'center', marginBottom: 40},
    title: {fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 8},
    subtitle: {fontSize: 16, color: theme.textSecondary, textAlign: 'center'},
    successText: {fontSize: 16, color: theme.success, textAlign: 'center', marginBottom: 20},
    backButton: {marginTop: 20},
  });

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>We've sent password reset instructions to your email address.</Text>
        </View>
        <Button title="Back to Login" onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)} style={styles.backButton} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email address and we'll send you instructions to reset your password.</Text>
      </View>

      <Card>
        <Controller control={control} name="email" render={({field: {onChange, onBlur, value}}) => (
          <Input label="Email" placeholder="Enter your email" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
        )} />
        <Button title="Send Reset Email" onPress={handleSubmit(onSubmit)} loading={isLoading} fullWidth />
        <Button title="Back to Login" onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)} variant="ghost" style={styles.backButton} />
      </Card>
    </View>
  );
};

export default ForgotPasswordScreen;