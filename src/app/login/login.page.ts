import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Kecenewsservice } from '../kecenewsservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  username = '';
  password = '';
  fullname = '';

  constructor(
    private router: Router,
    private kecenewsservice: Kecenewsservice
  ) {
    // Cek localStorage saat constructor
    this.username = localStorage.getItem('app_username') || '';
    this.fullname = localStorage.getItem('app_fullname') || '';
  }

  ngOnInit(): void {
    // Redirect jika sudah login
    if (this.username && this.fullname) {
      this.router.navigate(['/home']);
    }
  }

  ionViewWillEnter() {
    if (this.username && this.fullname) {
      this.router.navigate(['/home']);
    }
  }

  onLogin(): void {
    // Validasi input kosong
    if (!this.username || !this.password) {
      alert('Username dan password harus diisi!');
      return;
    }

    // Login menggunakan service
    this.kecenewsservice
      .login(this.username, this.password)
      .subscribe((response: any) => {
        console.log('Login response:', response);

        if (response.result === 'success') {
          // Server mengembalikan 'nama' bukan 'fullname'
          const fullname = response.nama || response.fullname || this.username;
          alert(`Selamat datang, ${fullname}!`);

          // Menyimpan data ke localStorage
          localStorage.setItem('app_username', this.username);
          localStorage.setItem('app_fullname', fullname);
          localStorage.setItem('app_user_id', response.user_id);

          console.log('Data tersimpan:', {
            username: this.username,
            fullname: fullname,
            user_id: response.user_id,
          });

          // Bersihkan form setelah login berhasil
          this.username = '';
          this.password = '';

          this.router.navigate(['/home']);
        } else {
          alert(response.message || 'Username atau password salah!');
        }
      });
  }

  logout(): void {
    this.username = '';
    this.password = '';
    this.fullname = '';

    localStorage.removeItem('app_username');
    localStorage.removeItem('app_fullname');
    localStorage.removeItem('app_user_id');
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
