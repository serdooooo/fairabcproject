import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../translations/en';
import tr from '../translations/tr';

type LanguageContextType = {
  language: string;
  translations: typeof en;
  setLanguage: (lang: string) => void;
};

const translations = {
  en,
  tr,
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  translations: en,
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  };

  React.useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguageState(savedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const value = {
    language,
    translations: translations[language as keyof typeof translations],
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 