import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
  standalone: false
})
export class NavBar implements OnInit {
  @Input() isScrolled: boolean = false;
  @Output() toggle = new EventEmitter<void>();
  isLoading: boolean = true;
  isDarkTheme: boolean = false;
  isProfileOpen: boolean = false;

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  ngOnInit() {
    // ✅ Restore theme from localStorage on app load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme = true;
      document.body.classList.add('dark-theme');
    } else {
      this.isDarkTheme = false;
      document.body.classList.remove('dark-theme');
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 1200);
  }

  toggleSidebar() {
    this.toggle.emit();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark'); // ✅ Persist dark mode
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light'); // ✅ Persist light mode
    }
  }
}
