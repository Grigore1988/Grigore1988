import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
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

type Props = NativeStackScreenProps<AuthStackParamList, typeof SCREEN_NAMES.REGISTER>;

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
});

const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const {theme} = useTheme();
  const {register} = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {control, handleSubmit, formState: {errors}} = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.background},
    scrollView: {flexGrow: 1, justifyContent: 'center', padding: 20},
    header: {alignItems: 'center', marginBottom: 40},
    logo: {fontSize: 32, fontWeight: 'bold', color: theme.primary, marginBottom: 8},
    subtitle: {fontSize: 16, color: theme.textSecondary, textAlign: 'center'},
    form: {marginBottom: 20},
    footer: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20},
    footerText: {color: theme.textSecondary, fontSize: 14},
    signInText: {color: theme.primary, fontSize: 14, fontWeight: '600'},
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.logo}>TradePro</Text>
          <Text style={styles.subtitle}>Create your trading account</Text>
        </View>

        <Card style={styles.form}>
          <Controller control={control} name="firstName" render={({field: {onChange, onBlur, value}}) => (
            <Input label="First Name" placeholder="Enter your first name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.firstName?.message} leftIcon="person-outline" />
          )} />

          <Controller control={control} name="lastName" render={({field: {onChange, onBlur, value}}) => (
            <Input label="Last Name" placeholder="Enter your last name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.lastName?.message} leftIcon="person-outline" />
          )} />

          <Controller control={control} name="email" render={({field: {onChange, onBlur, value}}) => (
            <Input label="Email" placeholder="Enter your email" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
          )} />

          <Controller control={control} name="password" render={({field: {onChange, onBlur, value}}) => (
            <Input label="Password" placeholder="Enter your password" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.password?.message} leftIcon="lock-closed-outline" secureTextEntry />
          )} />

          <Controller control={control} name="confirmPassword" render={({field: {onChange, onBlur, value}}) => (
            <Input label="Confirm Password" placeholder="Confirm your password" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.confirmPassword?.message} leftIcon="lock-closed-outline" secureTextEntry />
          )} />

          <Button title="Create Account" onPress={handleSubmit(onSubmit)} loading={isLoading} fullWidth />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;