import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@/context/ThemeContext';
import {useAuth} from '@/context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '@/constants';
import Card from '@/components/common/Card';

const SettingsScreen: React.FC = () => {
  const {theme, toggleTheme, isDark} = useTheme();
  const {user, logout} = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: logout},
    ]);
  };

  const SettingItem = ({icon, title, subtitle, onPress, rightElement}: any) => (
    <TouchableOpacity onPress={onPress} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color={theme.text} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, {color: theme.text}]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, {color: theme.textSecondary}]}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || <Icon name="chevron-forward" size={20} color={theme.textSecondary} />}
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.background},
    header: {padding: 20, paddingTop: 60},
    title: {fontSize: 28, fontWeight: 'bold', color: theme.text, marginBottom: 20},
    profileCard: {marginBottom: 20, flexDirection: 'row', alignItems: 'center'},
    avatar: {width: 60, height: 60, borderRadius: 30, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center', marginRight: 16},
    avatarText: {color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'},
    profileInfo: {flex: 1},
    userName: {fontSize: 18, fontWeight: '600', color: theme.text},
    userEmail: {fontSize: 14, color: theme.textSecondary, marginTop: 2},
    content: {flex: 1, padding: 20},
    sectionTitle: {fontSize: 16, fontWeight: '600', color: theme.textSecondary, marginBottom: 12, marginTop: 20},
    settingItem: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 20, backgroundColor: theme.card, marginBottom: 1},
    settingLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
    settingText: {marginLeft: 16, flex: 1},
    settingTitle: {fontSize: 16, fontWeight: '500'},
    settingSubtitle: {fontSize: 14, marginTop: 2},
    logoutButton: {backgroundColor: theme.error, margin: 20, padding: 16, borderRadius: 8, alignItems: 'center'},
    logoutText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.firstName?.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </Card>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <SettingItem icon="person-outline" title="Profile" subtitle="Personal information" onPress={() => navigation.navigate(SCREEN_NAMES.PROFILE as never)} />
        <SettingItem icon="shield-checkmark-outline" title="Security" subtitle="Password & 2FA" onPress={() => navigation.navigate(SCREEN_NAMES.SECURITY as never)} />

        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <SettingItem icon="moon-outline" title="Dark Mode" rightElement={<Switch value={isDark} onValueChange={toggleTheme} />} />
        <SettingItem icon="notifications-outline" title="Notifications" subtitle="Push notifications & alerts" onPress={() => navigation.navigate(SCREEN_NAMES.NOTIFICATIONS as never)} />
        <SettingItem icon="settings-outline" title="App Preferences" subtitle="Currency, language & more" onPress={() => navigation.navigate(SCREEN_NAMES.PREFERENCES as never)} />

        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <SettingItem icon="help-circle-outline" title="Help & Support" subtitle="FAQ & contact us" onPress={() => navigation.navigate(SCREEN_NAMES.HELP as never)} />
        <SettingItem icon="information-circle-outline" title="About" subtitle="Version & legal" onPress={() => navigation.navigate(SCREEN_NAMES.ABOUT as never)} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;