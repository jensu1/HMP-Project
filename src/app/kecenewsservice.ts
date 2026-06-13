import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Kecenewsservice {
  constructor(private http: HttpClient) {}

  // Ganti dengan URL server locallhost
  // BASE_URL = 'http://localhost/hmp_uas';
  BASE_URL = "https://ubaya.cloud/hybrid/160723018/hmp_uas"

  // ==================== AUTH ====================

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    const urlEncodedData = body.toString();

    return this.http.post(this.BASE_URL + '/login.php', urlEncodedData, {
      headers,
    });
  }

  register(
    nama: string,
    email: string,
    username: string,
    password: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('nama', nama);
    body.set('email', email);
    body.set('username', username);
    body.set('password', password);
    const urlEncodedData = body.toString();

    return this.http.post(this.BASE_URL + '/register.php', urlEncodedData, {
      headers,
    });
  }

  // ==================== CATEGORY ====================

  getCategoryList(): Observable<any> {
    return this.http.get(this.BASE_URL + '/category_list.php');
  }

  // ==================== USER PROFILE ====================

  getUserProfile(user_id: number): Observable<any> {
    return this.http.get(
      this.BASE_URL + '/user_profile.php?user_id=' + user_id
    );
  }

  createCategory(nama_kategori: string, deskripsi: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('nama_kategori', nama_kategori);
    body.set('deskripsi', deskripsi);
    const urlEncodedData = body.toString();

    return this.http.post(
      this.BASE_URL + '/category_create.php',
      urlEncodedData,
      { headers }
    );
  }

  // ==================== NEWS ====================

  getNewsList(category_id?: number): Observable<any> {
    let url = this.BASE_URL + '/news_list.php';
    if (category_id) {
      url += '?category_id=' + category_id;
    }
    return this.http.get(url);
  }

  getNewsDetail(news_id: number, user_id?: number): Observable<any> {
    let url = this.BASE_URL + '/news_detail.php?news_id=' + news_id;
    if (user_id) {
      url += '&user_id=' + user_id;
    }
    return this.http.get(url);
  }

  createNews(
    user_id: number,
    judul: string,
    deskripsi: string,
    categories: number[],
    foto_utama?: string,
    images?: string[]
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('user_id', user_id.toString());
    body.set('judul', judul);
    body.set('deskripsi', deskripsi);
    body.set('categories', JSON.stringify(categories));
    if (foto_utama) {
      body.set('foto_utama', foto_utama);
    }
    if (images && images.length > 0) {
      body.set('images', JSON.stringify(images));
    }
    const urlEncodedData = body.toString();

    return this.http.post(this.BASE_URL + '/news_create.php', urlEncodedData, {
      headers,
    });
  }

  deleteNews(news_id: number, user_id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('news_id', news_id.toString());
    body.set('user_id', user_id.toString());
    const urlEncodedData = body.toString();

    return this.http.post(this.BASE_URL + '/news_delete.php', urlEncodedData, {
      headers,
    });
  }

  searchNews(keyword: string): Observable<any> {
    return this.http.get(this.BASE_URL + '/news_search.php?keyword=' + keyword);
  }

  // ==================== COMMENTS ====================

  getComments(news_id: number): Observable<any> {
    return this.http.get(
      this.BASE_URL + '/comment_list.php?news_id=' + news_id
    );
  }

  createComment(
    news_id: number,
    user_id: number,
    comment_text: string,
    parent_comment_id?: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('news_id', news_id.toString());
    body.set('user_id', user_id.toString());
    body.set('comment_text', comment_text);
    if (parent_comment_id) {
      body.set('parent_comment_id', parent_comment_id.toString());
    }
    const urlEncodedData = body.toString();

    return this.http.post(
      this.BASE_URL + '/comment_create.php',
      urlEncodedData,
      { headers }
    );
  }

  deleteComment(comment_id: number, user_id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('comment_id', comment_id.toString());
    body.set('user_id', user_id.toString());
    const urlEncodedData = body.toString();

    return this.http.post(
      this.BASE_URL + '/comment_delete.php',
      urlEncodedData,
      { headers }
    );
  }

  // ==================== RATING ====================

  createRating(
    news_id: number,
    user_id: number,
    rating: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('news_id', news_id.toString());
    body.set('user_id', user_id.toString());
    body.set('rating', rating.toString());
    const urlEncodedData = body.toString();

    return this.http.post(
      this.BASE_URL + '/rating_create.php',
      urlEncodedData,
      { headers }
    );
  }

  getUserRating(news_id: number, user_id: number): Observable<any> {
    return this.http.get(
      this.BASE_URL +
        '/rating_get.php?news_id=' +
        news_id +
        '&user_id=' +
        user_id
    );
  }

  // ==================== FAVORITES ====================

  getFavorites(user_id: number): Observable<any> {
    return this.http.get(
      this.BASE_URL + '/favorite_list.php?user_id=' + user_id
    );
  }

  addFavorite(user_id: number, news_id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('user_id', user_id.toString());
    body.set('news_id', news_id.toString());
    const urlEncodedData = body.toString();

    return this.http.post(this.BASE_URL + '/favorite_add.php', urlEncodedData, {
      headers,
    });
  }

  removeFavorite(user_id: number, news_id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('user_id', user_id.toString());
    body.set('news_id', news_id.toString());
    const urlEncodedData = body.toString();

    return this.http.post(
      this.BASE_URL + '/favorite_remove.php',
      urlEncodedData,
      { headers }
    );
  }

  checkFavorite(user_id: number, news_id: number): Observable<any> {
    return this.http.get(
      this.BASE_URL +
        '/favorite_check.php?user_id=' +
        user_id +
        '&news_id=' +
        news_id
    );
  }

  // ==================== UPLOAD IMAGE ====================

  uploadImage(name: string, base64: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new URLSearchParams();
    body.set('name', name);
    body.set('base64', base64);
    const urlEncodedData = body.toString();

    return this.http.post(this.BASE_URL + '/upload_image.php', urlEncodedData, {
      headers,
    });
  }

  // ==================== LOGOUT ====================

  onLogout(): void {
    localStorage.removeItem('app_username');
    localStorage.removeItem('app_fullname');
    localStorage.removeItem('app_user_id');
  }
}
