import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE } from 'constants/defaults';
import { Language } from 'translations/constants';

import enTranslation from './translations/en.json';
import cnTranslation from './translations/cn.json';

i18n.use(initReactI18next).init({
	resources: {
		[Language.EN]: { translation: enTranslation },
		[Language.CN]:{translation: cnTranslation}
	},
	fallbackLng: Language.EN,
	lng: DEFAULT_LANGUAGE,
});

export default i18n;
