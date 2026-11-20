import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LaIconComponent } from 'angular-line-awesome';
import { TuiButton } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-viewer',
  imports: [TranslatePipe, RouterLink, LaIconComponent, TuiButton, TuiCardLarge],
  templateUrl: './viewer.html',
  styleUrl: './viewer.scss',
})
export class Viewer implements OnInit {
  private readonly translate = inject(TranslateService);

  readonly data = signal<Record<string, string | number>>({});
  readonly error = signal<string | null>(null);
  readonly entries = computed(() => Object.entries(this.data()));

  ngOnInit(): void {
    const hash = location.hash.substring(1);
    let parsed: unknown = null;

    if (hash) {
      try {
        parsed = JSON.parse(decodeURIComponent(hash));
      } catch {
        this.error.set(this.translate.instant('VIEWER.READ_FAILED'));
        return;
      }
      sessionStorage.setItem('eid:card-data', JSON.stringify(parsed));
      history.replaceState(null, '', location.origin + location.pathname + location.search);
    } else {
      const stored = sessionStorage.getItem('eid:card-data');
      if (stored) {
        try {
          parsed = JSON.parse(stored);
        } catch {
          parsed = null;
        }
      }
    }

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const clean: Record<string, string | number> = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === 'string' || typeof value === 'number') {
          clean[key] = value;
        }
      }
      this.data.set(clean);
      if (Object.keys(clean).length === 0) {
        this.error.set(this.translate.instant('VIEWER.NO_DATA'));
      }
    } else {
      this.error.set(this.translate.instant('VIEWER.NO_DATA_LINK'));
    }
  }

  labelFor(key: string): string {
    const upperKey = key.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    return this.translate.instant(`EID.${upperKey}`) ?? key;
  }
}
