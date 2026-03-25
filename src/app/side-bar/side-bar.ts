import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
  standalone: false
})
export class SideBar implements OnInit {
  @Input() isSidebarOpen: boolean = true;
  @Input() currentView: string = 'dashboard';
  @Output() toggle = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();
  isLoading: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 6000);
  }

  toggleSidebar() {
    this.toggle.emit();
  }

  onNavClick(view: string, event: Event) {
    event.preventDefault();
    this.navigate.emit(view);
  }
}
