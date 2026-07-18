import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import vi from './locales/vi.json';
import ru from './locales/ru.json';
import id from './locales/id.json';
import pl from './locales/pl.json';
import tr from './locales/tr.json';
import it from './locales/it.json';
import nl from './locales/nl.json';
import sv from './locales/sv.json';
import uk from './locales/uk.json';
import fi from './locales/fi.json';
import zhTW from './locales/zh-TW.json';
import tw from './locales/tw.json';
import ms from './locales/ms.json';
import esMX from './locales/es-MX.json';

export const LANGUAGE_KEY = '@lunel_language';
export const SUPPORTED_LANGUAGES = [
  'en',
  'zh',
  'ja',
  'ko',
  'es',
  'pt',
  'de',
  'fr',
  'vi',
  'ru',
  'id',
  'pl',
  'tr',
  'it',
  'nl',
  'sv',
  'uk',
  'fi',
  'zh-TW',
  'tw',
  'ms',
  'es-MX',
] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export async function getStoredLanguage(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
      return stored;
    }
  } catch {}
  const deviceLang = Localization.getLocales()[0]?.languageCode ?? 'en';
  return SUPPORTED_LANGUAGES.includes(deviceLang as SupportedLanguage) ? deviceLang : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    ja: { translation: ja },
    ko: { translation: ko },
    es: { translation: es },
    pt: { translation: pt },
    de: { translation: de },
    fr: { translation: fr },
    vi: { translation: vi },
    ru: { translation: ru },
    id: { translation: id },
    pl: { translation: pl },
    tr: { translation: tr },
    it: { translation: it },
    nl: { translation: nl },
    sv: { translation: sv },
    uk: { translation: uk },
    fi: { translation: fi },
    'zh-TW': { translation: zhTW },
    tw: { translation: tw },
    ms: { translation: ms },
    'es-MX': { translation: esMX },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
