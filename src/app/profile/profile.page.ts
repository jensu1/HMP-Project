import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kecenewsservice } from '../kecenewsservice';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  userInfo: any = {
    id: 0,
    nama: '',
    username: '',
    email: '',
    created_at: '',
  };

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

    this.loadUserProfile();
  }

  loadUserProfile() {
    const userId = parseInt(localStorage.getItem('app_user_id') || '0');

    this.kecenewsservice.getUserProfile(userId).subscribe(
      (response: any) => {
        if (response && response.result === 'success') {
          this.userInfo = response.data;
        }
      },
      (error) => {
        console.error('Error loading profile:', error);
      }
    );
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
}
