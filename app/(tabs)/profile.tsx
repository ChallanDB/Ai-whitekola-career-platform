import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  FileText, 
  BriefcaseBusiness, 
  Moon, 
  Languages, 
  Bell, 
  HelpCircle,
  LogOut,
  Camera,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { auth } from '@/utils/firebase';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode, language, setLanguage } = useSettingsStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleCreateCV = () => {
    router.push('/cv/create');
  };

  const handlePostJob = () => {
    router.push('/job/post');
  };

  const handleTakePhoto = () => {
    Alert.alert(
      'Take Profile Photo',
      'This would open the camera to take a square profile photo.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK' }
      ]
    );
  };

  const handleToggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'For assistance, please contact us at akum.binda22@gmail.com',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
      router.replace('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.profileImageContainer} onPress={handleTakePhoto}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImagePlaceholder, darkMode && styles.darkProfileImagePlaceholder]}>
                <Text style={styles.profileInitials}>
                  {user?.username?.substring(0, 2).toUpperCase() || 'UK'}
                </Text>
                <View style={styles.cameraIconContainer}>
                  <Camera size={16} color="white" />
                </View>
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={[styles.username, darkMode && styles.darkText]}>
            {user?.username || 'User'}
          </Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          
          <View style={styles.actionButtons}>
            <Button
              title="Create CV"
              onPress={handleCreateCV}
              style={styles.actionButton}
              size="small"
            />
            <Button
              title="Post a Job"
              onPress={handlePostJob}
              variant="outline"
              style={styles.actionButton}
              size="small"
            />
          </View>
        </View>

        <View style={[styles.section, darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Career Tools</Text>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleCreateCV}
          >
            <FileText size={20} color={Colors.primary} />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>My CV</Text>
            <Text style={[styles.menuItemStatus, darkMode && styles.darkMenuItemStatus]}>
              {user?.hasCV ? 'Created' : 'Not Created'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handlePostJob}
          >
            <BriefcaseBusiness size={20} color={Colors.primary} />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>Post a Job</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Preferences</Text>
          
          <View style={styles.menuItem}>
            <Moon size={20} color={Colors.primary} />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D5DB', true: Colors.primary }}
              thumbColor="white"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleToggleLanguage}
          >
            <Languages size={20} color={Colors.primary} />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>Language</Text>
            <Text style={[styles.menuItemStatus, darkMode && styles.darkMenuItemStatus]}>
              {language === 'en' ? 'English' : 'Français'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.menuItem}>
            <Bell size={20} color={Colors.primary} />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: Colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        <View style={[styles.section, darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={handleHelpSupport}
          >
            <HelpCircle size={20} color={Colors.primary} />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, darkMode && styles.darkLogoutButton]} 
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  darkContainer: {
    backgroundColor: Colors.dark.background,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkProfileImagePlaceholder: {
    backgroundColor: Colors.dark.card,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  darkText: {
    color: Colors.dark.text,
  },
  email: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    marginHorizontal: 8,
    minWidth: 120,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  darkSection: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  menuItemStatus: {
    fontSize: 14,
    color: Colors.subtext,
  },
  darkMenuItemStatus: {
    color: Colors.dark.subtext,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  darkLogoutButton: {
    backgroundColor: Colors.dark.card,
    borderColor: Colors.dark.border,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
});