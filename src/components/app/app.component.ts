import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import {slideInAnimation} from '../../services/animations.service';
import {UpdateAppService} from '../../services/update-app.service';
import {ToastService} from '../../services/toast.service';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-root',
  animations: [
    slideInAnimation
  ],
  template: `
    <section class="section-install-app" *ngIf="displayPanelApp && !showInstallAppOnIphone && getPWADisplayMode() === 'browser' && deferredPrompt">
      <mat-icon (click)="displayPanelApp = false">close</mat-icon>
      <div class="col2">
        <img src="assets/icons/logo-transparent.png" alt="logo-install"/>
        <section>
            <label>Costello Pronos</label>
            <br/>
            <label class="status">
              {{ getPWADisplayMode() === 'browser' && !deferredPrompt ? 'Installée' : 'Non installée'}}
            </label>
        </section>
      </div>
      <div class="col3">
        <button mat-raised-button
                name="btn-valider"
                color="accent"
                (click)="installApp()">
          {{ getPWADisplayMode() == 'browser' && deferredPrompt ? 'Installer' : 'Ouvrir'}}</button>
      </div>
    </section>
    <section class="section-install-app-iphone" *ngIf="displayPanelApp && showInstallAppOnIphone">
      <mat-icon (click)="displayPanelApp = false">cancel</mat-icon>
      <div class="col2">
        <img src="assets/icons/logo-transparent.png" alt="logo-install"/>
        <section>
          <label>Installer Costello Pronos</label>
          <br/>
          <label class="status">
            Appuyez sur le "Menu",<br/>
            <!--<img src="assets/icons/icon-menu-iphone.png" alt="icon-menu-iphone">-->
            puis sur «Ajouter sur l'écran d'accueil» <!--<mat-icon>add_box</mat-icon>-->
          </label>
        </section>
      </div>
    </section>
        <app-header></app-header>
        <main>
          <div [@routeAnimations]="prepareRoute(outlet)">
            <router-outlet #outlet="outlet"></router-outlet>
          </div>
        </main>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Initialize deferredPrompt for use later to show browser install prompt.
  deferredPrompt: any;
  displayPanelApp: boolean = true;
  hasAppInstall: boolean = false;

  showInstallAppOnIphone: boolean = false;

  constructor(private sw: UpdateAppService,
              private swUpdate: SwUpdate,
              private toast: ToastService,
              private platform: Platform) {}

  ngOnInit(): any {
    this.swUpdate.available.subscribe((event) => {
      this.promptUpdate(event);
    });
    this.swUpdate.activated.subscribe(event => {
      this.toast.success('Nouvelle version installée avec succès');
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('Pret à etre installer');
      e.preventDefault();
      this.deferredPrompt = e;
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.hasAppInstall = true;
    });

    if (this.platform.IOS) {
      // @ts-ignore
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator['standalone']);
      if (!isInStandaloneMode) {
        this.showInstallAppOnIphone = true;
      }
    }
  }

  getPWADisplayMode(): string {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (document.referrer.startsWith('android-app://')) {
      return 'twa';
    } else { // @ts-ignore
      if (navigator.standalone || isStandalone) {
            return 'standalone';
          }
    }
    return 'browser';
  }

  installApp(): void {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt = null;
    }
  }

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

  prepareRoute(outlet: RouterOutlet): any {
    return outlet && outlet.activatedRouteData && (outlet.activatedRouteData as any).animation;
  }
}
