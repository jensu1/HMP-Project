import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kecenewsservice } from '../kecenewsservice';

@Component({
  selector: 'app-kategori',
  templateUrl: './kategori.page.html',
  styleUrls: ['./kategori.page.scss'],
  standalone: false,
})
export class KategoriPage implements OnInit {
  categories: any[] = [];

  constructor(
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

  goToCategory(categoryId: number, categoryName: string) {
    this.router.navigate(['/news-category'], {
      queryParams: { id: categoryId, name: categoryName },
    });
  }

  goToAddCategory() {
    this.router.navigate(['/add-category']);
  }
}
