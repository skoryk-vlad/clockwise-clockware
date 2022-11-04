import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from "i18next-http-backend";
import { supportedLanguages } from '../constants';

const currentLanguage = localStorage.getItem('language') || "ru";

i18n
    .use(initReactI18next)
    .use(HttpApi)
    .init({
        lng: currentLanguage,
        fallbackLng: "ru",
        supportedLngs: Object.keys(supportedLanguages),
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;