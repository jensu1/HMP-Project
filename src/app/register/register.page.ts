import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kecenewsservice } from '../kecenewsservice';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  nama = '';
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private router: Router,
    private kecenewsservice: Kecenewsservice
  ) {}

  ngOnInit() {}

  onRegister(): void {
    // Validasi input kosong
    if (
      !this.nama ||
      !this.username ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      alert('Semua field harus diisi!');
      return;
    }

    // Validasi nama tidak boleh ada angka
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(this.nama)) {
      alert('Nama tidak boleh mengandung angka!');
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('Format email tidak valid!');
      return;
    }

    // Validasi password minimal 8 karakter
    if (this.password.length < 8) {
      alert('Password minimal 8 karakter!');
      return;
    }

    // Validasi konfirmasi password
    if (this.password !== this.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }

    // Kirim data registrasi ke backend
    this.kecenewsservice
      .register(this.nama, this.email, this.username, this.password)
      .subscribe(
        (response: any) => {
          if (response.result === 'success') {
            alert('Registrasi berhasil! Silakan login.');
            this.router.navigate(['/login']);
          } else {
            // Tampilkan pesan error dari backend
            // Misalnya: "Username sudah terdaftar" atau "Email sudah digunakan"
            alert(response.message || 'Registrasi gagal!');
          }
        },
        (error) => {
          alert('Terjadi kesalahan pada server. Silakan coba lagi.');
          console.error('Register error:', error);
        }
      );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
