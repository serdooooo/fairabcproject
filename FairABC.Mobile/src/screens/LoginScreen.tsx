import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';
import { API_CONFIG } from '../config/api';

const SCREEN_WIDTH = Dimensions.get('window').width;

// UserType enum'ını ekleyelim
enum UserType {
  Customer = 0,
  Company = 1
}

const Logo = () => (
  <Svg width={SCREEN_WIDTH * 0.8} height={100} viewBox="0 0 300 100">
    <Rect
      x="10"
      y="10"
      width="280"
      height="80"
      fill="#2196F3"
      rx="10"
      ry="10"
    />
    <SvgText
      x="150"
      y="60"
      fill="white"
      fontSize="40"
      fontWeight="bold"
      textAnchor="middle"
    >
      FairABC
    </SvgText>
  </Svg>
);

const LoginScreen = ({ navigation }: any) => {
  const { translations, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCustomer, setIsCustomer] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/login`, {
        email,
        password,
        expectedUserType: isCustomer ? UserType.Customer : UserType.Company
      });

      // Tüm kullanıcı bilgilerini kaydet
      await AsyncStorage.setItem('userId', response.data.id.toString());
      await AsyncStorage.setItem('userEmail', response.data.email);
      await AsyncStorage.setItem('userType', response.data.userType.toString());
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('firstName', response.data.firstName);
      await AsyncStorage.setItem('lastName', response.data.lastName);
      if (response.data.companyName) {
        await AsyncStorage.setItem('companyName', response.data.companyName);
      }

      Alert.alert('Success', translations.loginSuccess);
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Error', translations.invalidCredentials);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', translations.allFieldsRequired);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', translations.passwordMismatch);
      return;
    }

    if (!isCustomer && !companyName) {
      Alert.alert('Error', translations.companyNameRequired);
      return;
    }

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        userType: isCustomer ? UserType.Customer : UserType.Company,
        companyName: !isCustomer ? companyName : null,
      });

      Alert.alert('Success', translations.registerSuccess);
      setIsRegistering(false);
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setCompanyName('');
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      Alert.alert('Error', translations.registrationFailed);
    }
  };

  const renderLoginForm = () => (
    <View style={styles.form}>
      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[styles.userTypeButton, isCustomer && styles.selectedUserType]}
          onPress={() => setIsCustomer(true)}
        >
          <Text style={[styles.userTypeText, isCustomer && styles.selectedUserTypeText]}>
            {translations.customer}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.userTypeButton, !isCustomer && styles.selectedUserType]}
          onPress={() => setIsCustomer(false)}
        >
          <Text style={[styles.userTypeText, !isCustomer && styles.selectedUserTypeText]}>
            {translations.company}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder={translations.email}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={translations.password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="none"
        autoComplete="off"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>{translations.login}</Text>
      </TouchableOpacity>

      {isCustomer && (
        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={() => setIsRegistering(true)}
        >
          <Text style={styles.buttonText}>{translations.register}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderRegisterForm = () => (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder={translations.firstName}
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder={translations.lastName}
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder={translations.email}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!isCustomer && (
        <TextInput
          style={styles.input}
          placeholder={translations.companyName}
          value={companyName}
          onChangeText={setCompanyName}
          autoCapitalize="words"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder={translations.password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="none"
        autoComplete="off"
      />
      <TextInput
        style={styles.input}
        placeholder={translations.confirmPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        textContentType="none"
        autoComplete="off"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>{translations.register}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={() => {
          setIsRegistering(false);
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setCompanyName('');
        }}
      >
        <Text style={styles.buttonText}>{translations.login}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Logo />
            <Text style={styles.subtitle}>{translations.subtitle}</Text>
          </View>

          <View style={styles.languageContainer}>
            <TouchableOpacity
              style={[styles.languageButton, language === 'en' && styles.activeLanguage]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.languageText, language === 'en' && styles.activeLanguageText]}>
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageButton, language === 'tr' && styles.activeLanguage]}
              onPress={() => setLanguage('tr')}
            >
              <Text style={[styles.languageText, language === 'tr' && styles.activeLanguageText]}>
                Türkçe
              </Text>
            </TouchableOpacity>
          </View>

          {isRegistering ? renderRegisterForm() : renderLoginForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  languageText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  activeLanguage: {
    backgroundColor: '#2196F3',
  },
  activeLanguageText: {
    color: '#fff',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userTypeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2196F3',
    alignItems: 'center',
  },
  selectedUserType: {
    backgroundColor: '#2196F3',
  },
  userTypeText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  selectedUserTypeText: {
    color: 'white',
  },
}); 