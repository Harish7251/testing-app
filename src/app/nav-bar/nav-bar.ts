import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
  standalone: false
})
export class NavBar implements OnInit {
  @Output() toggle = new EventEmitter<void>();
  isLoading: boolean = true;
  isDarkTheme: boolean = false;
  isProfileOpen: boolean = false;

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  ngOnInit() {
    if (document.body.classList.contains('dark-theme')) {
      this.isDarkTheme = true;
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 6000);
  }

  toggleSidebar() {
    this.toggle.emit();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
