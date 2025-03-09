import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';

const HomePage = ({ navigation }: any) => {
  const { translations } = useLanguage();
  const [userType, setUserType] = useState<string>('');
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (!isLoggedIn || isLoggedIn !== 'true') {
        navigation.replace('Login');
        return;
      }

      const storedUserType = await AsyncStorage.getItem('userType');
      const storedCompanyName = await AsyncStorage.getItem('companyName');
      const storedUserEmail = await AsyncStorage.getItem('userEmail');
      
      if (storedUserType) {
        setUserType(storedUserType);
      } else {
        navigation.replace('Login');
      }
      if (storedCompanyName) {
        setCompanyName(storedCompanyName);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      navigation.replace('Login');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>{translations.logout}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          {translations.welcome}
        </Text>
        
        <View style={styles.userInfo}>
          <Text style={styles.userTypeText}>
            {userType === '0' ? translations.customer : translations.company}
          </Text>
          {companyName && (
            <Text style={styles.companyNameText}>
              {companyName}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userTypeText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  companyNameText: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomePage; 