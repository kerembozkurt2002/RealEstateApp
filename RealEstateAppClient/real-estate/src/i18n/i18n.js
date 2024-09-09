import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import tr from './tr.json';


const resources = {
  en: {
    translation: en
  },
  tr: {
    translation: tr
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Varsayılan dil
    fallbackLng: 'en', // Eğer dil bulunamazsa, bu dile dönecek
    interpolation: {
      escapeValue: false // React zaten otomatik olarak kaçış yapıyor
    }
  });

export default i18n;
