import { TuiRoot } from "@taiga-ui/core";
import { TuiNavigation} from '@taiga-ui/layout';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LaIconComponent, LaIconLibrary } from 'angular-line-awesome';
import { lasIdCard } from 'angular-line-awesome/icons';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, TuiRoot, TuiNavigation, LaIconComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    private icons = inject(LaIconLibrary);

    constructor() {
        this.icons.addIcons([lasIdCard]);
    }
}
