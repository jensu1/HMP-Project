import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kecenewsservice } from '../kecenewsservice';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  newsList: any[] = [];
  filteredNews: any[] = [];
  searchTerm: string = '';
  username: string = '';
  userId: number = 0;

  constructor(
    private router: Router,
    private kecenewsservice: Kecenewsservice,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    // Cek login dari localStorage
    this.username = localStorage.getItem('app_username') || '';
    const userIdStr = localStorage.getItem('app_user_id') || '0';
    this.userId = parseInt(userIdStr);

    if (!this.username) {
      this.router.navigate(['/login']);
      return;
    }

    // Load news dari API
    this.loadNews();
  }

  ionViewWillEnter() {
    this.loadNews();
  }

  loadNews() {
    this.kecenewsservice.getNewsList().subscribe(
      (response: any) => {
        if (response && response.result === 'success') {
          this.newsList = response.data || [];
          this.filteredNews = this.newsList;
        } else {
          this.newsList = [];
          this.filteredNews = [];
        }
      },
      (error) => {
        console.error('Error loading news:', error);
        this.newsList = [];
        this.filteredNews = [];
      }
    );
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchTerm = query;

    if (query.trim() === '') {
      this.filteredNews = this.newsList;
    } else {
      this.filteredNews = this.newsList.filter((news) =>
        news.judul.toLowerCase().includes(query)
      );
    }
  }

  goToDetail(newsId: number) {
    this.router.navigate(['/news-detail'], { queryParams: { id: newsId } });
  }

  rataRata(id: number) {
    // Cari news berdasarkan id
    const news = this.newsList.find((n) => n.id === id);
    if (news && news.avg_rating) {
      return parseFloat(news.avg_rating).toFixed(1);
    }
    return '0.0';
  }

  onLogout() {
    const konfirmasi = confirm('Apakah Anda yakin ingin keluar?');

    if (konfirmasi) {
      localStorage.removeItem('app_username');
      localStorage.removeItem('app_fullname');
      localStorage.removeItem('app_user_id');
      alert('Anda berhasil logout!');
      this.router.navigate(['/login']);
    }
  }

  async deleteNews(newsId: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin menghapus berita ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.kecenewsservice.deleteNews(newsId, this.userId).subscribe(
              async (response: any) => {
                if (response && response.result === 'success') {
                  await this.showAlert('Sukses', 'Berita berhasil dihapus!');
                  this.loadNews();
                } else {
                  await this.showAlert(
                    'Error',
                    response.message || 'Gagal menghapus berita'
                  );
                }
              },
              async (error) => {
                console.error('Error deleting news:', error);
                await this.showAlert(
                  'Error',
                  'Terjadi kesalahan saat menghapus berita'
                );
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToAddNews() {
    this.router.navigate(['/add-news']);
  }
}
