import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
import { Kecenewsservice } from './kecenewsservice';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    public kecenewsservice: Kecenewsservice,
    private menuCtrl: MenuController,
    private router: Router,
    private alertController: AlertController
  ) {}

  async onLogOut() {
    this.menuCtrl.close();

    const alert = await this.alertController.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Ya, Keluar',
          role: 'confirm',
          handler: () => {
            this.kecenewsservice.onLogout();
            this.router.navigate(['/login']);
          },
        },
      ],
    });

    await alert.present();
  }
}
