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
  isShaking = false;

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

  shakeForm() {
    this.isShaking = true;
    setTimeout(() => {
      this.isShaking = false;
    }, 500);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    this.isLoading = true;

    // Simulate login delay
    setTimeout(() => {
      this.isLoading = false;

      // Mock auth handling without backend
      this.authService.handleLoginSuccess({ token: 'mock-token' });

      // Emit login success
      this.loginSuccess.emit();

      // Navigate to home
      this.router.navigate(['/']);
    }, 800);
  }
}