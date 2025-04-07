import React, { createContext, useContext, useState } from 'react';
import { IntlProvider } from 'react-intl';
import enMessages from '../locales/en.json';
import deMessages from '../locales/de.json';

type Locale = 'en' | 'de';
type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const messages = {
  en: enMessages,
  de: deMessages
};

const I18nContext = createContext<I18nContextType>({} as I18nContextType);

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
