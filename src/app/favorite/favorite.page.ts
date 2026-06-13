import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kecenewsservice } from '../kecenewsservice';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: false,
})
export class FavoritePage implements OnInit {
  favoriteNews: any[] = [];
  filteredNews: any[] = [];
  searchTerm: string = '';
  userId: number = 0;

  constructor(
    private router: Router,
    private kecenewsservice: Kecenewsservice
  ) {}

  ngOnInit() {
    const userIdStr = localStorage.getItem('app_user_id') || '0';
    this.userId = parseInt(userIdStr);

    if (this.userId === 0) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadFavorites();
  }

  ionViewWillEnter() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.kecenewsservice.getFavorites(this.userId).subscribe(
      (response: any) => {
        if (response && response.result === 'success') {
          this.favoriteNews = response.data || [];
          this.filteredNews = this.favoriteNews;
        } else {
          this.favoriteNews = [];
          this.filteredNews = [];
        }
      },
      (error) => {
        console.error('Error loading favorites:', error);
        this.favoriteNews = [];
        this.filteredNews = [];
      }
    );
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchTerm = query;

    if (query.trim() === '') {
      this.filteredNews = this.favoriteNews;
    } else {
      this.filteredNews = this.favoriteNews.filter(
        (news) =>
          news.judul.toLowerCase().includes(query) ||
          (news.author_name &&
            news.author_name.toLowerCase().includes(query)) ||
          (news.username && news.username.toLowerCase().includes(query))
      );
    }
  }

  goToDetail(newsId: number) {
    this.router.navigate(['/news-detail'], { queryParams: { id: newsId } });
  }

  removeFavorite(newsId: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.kecenewsservice
      .removeFavorite(this.userId, newsId)
      .subscribe((response: any) => {
        if (response && response.result === 'success') {
          this.loadFavorites();
        }
      });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
