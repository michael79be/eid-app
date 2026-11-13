import { Component, OnInit, signal } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-home',
  imports: [TuiButton, TuiCardLarge],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly releaseUrl =
    'https://github.com/michael79be/eid-app/raw/refs/heads/main/app/release';
  private readonly platformDownloads = [
    { platform: 'macos', label: 'macOS (Universal)', file: 'eid-app.app.zip' },
    { platform: 'windows', label: 'Windows (64-bit)', file: 'eid-app-64.exe' },
    { platform: 'windows', label: 'Windows (32-bit)', file: 'eid-app-32.exe' },
    { platform: 'linux', label: 'Linux (64-bit)', file: 'eid-app-linux' },
    { platform: 'linux', label: 'Linux (32-bit)', file: 'eid-app-linux-32' },
  ] as const;

  readonly downloadUrl = signal<string | null>(null);
  readonly otherDownloads = signal<{ label: string; url: string }[]>([]);
  readonly isMacOS = signal(false);

  ngOnInit(): void {
    const platform = this.detectPlatform();
    const primaryDownload = this.platformDownloads.find(
      (download) => download.platform === platform,
    );
    this.isMacOS.set(platform === 'macos');

    this.downloadUrl.set(
      primaryDownload ? `${this.releaseUrl}/${primaryDownload.file}` : null,
    );
    this.otherDownloads.set(
      this.platformDownloads
        .filter((download) => download.file !== primaryDownload?.file)
        .map((download) => ({
          label: download.label,
          url: `${this.releaseUrl}/${download.file}`,
        })),
    );
  }

  private detectPlatform(): 'windows' | 'macos' | 'linux' | null {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('windows')) {
      return 'windows';
    }
    if (userAgent.includes('macintosh') || userAgent.includes('mac os')) {
      return 'macos';
    }
    if (userAgent.includes('linux') && !userAgent.includes('android')) {
      return 'linux';
    }

    return null;
  }
}
