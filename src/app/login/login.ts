import { Component, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';

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

  ngOnInit() {
    if (document.body.classList.contains('dark-theme')) {
      this.isDarkTheme = true;
    }
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
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.loginSuccess.emit();
    }, 1500); 
  }
}
