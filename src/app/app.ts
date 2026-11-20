import { Component, inject, signal, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LaIconComponent, LaIconLibrary } from 'angular-line-awesome';
import { lasIdCard } from 'angular-line-awesome/icons';
import { TuiButton, TuiRoot } from '@taiga-ui/core';
import { TuiDropdownDirective, TuiDropdownManual } from '@taiga-ui/core';
import { TuiDataListComponent, TuiOption } from '@taiga-ui/core';
import { TuiHeaderComponent, TuiLogoComponent } from '@taiga-ui/layout';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TuiRoot, TuiHeaderComponent, TuiLogoComponent, LaIconComponent, TuiButton, TuiDropdownDirective, TuiDropdownManual, TuiDataListComponent, TuiOption, TranslatePipe],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    private icons = inject(LaIconLibrary);
    readonly translate = inject(TranslateService);

    readonly langs = ['fr', 'en', 'nl', 'de'];
    readonly open = signal(false);
    readonly buttonLabel = computed(() => this.currentLang().toUpperCase());

    constructor() {
        this.icons.addIcons([lasIdCard]);
        document.documentElement.lang = this.currentLang();

        this.translate.onLangChange.subscribe(() => {
            const lang = this.currentLang();
            document.documentElement.lang = lang;
            sessionStorage.setItem('eid:lang', lang);
        });
    }

    setLang(lang: string): void {
        this.translate.use(lang);
    }

    currentLang(): string {
        return this.translate.currentLang() ?? 'fr';
    }

    onClick(): void {
        this.open.update((value) => !value);
    }

    onActiveZone(_: boolean): void {}

    onObscured(_: boolean): void {}

    onSelect(lang: string): void {
        this.translate.use(lang);
        this.open.set(false);
    }
}
