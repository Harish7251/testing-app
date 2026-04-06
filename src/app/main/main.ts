import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.html',
  styleUrl: './main.css',
  encapsulation: ViewEncapsulation.None
})
export class Main implements OnInit {
  isLoading: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
    this.loadUsers();

  }

userDetails = {
  name: '',
  email: '',
  contact: '',
  role: 'User',
  status: 'Active',
  imageUrl: '',
  fatherName: ''
};

  uploadedImagePreview: string | ArrayBuffer | null = null;
  isPreviewOpen: boolean = false;

  submittedUsers: {
    name: string; email: string; contact: string; role: string; status: string, imageUrl?: string;  fatherName?: string;
  }[] = [];
  // Search & Pagination
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

  get filteredUsers() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.submittedUsers;
    return this.submittedUsers.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.contact || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q) ||
      (u.status || '').toLowerCase().includes(q)
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch(value: string) {
    this.searchQuery = value;
    this.currentPage = 1;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;
  private toastTimer: any;

  triggerToast(message: string, type: 'success' | 'error' = 'success') {
    clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    this.toastTimer = setTimeout(() => { this.showToast = false; }, 3500);
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImagePreview = e.target.result;

        this.userDetails.imageUrl = e.target.result;

        console.log("IMAGE BASE64:", this.userDetails.imageUrl); // debug
      };
      reader.readAsDataURL(file);
    }
  }
  togglePreview() {
    if (this.uploadedImagePreview) {
      this.isPreviewOpen = !this.isPreviewOpen;
    }
  }

  closePreview() {
    this.isPreviewOpen = false;
  }

  sendData() {
    fetch('https://localhost:7260/api/chat/save-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.userDetails)
    })
      .then(res => res.text())
      .then(text => {
        const data = text ? JSON.parse(text) : {};
        console.log(data);

        this.triggerToast('User details saved successfully!', 'success');

        this.loadUsers(); 404
      })
      .catch(err => {
        console.error(err);
        this.triggerToast('Failed to save user details. Please try again.', 'error');
      });
  }

  loadUsers() {
    fetch('https://localhost:7260/api/chat/get-users')
      .then(res => {
        if (!res.ok) {
          throw new Error("API error: " + res.status);
        }
        return res.text();
      })
      .then(text => {
        console.log("RAW:", text);

        const data = text ? JSON.parse(text) : [];
        this.submittedUsers = data;
      })
      .catch(err => {
        console.error("ERROR:", err);
        this.triggerToast('Failed to load users', 'error');
      });
  }

  selectedImage: string | null = null;

  openImage(img: string) {
    this.uploadedImagePreview = img;
    this.isPreviewOpen = true;
  }

  closeImage() {
    this.selectedImage = null;
  }
}
