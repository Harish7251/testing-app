import { Component } from '@angular/core';
import { AuthService } from '../services/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  user = {
    username: '',
    password: ''
  };

  isLoading = false;
  isDarkTheme = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

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
    
    this.isLoading = true;
    this.register();
  }

  register() {
    this.authService.register(this.user).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert('User registered successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        alert('Registration failed. Please try again.');
        console.log(err);
      }
    });
  }
}