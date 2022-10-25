import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import zh from './zh.json';
  
i18n.use(initReactI18next).init({
  lng: 'zh',
  fallbackLng: 'zh',
  resources: {
    en: en,
    zh: zh,
  },
  interpolation: {
    escapeValue: false // react already safes from xss
  }
});
  
export default i18n;