import { Component, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { AuthService } from '../services/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
  encapsulation: ViewEncapsulation.None
})
export class Login implements OnInit {

  @Output() loginSuccess = new EventEmitter<void>();

  username = '';
  password = '';
  isLoading = false;
  isDarkTheme = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isDarkTheme = document.body.classList.contains('dark-theme');
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;

    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.username || !this.password) {
      alert('Please enter both username and password');
      return;
    }

    this.isLoading = true;

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        // 🔥 AUTH HANDLING (ONLY THIS IS REQUIRED)
        this.authService.handleLoginSuccess(res);

        // optional emit
        this.loginSuccess.emit();

        // redirect after login
        this.router.navigate(['/']);
      },

      error: (err) => {
        this.isLoading = false;

        console.log(err);
        alert(err?.error?.message || 'Invalid username or password');
      }
    });
  }
}