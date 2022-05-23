import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(initReactI18next) // passes i18n down to react-i18next
    // load translation using xhr -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-xhr-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    .init({
        ns: [
          'ElectronicShop',
          
        ],
        defaultNS: 'locales',
        load: 'languageOnly',
        fallbackLng: 'en',
        keySeparator: '$', // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false, // react already safes from xss
        }
    });
export default i18n;
