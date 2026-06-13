import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Kecenewsservice } from '../kecenewsservice';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.page.html',
  styleUrls: ['./add-category.page.scss'],
  standalone: false,
})
export class AddCategoryPage implements OnInit {
  categoryName: string = '';
  description: string = '';
  isSubmitting: boolean = false;
  returnUrl: string = '/kategori';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private kecenewsservice: Kecenewsservice,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Check if user is logged in
    const username = localStorage.getItem('app_username') || '';
    const userIdStr = localStorage.getItem('app_user_id') || '0';

    if (!username || userIdStr === '0') {
      this.router.navigate(['/login']);
      return;
    }

    // Get return URL from query params
    this.route.queryParams.subscribe((params) => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  goBack() {
    this.router.navigate([this.returnUrl]);
  }

  async onSubmit() {
    if (!this.categoryName.trim()) {
      await this.showAlert('Error', 'Nama kategori harus diisi!');
      return;
    }

    this.isSubmitting = true;

    this.kecenewsservice
      .createCategory(this.categoryName.trim(), this.description.trim())
      .subscribe(
        async (response: any) => {
          this.isSubmitting = false;
          if (response && response.result === 'success') {
            await this.showAlert('Sukses', 'Kategori berhasil ditambahkan!');
            this.router.navigate([this.returnUrl]);
          } else {
            await this.showAlert(
              'Error',
              response.message || 'Gagal menambahkan kategori'
            );
          }
        },
        async (error) => {
          this.isSubmitting = false;
          console.error('Error creating category:', error);
          await this.showAlert(
            'Error',
            'Terjadi kesalahan saat menambahkan kategori'
          );
        }
      );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
