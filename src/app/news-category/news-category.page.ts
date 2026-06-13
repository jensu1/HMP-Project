import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Kecenewsservice } from '../kecenewsservice';

@Component({
  selector: 'app-news-category',
  templateUrl: './news-category.page.html',
  styleUrls: ['./news-category.page.scss'],
  standalone: false,
})
export class NewsCategoryPage implements OnInit {
  categoryId: number = 0;
  categoryName: string = '';
  newsList: any[] = [];
  filteredNews: any[] = [];
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kecenewsservice: Kecenewsservice
  ) {}

  ngOnInit() {
    // Check if user is logged in
    const username = localStorage.getItem('app_username') || '';
    const userIdStr = localStorage.getItem('app_user_id') || '0';

    if (!username || userIdStr === '0') {
      this.router.navigate(['/login']);
      return;
    }

    this.route.queryParams.subscribe((params) => {
      this.categoryId = parseInt(params['id']) || 0;
      this.categoryName = params['name'] || 'Kategori';
      if (this.categoryId > 0) {
        this.loadNews();
      }
    });
  }

  loadNews() {
    this.kecenewsservice.getNewsList(this.categoryId).subscribe(
      (response: any) => {
        if (response && response.result === 'success') {
          this.newsList = response.data || [];
          this.filteredNews = [...this.newsList];
        }
      },
      (error) => {
        console.error('Error loading news:', error);
      }
    );
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchTerm = query;
    if (query === '') {
      this.filteredNews = [...this.newsList];
    } else {
      this.filteredNews = this.newsList.filter((news) => {
        return news.judul.toLowerCase().includes(query);
      });
    }
  }

  goToDetail(newsId: number) {
    this.router.navigate(['/news-detail'], {
      queryParams: { id: newsId },
    });
  }

  rataRata(newsId: number): string {
    const news = this.newsList.find((n) => n.id === newsId);
    if (news && news.avg_rating && news.avg_rating > 0) {
      return Number(news.avg_rating).toFixed(1);
    }
    return '0.0';
  }
}
