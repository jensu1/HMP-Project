import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Kecenewsservice } from '../kecenewsservice';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
  standalone: false,
})
export class NewsDetailPage implements OnInit {
  newsId: number = 0;
  userId: number = 0;
  newsDetail: any = null;
  comments: any[] = [];
  userRating: number | null = null;
  isFavorite: boolean = false;

  // Carousel properties
  currentImageIndex = 0;
  currentImage = '';
  allImages: string[] = [];

  // Comment properties
  newComment = '';
  replyTexts: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

    this.userId = parseInt(userIdStr);

    this.route.queryParams.subscribe((params) => {
      this.newsId = parseInt(params['id']) || 0;
      if (this.newsId > 0) {
        this.loadNewsDetail();
        this.loadComments();
        this.checkFavorite();
      }
    });
  }

  loadNewsDetail() {
    this.kecenewsservice.getNewsDetail(this.newsId, this.userId).subscribe(
      (response: any) => {
        if (response && response.result === 'success') {
          this.newsDetail = response.data;
          this.setupImages();
          // Pre-fill user rating if already rated
          if (this.newsDetail.user_rating && this.newsDetail.user_rating > 0) {
            this.userRating = this.newsDetail.user_rating;
          }
        }
      },
      (error) => {
        console.error('Error loading news detail:', error);
      }
    );
  }

  setupImages() {
    this.allImages = [];
    if (this.newsDetail.foto_utama) {
      this.allImages.push(this.newsDetail.foto_utama);
    }
    if (this.newsDetail.images && this.newsDetail.images.length > 0) {
      this.newsDetail.images.forEach((img: any) => {
        // Field dari database adalah image_path bukan gambar_berita
        this.allImages.push(img.image_path);
      });
    }
    if (this.allImages.length > 0) {
      this.currentImage = this.allImages[0];
      this.currentImageIndex = 0;
    } else {
      this.currentImage = 'https://via.placeholder.com/400x200';
    }
  }

//   setupImages() {
//   this.allImages = [];
//   if (this.newsDetail.foto_utama) {
//     this.allImages.push(this.newsDetail.foto_utama);
//   }
//   if (this.newsDetail.images && this.newsDetail.images.length > 0) {
//     // Batasi hanya 3 gambar pertama (atau 2 jika sudah ada foto_utama)
//     const maxThumbnails = this.newsDetail.foto_utama ? 2 : 3;
//     const limitedImages = this.newsDetail.images.slice(0, maxThumbnails);
    
//     limitedImages.forEach((img: any) => {
//       this.allImages.push(img.image_path);
//     });
//   }
//   if (this.allImages.length > 0) {
//     this.currentImage = this.allImages[0];
//     this.currentImageIndex = 0;
//   } else {
//     this.currentImage = 'https://via.placeholder.com/400x200';
//   }
// }

  // Carousel methods
  changeImage(index: number) {
    this.currentImageIndex = index;
    this.currentImage = this.allImages[index];
  }

  nextImage() {
    if (this.currentImageIndex < this.allImages.length - 1) {
      this.currentImageIndex++;
      this.currentImage = this.allImages[this.currentImageIndex];
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.currentImage = this.allImages[this.currentImageIndex];
    }
  }

  loadComments() {
    this.kecenewsservice.getComments(this.newsId).subscribe(
      (response: any) => {
        if (response && response.result === 'success') {
          this.comments = response.data || [];
        }
      },
      (error) => {
        console.error('Error loading comments:', error);
      }
    );
  }

  checkFavorite() {
    if (this.userId > 0) {
      this.kecenewsservice
        .checkFavorite(this.userId, this.newsId)
        .subscribe((response: any) => {
          this.isFavorite = response?.is_favorite || false;
        });
    }
  }

  kirimRating() {
    const r = Number(this.userRating);
    if (!this.newsDetail || isNaN(r) || r < 1 || r > 5) {
      alert('Rating harus 1 - 5');
      return;
    }
    this.rateNews(r);
    this.userRating = null;
    alert('Terima kasih atas ratingnya!');
  }

  kirimKomentar() {
    if (this.userId === 0) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.newComment.trim()) {
      alert('Komentar tidak boleh kosong.');
      return;
    }
    this.kecenewsservice
      .createComment(this.newsId, this.userId, this.newComment.trim())
      .subscribe((response: any) => {
        if (response && response.result === 'success') {
          this.newComment = '';
          this.loadComments();
          alert('Komentar terkirim!');
        }
      });
  }

  balasKomentar(parentId: number, index: number) {
    if (this.userId === 0) {
      this.router.navigate(['/login']);
      return;
    }
    const reply = this.replyTexts[index];
    if (!reply || !reply.trim()) {
      alert('Balasan tidak boleh kosong.');
      return;
    }
    this.kecenewsservice
      .createComment(this.newsId, this.userId, reply.trim(), parentId)
      .subscribe((response: any) => {
        if (response && response.result === 'success') {
          this.replyTexts[index] = '';
          this.loadComments();
          alert('Balasan terkirim!');
        }
      });
  }

  hapusKomentar(commentId: number) {
    if (this.userId === 0) {
      this.router.navigate(['/login']);
      return;
    }
    if (confirm('Hapus komentar ini?')) {
      this.kecenewsservice
        .deleteComment(commentId, this.userId)
        .subscribe((response: any) => {
          if (response && response.result === 'success') {
            this.loadComments();
          }
        });
    }
  }

  hapusReply(replyId: number) {
    if (this.userId === 0) {
      this.router.navigate(['/login']);
      return;
    }
    if (confirm('Hapus balasan ini?')) {
      this.kecenewsservice
        .deleteComment(replyId, this.userId)
        .subscribe((response: any) => {
          if (response && response.result === 'success') {
            this.loadComments();
          }
        });
    }
  }

  totalKomentar() {
    if (!this.comments) {
      return 0;
    }
    let total = this.comments.length;
    this.comments.forEach((comment: any) => {
      if (comment.replies && comment.replies.length > 0) {
        total += comment.replies.length;
      }
    });
    return total;
  }

  toggleFavorite() {
    if (this.userId === 0) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isFavorite) {
      this.kecenewsservice
        .removeFavorite(this.userId, this.newsId)
        .subscribe((response: any) => {
          if (response && response.result === 'success') {
            this.isFavorite = false;
          }
        });
    } else {
      this.kecenewsservice
        .addFavorite(this.userId, this.newsId)
        .subscribe((response: any) => {
          if (response && response.result === 'success') {
            this.isFavorite = true;
          }
        });
    }
  }

  rateNews(rating: number) {
    if (this.userId === 0) {
      this.router.navigate(['/login']);
      return;
    }

    this.kecenewsservice
      .createRating(this.newsId, this.userId, rating)
      .subscribe((response: any) => {
        if (response && response.result === 'success') {
          this.userRating = rating;
          this.loadNewsDetail(); // Reload to get updated rating
        }
      });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async deleteNews() {
    if (this.userId === 0) {
      this.router.navigate(['/login']);
      return;
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
            this.kecenewsservice.deleteNews(this.newsId, this.userId).subscribe(
              async (response: any) => {
                if (response && response.result === 'success') {
                  await this.showAlert('Sukses', 'Berita berhasil dihapus!');
                  this.router.navigate(['/home']);
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
}
