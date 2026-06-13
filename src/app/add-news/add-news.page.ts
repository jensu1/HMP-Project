import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kecenewsservice } from '../kecenewsservice';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.page.html',
  styleUrls: ['./add-news.page.scss'],
  standalone: false,
})
export class AddNewsPage implements OnInit {
  newsTitle: string = '';
  description: string = '';
  mainPhotoUrl: string = '';
  thumbnailUrls: Array<{ id: number; url: string }> = [
    { id: 1, url: '' },
    { id: 2, url: '' },
    { id: 3, url: '' },
  ];
  nextThumbnailId: number = 4;
  selectedCategories: number[] = [];
  categories: any[] = [];
  isSubmitting: boolean = false;
  userId: number = 0;

  constructor(
    private router: Router,
    private kecenewsservice: Kecenewsservice,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Check if user is logged in
    const username = localStorage.getItem('app_username') || '';
    const userIdStr = localStorage.getItem('app_user_id') || '0';
    this.userId = parseInt(userIdStr);

    if (!username || userIdStr === '0') {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCategories();
  }

  ionViewWillEnter() {
    // Reload categories when returning from add-category page
    this.loadCategories();
  }

  loadCategories() {
    this.kecenewsservice.getCategoryList().subscribe(
      (response: any) => {
        if (response && response.result === 'success') {
          this.categories = response.data || [];
        }
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  addThumbnail() {
    this.thumbnailUrls.push({ id: this.nextThumbnailId++, url: '' });
  }

  removeThumbnail(index: number) {
    this.thumbnailUrls.splice(index, 1);
  }

  areAllThumbnailsFilled(): boolean {
    return this.thumbnailUrls.every((thumb) => thumb.url.trim() !== '');
  }

  goToAddCategory() {
    this.router.navigate(['/add-category'], {
      queryParams: { returnUrl: '/add-news' },
    });
  }

  async onSubmit() {
    if (
      !this.newsTitle.trim() ||
      !this.description.trim() ||
      !this.mainPhotoUrl.trim() ||
      this.thumbnailUrls.length < 3 ||
      !this.areAllThumbnailsFilled() ||
      this.selectedCategories.length === 0
    ) {
      await this.showAlert(
        'Error',
        'Semua field harus diisi! Foto thumbnail minimal 3 buah.'
      );
      return;
    }

    this.isSubmitting = true;

    const thumbnailUrlsOnly = this.thumbnailUrls.map((thumb) => thumb.url);

    this.kecenewsservice
      .createNews(
        this.userId,
        this.newsTitle.trim(),
        this.description.trim(),
        this.selectedCategories,
        this.mainPhotoUrl.trim(),
        thumbnailUrlsOnly
      )
      .subscribe(
        async (response: any) => {
          this.isSubmitting = false;
          if (response && response.result === 'success') {
            await this.showAlert('Sukses', 'Berita berhasil ditambahkan!');
            this.clearForm();
            this.router.navigate(['/home']);
          } else if (response.message === 'Judul berita sudah ada') {
            await this.showAlert(
              'Error',
              'Judul berita sudah ada. Silakan gunakan judul yang berbeda.'
            );
          } else {
            await this.showAlert(
              'Error',
              response.message || 'Gagal menambahkan berita'
            );
          }
        },
        async (error) => {
          this.isSubmitting = false;
          console.error('Error creating news:', error);
          await this.showAlert(
            'Error',
            'Terjadi kesalahan saat menambahkan berita'
          );
        }
      );
  }

  clearForm() {
    this.newsTitle = '';
    this.description = '';
    this.mainPhotoUrl = '';
    this.thumbnailUrls = [
      { id: this.nextThumbnailId++, url: '' },
      { id: this.nextThumbnailId++, url: '' },
      { id: this.nextThumbnailId++, url: '' },
    ];
    this.selectedCategories = [];
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
