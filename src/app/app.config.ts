import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { provideTaiga } from '@taiga-ui/core';

import { routes } from './app.routes';

import frTranslations from '../../public/i18n/fr.json';
import enTranslations from '../../public/i18n/en.json';
import nlTranslations from '../../public/i18n/nl.json';
import deTranslations from '../../public/i18n/de.json';

const translations: Record<string, Record<string, unknown>> = {
    fr: frTranslations,
    en: enTranslations,
    nl: nlTranslations,
    de: deTranslations,
};

export function initializeTranslate(translate: TranslateService): () => void {
    return () => {
        for (const [lang, data] of Object.entries(translations)) {
            translate.setTranslation(lang, data as any, true);
        }
        const stored = sessionStorage.getItem('eid:lang');
        translate.use(stored ?? 'fr');
    };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideTranslateService({
            lang: 'fr',
            fallbackLang: 'fr'
        }),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeTranslate,
            deps: [TranslateService],
            multi: true
        },
        provideTaiga(),
    ]
};
