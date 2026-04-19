// eslint-disable-next-line import/no-named-as-default
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import appConfig from '@/configs/app.config';
import vi from './lang/vi.json';
import en from './lang/en.json';
import es from './lang/es.json';
import tr from './lang/tr.json';
import errEn from './lang/errors/en.json';
import errTr from './lang/errors/tr.json';
import errEs from './lang/errors/es.json';

const resources = {
  vi: {
    translation: { ...vi },
  },
  en: {
    translation: { ...en, ...errEn },
  },
  es: {
    translation: { ...es, ...errEs },
  },
  tr: {
    translation: { ...tr, ...errTr },
  },
};
i18n.use(initReactI18next).init({
  resources,
  fallbackLng: appConfig.locale,
  lng: appConfig.locale,
  interpolation: {
    escapeValue: false,
  },
});

export const dateLocales: {
  [key: string]: () => Promise<ILocale>;
} = {
  vi: () => import('dayjs/locale/vi'),
  en: () => import('dayjs/locale/en'),
  es: () => import('dayjs/locale/es'),
  tr: () => import('dayjs/locale/tr'),
};

export default i18n;
