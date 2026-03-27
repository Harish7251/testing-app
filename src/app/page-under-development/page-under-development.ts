import { Component, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-page-under-development',
  standalone: false,
  templateUrl: './page-under-development.html',
  styleUrl: './page-under-development.css',
  encapsulation: ViewEncapsulation.None
})
export class PageUnderDevelopment {
  @Output() navigate = new EventEmitter<string>();

  goBack() {
    this.navigate.emit('dashboard');
  }
}
