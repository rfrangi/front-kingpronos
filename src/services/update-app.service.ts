import {Injectable} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import {ToastService} from './toast.service';


@Injectable({ providedIn: 'root' })
export class UpdateAppService {

  constructor(public updates: SwUpdate, public toast: ToastService) {
    // If updates are enabled
    if (updates.isEnabled) {
      // poll the service worker to check for updates
      interval(5 * 60 * 100).subscribe(() => {
        updates.checkForUpdate().then(() => console.log('checking for updates'));
      });
    }
  }

  // Called from app.components.ts constructor
  public checkForUpdates(): any {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(event => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
        this.promptUpdate(event);
      });
      this.updates.activated.subscribe(event => {
        this.toast.success('Nouvelle version installée avec succès');
      });
    }
  }

  // If there is an update, promt the user
  private promptUpdate(e: any): void {
    if (e.available) {
      const toastRef = this.toast.openSnackBar(
        'Une nouvelle version de l\'application est disponible',
        'Recharger',
        0
      );
      toastRef.onAction().subscribe(() => document.location.reload());
    }
  }

}
